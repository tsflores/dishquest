const MealPlan = require('../models/mealPlanModel');

class MealPlanService {
  static async listForUser(userID, weekStart) {
    const query = { userID };
    if (weekStart) {
      const start = new Date(weekStart);
      const end = new Date(start);
      end.setDate(end.getDate() + 7);
      query.weekStart = { $gte: start, $lt: end };
    }
    return MealPlan.find(query).sort({ weekStart: -1 });
  }

  static async find(id, userID) {
    return MealPlan.findOne({ _id: id, userID });
  }

  static async create(userID, weekStart) {
    const date = new Date(weekStart);
    // Normalize to Monday of the given week
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    date.setDate(date.getDate() + diff);
    date.setHours(0, 0, 0, 0);

    const existing = await MealPlan.findOne({ userID, weekStart: date });
    if (existing) return existing;

    const plan = new MealPlan({ userID, weekStart: date, slots: [] });
    return plan.save();
  }

  static async addSlot(mealPlanId, userID, slot) {
    const plan = await MealPlan.findOne({ _id: mealPlanId, userID });
    if (!plan) return null;
    plan.slots.push(slot);
    return plan.save();
  }

  static async removeSlot(mealPlanId, userID, slotId) {
    const plan = await MealPlan.findOne({ _id: mealPlanId, userID });
    if (!plan) return null;
    plan.slots = plan.slots.filter((s) => s._id.toString() !== slotId);
    return plan.save();
  }

  static async update(id, userID, data) {
    return MealPlan.findOneAndUpdate({ _id: id, userID }, data, { new: true });
  }

  static async delete(id, userID) {
    return MealPlan.findOneAndDelete({ _id: id, userID });
  }
}

module.exports = MealPlanService;
