<script>
  let {
    initialUser = null,
    busy = false,
    onCancel = () => {},
    onSave = () => {}
  } = $props();

  let form = $state({
    username: '',
    password: '',
    role: 'user'
  });

  let validationError = $state('');

  const isEditing = $derived(Boolean(initialUser));
  const title = $derived(isEditing ? 'Editar usuario' : 'Nuevo usuario');
  const submitLabel = $derived(busy ? 'Guardando...' : isEditing ? 'Actualizar usuario' : 'Crear usuario');

  $effect(() => {
    const user = initialUser;

    form.username = user?.username ?? '';
    form.password = '';
    form.role = user?.role ?? 'user';
    validationError = '';
  });

  async function handleSubmit(event) {
    event.preventDefault();
    validationError = '';

    const username = form.username.trim();
    if (!username) {
      validationError = 'El nombre de usuario es obligatorio';
      return;
    }

    if (!isEditing && form.password.length < 4) {
      validationError = 'La contraseña debe tener al menos 4 caracteres';
      return;
    }

    if (isEditing && form.password && form.password.length < 4) {
      validationError = 'Si cambias la contraseña, debe tener al menos 4 caracteres';
      return;
    }

    const payload = {
      username,
      role: form.role
    };

    if (form.password) {
      payload.password = form.password;
    }

    try {
      await onSave(payload);
    } catch (error) {
      validationError = error.message;
    }
  }
</script>

<form class="form-grid" onsubmit={handleSubmit}>
  <h4>{title}</h4>

  <label>
    Username
    <input type="text" bind:value={form.username} maxlength="60" required />
  </label>

  <label>
    Rol
    <select bind:value={form.role}>
      <option value="user">user</option>
      <option value="admin">admin</option>
    </select>
  </label>

  <label>
    Contraseña {isEditing ? '(dejar vacío para mantener)' : ''}
    <input type="password" bind:value={form.password} minlength="4" />
  </label>

  {#if validationError}
    <p class="error-text">{validationError}</p>
  {/if}

  <div class="form-actions">
    <button type="button" class="outline-btn" onclick={onCancel} disabled={busy}>Cancelar</button>
    <button type="submit" class="primary-btn" disabled={busy}>{submitLabel}</button>
  </div>
</form>
