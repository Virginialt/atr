import config from './config';

export const API_BASE = config.API_BASE;

function getToken() {
  return sessionStorage.getItem('token');
}

export async function api(endpoint, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

  if (response.status === 401) {
    sessionStorage.clear();
    window.location.href = '/login';
    throw new Error('Sesión expirada');
  }

  return response;
}

export function logout() {
  sessionStorage.clear();
  window.location.href = '/login';
}

export function isAuthenticated() {
  return !!getToken();
}
