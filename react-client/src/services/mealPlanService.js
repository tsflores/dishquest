import { apiFetch } from './api';

export const mealPlanService = {
  list: (weekStart) =>
    apiFetch(`/api/meal-plans${weekStart ? `?weekStart=${weekStart}` : ''}`),
  get: (id) => apiFetch(`/api/meal-plans/${id}`),
  create: (weekStart) =>
    apiFetch('/api/meal-plans', { method: 'POST', body: JSON.stringify({ weekStart }) }),
  delete: (id) => apiFetch(`/api/meal-plans/${id}`, { method: 'DELETE' }),
  addSlot: (id, slot) =>
    apiFetch(`/api/meal-plans/${id}/slots`, { method: 'POST', body: JSON.stringify(slot) }),
  removeSlot: (id, slotId) =>
    apiFetch(`/api/meal-plans/${id}/slots/${slotId}`, { method: 'DELETE' }),
};
