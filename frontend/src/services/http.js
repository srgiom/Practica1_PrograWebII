const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api').replace(/\/+$/, '');
const API_ROOT_URL = API_BASE_URL.replace(/\/api$/i, '');

export class ApiError extends Error {
  constructor(message, status, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

function toErrorMessage(payload, fallback) {
  if (!payload) return fallback;
  if (typeof payload === 'string') return payload;
  if (payload.message) return payload.message;
  if (payload.error) return payload.error;
  return fallback;
}

export async function apiRequest(path, options = {}) {
  const {
    method = 'GET',
    token = null,
    body = undefined,
    headers = {}
  } = options;

  const requestHeaders = new Headers(headers);

  if (token) {
    requestHeaders.set('Authorization', `Bearer ${token}`);
  }

  let finalBody = body;
  if (body && !(body instanceof FormData)) {
    requestHeaders.set('Content-Type', 'application/json');
    finalBody = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: requestHeaders,
      body: finalBody
    });
  } catch {
    throw new ApiError('No se pudo conectar con el backend', 0);
  }

  const contentType = response.headers.get('content-type') || '';
  const hasBody = response.status !== 204;
  let payload = null;

  if (hasBody) {
    payload = contentType.includes('application/json')
      ? await response.json()
      : await response.text();
  }

  if (!response.ok) {
    throw new ApiError(
      toErrorMessage(payload, `Error HTTP ${response.status}`),
      response.status,
      payload
    );
  }

  return payload;
}

export function productImageUrl(fileName) {
  if (!fileName) return '';
  if (fileName.startsWith('http://') || fileName.startsWith('https://')) return fileName;
  return `${API_ROOT_URL}/uploads/${fileName}`;
}
