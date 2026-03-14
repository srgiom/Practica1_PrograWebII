<script>
  let {
    onLogin = async () => {}
  } = $props();

  let form = $state({
    username: '',
    password: ''
  });

  let busy = $state(false);
  let errorMessage = $state('');

  const canSubmit = $derived(
    !busy && form.username.trim().length > 0 && form.password.length > 0
  );

  async function handleSubmit(event) {
    event.preventDefault();
    errorMessage = '';
    busy = true;

    try {
      await onLogin({
        username: form.username.trim(),
        password: form.password
      });
    } catch (error) {
      errorMessage = error.message;
    } finally {
      busy = false;
    }
  }
</script>

<section class="login-page">
  <div class="login-card">
    <h1>Acceso a inventario</h1>
    <p class="muted">Inicia sesión para gestionar productos y usuarios.</p>

    <form onsubmit={handleSubmit} class="form-grid">
      <label>
        Usuario
        <input type="text" bind:value={form.username} autocomplete="username" required />
      </label>

      <label>
        Contraseña
        <input type="password" bind:value={form.password} autocomplete="current-password" required />
      </label>

      {#if errorMessage}
        <p class="error-text">{errorMessage}</p>
      {/if}

      <button type="submit" class="primary-btn" disabled={!canSubmit}>
        {busy ? 'Entrando...' : 'Entrar'}
      </button>
    </form>

    <p class="hint">
      El backend incluye roles `user` y `admin`; las acciones se habilitan automáticamente según el token JWT.
    </p>
  </div>
</section>
