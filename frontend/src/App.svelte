<script>
  import { onMount } from 'svelte';
  import NavBar from './components/layout/NavBar.svelte';
  import FlashMessage from './components/ui/FlashMessage.svelte';
  import LoginPage from './pages/LoginPage.svelte';
  import ProductsPage from './pages/ProductsPage.svelte';
  import ProfilePage from './pages/ProfilePage.svelte';
  import UsersPage from './pages/UsersPage.svelte';
  import { loginRequest } from './services/authService.js';
  import { ApiError } from './services/http.js';
  import {
    authState,
    setSession,
    clearSession
  } from './state/auth.svelte.js';
  import { routerState, initRouter, navigate } from './state/router.svelte.js';
  import { productsState } from './state/products.svelte.js';
  import { usersState } from './state/users.svelte.js';
  import { uiState, clearFlash, showFlash } from './state/ui.svelte.js';

  const isAuthenticated = $derived(Boolean(authState.token && authState.user));
  const isAdmin = $derived(authState.user?.role === 'admin');
  const authUsername = $derived(authState.user?.username || 'Invitado');

  onMount(() => {
    return initRouter();
  });

  $effect(() => {
    const path = routerState.path;

    if (!isAuthenticated && path !== '/login') {
      navigate('/login', { replace: true });
      return;
    }

    if (isAuthenticated && path === '/login') {
      navigate('/productos', { replace: true });
    }
  });

  $effect(() => {
    if (!authState.user?.exp || typeof window === 'undefined') {
      return;
    }

    const delay = authState.user.exp * 1000 - Date.now();

    if (delay <= 0) {
      clearSession();
      productsState.items = [];
      usersState.items = [];
      navigate('/login', { replace: true });
      showFlash('error', 'La sesión expiró. Vuelve a iniciar sesión.');
      return;
    }

    const timeoutId = window.setTimeout(() => {
      clearSession();
      productsState.items = [];
      usersState.items = [];
      navigate('/login', { replace: true });
      showFlash('error', 'La sesión expiró. Vuelve a iniciar sesión.');
    }, delay);

    return () => window.clearTimeout(timeoutId);
  });

  async function handleLogin(credentials) {
    authState.loading = true;
    authState.error = '';

    try {
      const response = await loginRequest(credentials);

      if (!response?.token) {
        throw new Error('El backend no devolvió un token válido');
      }

      setSession(response.token);
      showFlash('success', `Bienvenido, ${authState.user?.username || 'usuario'}`);
      navigate('/productos', { replace: true });
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'No se pudo iniciar sesión';
      authState.error = message;
      throw new Error(message);
    } finally {
      authState.loading = false;
    }
  }

  function handleLogout() {
    clearSession();
    productsState.items = [];
    usersState.items = [];
    navigate('/login', { replace: true });
    showFlash('success', 'Sesión cerrada correctamente');
  }
</script>

<div class="app-shell">
  {#if isAuthenticated}
    <NavBar
      currentPath={routerState.path}
      isAdmin={isAdmin}
      username={authUsername}
      onNavigate={navigate}
      onLogout={handleLogout}
    />
  {/if}

  <main class="content-wrap">
    {#if routerState.path === '/login'}
      <LoginPage onLogin={handleLogin} />
    {:else if routerState.path === '/productos'}
      <ProductsPage />
    {:else if routerState.path === '/perfil'}
      <ProfilePage onLogout={handleLogout} />
    {:else if routerState.path === '/usuarios'}
      <UsersPage />
    {:else}
      <section class="page-shell">
        <article class="empty-state">
          <h1>Página no encontrada</h1>
          <p>La ruta no existe en esta SPA.</p>
        </article>
      </section>
    {/if}
  </main>

  <FlashMessage flash={uiState.flash} onClose={clearFlash} />
</div>
