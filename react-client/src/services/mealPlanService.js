import { apiFetch } from './api';

export const mealPlanService = {
  list: () => apiFetch('/api/meal-plans'),
  get: (id) => apiFetch(`/api/meal-plans/${id}`),
  create: () => apiFetch('/api/meal-plans', { method: 'POST' }),
  delete: (id) => apiFetch(`/api/meal-plans/${id}`, { method: 'DELETE' }),
  addSlot: (id, slot) =>
    apiFetch(`/api/meal-plans/${id}/slots`, { method: 'POST', body: JSON.stringify(slot) }),
  removeSlot: (id, slotId) =>
    apiFetch(`/api/meal-plans/${id}/slots/${slotId}`, { method: 'DELETE' }),
};
