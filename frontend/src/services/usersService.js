import { apiRequest } from './http.js';

export async function fetchUsers(token) {
  return apiRequest('/users', { token });
}

export async function createUser(token, userInput) {
  return apiRequest('/users', {
    method: 'POST',
    token,
    body: userInput
  });
}

export async function updateUser(token, userId, userInput) {
  return apiRequest(`/users/${userId}`, {
    method: 'PUT',
    token,
    body: userInput
  });
}

export async function deleteUser(token, userId) {
  return apiRequest(`/users/${userId}`, {
    method: 'DELETE',
    token
  });
}
