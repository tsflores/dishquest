import { apiFetch } from './api';

export const externalRecipeService = {
  get: (id) => apiFetch(`/api/external-recipes/${id}`),
  save: (data) => apiFetch('/api/external-recipes', { method: 'POST', body: JSON.stringify(data) }),
};
