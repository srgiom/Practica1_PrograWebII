<script>
  let {
    users = [],
    currentUserId = null,
    onEdit = () => {},
    onDelete = () => {}
  } = $props();
</script>

<div class="users-table-wrap">
  <table class="users-table">
    <thead>
      <tr>
        <th>Username</th>
        <th>Rol</th>
        <th>ID</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {#if users.length === 0}
        <tr>
          <td colspan="4">No hay usuarios registrados.</td>
        </tr>
      {:else}
        {#each users as user}
          <tr>
            <td>{user.username}</td>
            <td>
              <span class={`status-chip ${user.role === 'admin' ? 'active' : 'inactive'}`}>
                {user.role}
              </span>
            </td>
            <td class="mono">{user._id}</td>
            <td>
              <div class="actions compact">
                <button type="button" class="outline-btn" onclick={() => onEdit(user)}>Editar</button>
                <button
                  type="button"
                  class="danger-btn"
                  onclick={() => onDelete(user)}
                  disabled={user._id === currentUserId}
                  title={user._id === currentUserId ? 'No puedes borrarte a ti mismo' : 'Eliminar usuario'}
                >
                  Borrar
                </button>
              </div>
            </td>
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
</div>
