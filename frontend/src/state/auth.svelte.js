import { decodeJwtPayload } from '../utils/jwt.js';

const STORAGE_KEY = 'pwii-auth-session';

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function getStoredSession() {
  if (!canUseStorage()) {
    return { token: null, user: null };
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { token: null, user: null };
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed.token) {
      return { token: null, user: null };
    }

    const payload = decodeJwtPayload(parsed.token);
    if (payload.exp && payload.exp * 1000 <= Date.now()) {
      window.localStorage.removeItem(STORAGE_KEY);
      return { token: null, user: null };
    }

    return {
      token: parsed.token,
      user: {
        id: payload.id,
        username: payload.username,
        role: payload.role || 'user',
        exp: payload.exp || null
      }
    };
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return { token: null, user: null };
  }
}

const initialSession = getStoredSession();

export const authState = $state({
  token: initialSession.token,
  user: initialSession.user,
  loading: false,
  error: ''
});

function persistSession() {
  if (!canUseStorage()) {
    return;
  }

  if (!authState.token || !authState.user) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: authState.token }));
}

export function setSession(token) {
  const payload = decodeJwtPayload(token);

  authState.token = token;
  authState.user = {
    id: payload.id,
    username: payload.username,
    role: payload.role || 'user',
    exp: payload.exp || null
  };
  authState.error = '';

  persistSession();
}

export function clearSession() {
  authState.token = null;
  authState.user = null;
  authState.error = '';

  persistSession();
}
