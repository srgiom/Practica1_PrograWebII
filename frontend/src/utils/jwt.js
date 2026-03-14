function normalizeBase64Url(value) {
  const withBase64Chars = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = withBase64Chars.length % 4;
  if (!padding) return withBase64Chars;
  return withBase64Chars.padEnd(withBase64Chars.length + (4 - padding), '=');
}

function decodeBase64(value) {
  if (typeof atob === 'function') {
    const decoded = atob(value);
    const bytes = Uint8Array.from(decoded, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }

  return Buffer.from(value, 'base64').toString('utf8');
}

export function decodeJwtPayload(token) {
  if (!token || typeof token !== 'string') {
    throw new Error('Token JWT inválido');
  }

  const parts = token.split('.');
  if (parts.length < 2) {
    throw new Error('Formato de token no reconocido');
  }

  try {
    const payloadJson = decodeBase64(normalizeBase64Url(parts[1]));
    const payload = JSON.parse(payloadJson);
    return payload;
  } catch {
    throw new Error('No se pudo leer el token');
  }
}
