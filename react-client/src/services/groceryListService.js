import { apiFetch } from './api';

export const groceryListService = {
  list: () => apiFetch('/api/grocery-lists'),
  get: (id) => apiFetch(`/api/grocery-lists/${id}`),
  create: (title) => apiFetch('/api/grocery-lists', { method: 'POST', body: JSON.stringify({ title }) }),
  generate: (mealPlanId) =>
    apiFetch('/api/grocery-lists/generate', { method: 'POST', body: JSON.stringify({ mealPlanId }) }),
  addItem: (id, item) =>
    apiFetch(`/api/grocery-lists/${id}/items`, { method: 'POST', body: JSON.stringify(item) }),
  toggleItem: (id, itemId) =>
    apiFetch(`/api/grocery-lists/${id}/items/${itemId}`, { method: 'PUT' }),
  removeItem: (id, itemId) =>
    apiFetch(`/api/grocery-lists/${id}/items/${itemId}`, { method: 'DELETE' }),
  delete: (id) => apiFetch(`/api/grocery-lists/${id}`, { method: 'DELETE' }),
};
