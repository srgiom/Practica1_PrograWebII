const allowedRoutes = new Set(['/login', '/productos', '/perfil', '/usuarios']);

function normalizePath(path) {
  if (!path || path === '/') {
    return '/login';
  }

  return allowedRoutes.has(path) ? path : '/productos';
}

export const routerState = $state({
  path: '/login'
});

export function initRouter() {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const updatePath = () => {
    routerState.path = normalizePath(window.location.pathname);
  };

  updatePath();
  window.addEventListener('popstate', updatePath);

  return () => {
    window.removeEventListener('popstate', updatePath);
  };
}

export function navigate(path, options = {}) {
  if (typeof window === 'undefined') {
    return;
  }

  const { replace = false } = options;
  const targetPath = normalizePath(path);

  if (routerState.path === targetPath) {
    return;
  }

  if (replace) {
    window.history.replaceState({}, '', targetPath);
  } else {
    window.history.pushState({}, '', targetPath);
  }

  routerState.path = targetPath;
}
