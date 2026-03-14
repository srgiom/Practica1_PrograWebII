<script>
  import { authState } from '../state/auth.svelte.js';

  let {
    onLogout = () => {}
  } = $props();

  const roleLabel = $derived(authState.user?.role === 'admin' ? 'Administrador' : 'Usuario');
  const expiresAt = $derived(
    authState.user?.exp
      ? new Date(authState.user.exp * 1000).toLocaleString('es-ES')
      : 'No disponible'
  );
</script>

<section class="page-shell">
  <header class="page-header">
    <div>
      <h1>Perfil</h1>
      <p class="muted">Información del token y del usuario autenticado.</p>
    </div>
  </header>

  <article class="profile-card">
    <p><strong>Usuario:</strong> {authState.user?.username}</p>
    <p><strong>Rol:</strong> {roleLabel}</p>
    <p><strong>ID:</strong> {authState.user?.id}</p>
    <p><strong>Expira:</strong> {expiresAt}</p>

    <div class="form-actions">
      <button type="button" class="danger-btn" onclick={onLogout}>Cerrar sesión</button>
    </div>
  </article>
</section>
