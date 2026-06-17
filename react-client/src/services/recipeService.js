import { apiFetch } from './api';

export const recipeService = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/api/recipes${qs ? `?${qs}` : ''}`);
  },
  get: (id) => apiFetch(`/api/recipes/${id}`),
};
