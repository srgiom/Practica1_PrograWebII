import { apiRequest } from './http.js';

export async function loginRequest({ username, password }) {
  return apiRequest('/login', {
    method: 'POST',
    body: { username, password }
  });
}
