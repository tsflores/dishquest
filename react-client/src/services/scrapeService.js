import { apiFetch } from './api';

export const scrapeService = {
  scrape: (url) =>
    apiFetch('/api/scrape', { method: 'POST', body: JSON.stringify({ url }) }),
};
