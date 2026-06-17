import { apiFetch } from './api';

export const collectionService = {
  list: () => apiFetch('/api/collections'),
  create: (name) =>
    apiFetch('/api/collections', { method: 'POST', body: JSON.stringify({ name }) }),
  rename: (id, name) =>
    apiFetch(`/api/collections/${id}`, { method: 'PUT', body: JSON.stringify({ name }) }),
  delete: (id) => apiFetch(`/api/collections/${id}`, { method: 'DELETE' }),
  addRecipe: (id, recipe) =>
    apiFetch(`/api/collections/${id}/recipes`, { method: 'POST', body: JSON.stringify(recipe) }),
  removeRecipe: (id, recipeId) =>
    apiFetch(`/api/collections/${id}/recipes/${recipeId}`, { method: 'DELETE' }),
};
