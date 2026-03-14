<script>
  let {
    currentPath = '/productos',
    isAdmin = false,
    username = 'Usuario',
    onNavigate = () => {},
    onLogout = () => {}
  } = $props();

  const links = $derived.by(() => {
    const base = [
      { path: '/productos', label: 'Productos' },
      { path: '/perfil', label: 'Perfil' }
    ];

    if (isAdmin) {
      base.push({ path: '/usuarios', label: 'Usuarios' });
    }

    return base;
  });

  function handleNavigate(event, path) {
    event.preventDefault();
    onNavigate(path);
  }
</script>

<nav class="main-nav">
  <a class="brand" href="/productos" onclick={(event) => handleNavigate(event, '/productos')}>
    Inventario PWII
  </a>

  <ul class="nav-links">
    {#each links as link}
      <li>
        <a
          href={link.path}
          onclick={(event) => handleNavigate(event, link.path)}
          class:active={currentPath === link.path}
        >
          {link.label}
        </a>
      </li>
    {/each}
  </ul>

  <div class="nav-user">
    <span>{username}</span>
    <button type="button" class="outline-btn" onclick={onLogout}>Salir</button>
  </div>
</nav>
