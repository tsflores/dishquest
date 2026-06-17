import { useCallback } from 'react';
import { apiFetch } from '../services/api';
import { useAuth } from './useAuth';

export function useApi() {
  const { logout } = useAuth();

  return useCallback(async (path, options = {}) => {
    try {
      return await apiFetch(path, options);
    } catch (err) {
      if (err.message.includes('Authentication required') || err.message.includes('Invalid or expired token')) {
        logout();
      }
      throw err;
    }
  }, [logout]);
}
