import { API_KEY } from './constants';

export function headers(body) {
  const headers = new Headers();

  if (API_KEY) {
    headers.append('X-Noroff-API-Key', API_KEY);
  }

  if (localStorage.token) {
    headers.append('Authorization', `Bearer ${localStorage.token}`);
  }

  if (body) {
    headers.append('Content-type', 'application/json');
  }

  return headers;
}
