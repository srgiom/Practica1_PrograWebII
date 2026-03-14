let messageTimeout = null;

export const uiState = $state({
  flash: null
});

export function showFlash(type, text, timeoutMs = 3500) {
  uiState.flash = { type, text };

  if (typeof window === 'undefined') {
    return;
  }

  if (messageTimeout) {
    window.clearTimeout(messageTimeout);
  }

  messageTimeout = window.setTimeout(() => {
    uiState.flash = null;
    messageTimeout = null;
  }, timeoutMs);
}

export function clearFlash() {
  uiState.flash = null;

  if (typeof window !== 'undefined' && messageTimeout) {
    window.clearTimeout(messageTimeout);
    messageTimeout = null;
  }
}
