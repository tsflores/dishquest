import { apiFetch } from './api';

export const edamamService = {
  search: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/api/edamam/search?${qs}`);
  },
};
