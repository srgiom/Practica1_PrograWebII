<script>
  import Modal from '../components/ui/Modal.svelte';
  import UserForm from '../components/users/UserForm.svelte';
  import UserTable from '../components/users/UserTable.svelte';
  import { authState } from '../state/auth.svelte.js';
  import { usersState } from '../state/users.svelte.js';
  import { showFlash } from '../state/ui.svelte.js';
  import {
    fetchUsers,
    createUser,
    updateUser,
    deleteUser
  } from '../services/usersService.js';

  let showFormModal = $state(false);
  let editingUser = $state(null);
  let requestId = 0;
  const isAdmin = $derived(authState.user?.role === 'admin');
  const sortedUsers = $derived.by(() => {
    return [...usersState.items].sort((a, b) => a.username.localeCompare(b.username));
  });

  async function loadUsers() {
    const currentRequest = ++requestId;
    usersState.loading = true;
    usersState.error = '';

    try {
      const users = await fetchUsers(authState.token);
      if (currentRequest !== requestId) {
        return;
      }

      usersState.items = users;
    } catch (error) {
      if (currentRequest !== requestId) {
        return;
      }

      usersState.error = error.message;
      usersState.items = [];
    } finally {
      if (currentRequest === requestId) {
        usersState.loading = false;
      }
    }
  }

  $effect(() => {
    if (!authState.token || authState.user?.role !== 'admin') {
      return;
    }

    void loadUsers();
  });

  function openCreateModal() {
    editingUser = null;
    showFormModal = true;
  }

  function openEditModal(user) {
    editingUser = user;
    showFormModal = true;
  }

  function closeFormModal() {
    editingUser = null;
    showFormModal = false;
  }

  async function handleSaveUser(userPayload) {
    usersState.saving = true;

    try {
      if (editingUser) {
        await updateUser(authState.token, editingUser._id, userPayload);
        showFlash('success', 'Usuario actualizado');
      } else {
        await createUser(authState.token, userPayload);
        showFlash('success', 'Usuario creado');
      }

      closeFormModal();
      await loadUsers();
    } catch (error) {
      showFlash('error', error.message);
      throw error;
    } finally {
      usersState.saving = false;
    }
  }

  async function handleDeleteUser(user) {
    if (user._id === authState.user?.id) {
      showFlash('error', 'No puedes eliminar tu propio usuario desde esta sesión.');
      return;
    }

    const accepted = window.confirm(`¿Eliminar el usuario ${user.username}?`);
    if (!accepted) {
      return;
    }

    usersState.saving = true;

    try {
      await deleteUser(authState.token, user._id);
      showFlash('success', 'Usuario eliminado');
      await loadUsers();
    } catch (error) {
      usersState.error = error.message;
      showFlash('error', error.message);
    } finally {
      usersState.saving = false;
    }
  }
</script>

<section class="page-shell">
  <header class="page-header">
    <div>
      <h1>Usuarios</h1>
      <p class="muted">Zona de administración para gestión de roles.</p>
    </div>

    {#if isAdmin}
      <button type="button" class="primary-btn" onclick={openCreateModal}>Nuevo usuario</button>
    {/if}
  </header>

  {#if !isAdmin}
    <article class="error-box">No tienes permisos para acceder a esta sección.</article>
  {:else if usersState.loading}
    <div class="loading-box">Cargando usuarios...</div>
  {:else if usersState.error}
    <div class="error-box">{usersState.error}</div>
  {:else}
    <UserTable
      users={sortedUsers}
      currentUserId={authState.user?.id}
      onEdit={openEditModal}
      onDelete={handleDeleteUser}
    />
  {/if}
</section>

<Modal
  open={showFormModal}
  title={editingUser ? 'Editar usuario' : 'Crear usuario'}
  onClose={closeFormModal}
>
  <UserForm
    initialUser={editingUser}
    busy={usersState.saving}
    onCancel={closeFormModal}
    onSave={handleSaveUser}
  />
</Modal>
