<script>
  let {
    open = false,
    title = '',
    wide = false,
    onClose = () => {},
    children
  } = $props();

  $effect(() => {
    if (!open || typeof window === 'undefined') {
      return;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  });

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  function handleBackdropKeydown(event) {
    if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClose();
    }
  }
</script>

{#if open}
  <div
    class="modal-backdrop"
    role="button"
    tabindex="0"
    aria-label="Cerrar ventana modal"
    onclick={handleBackdropClick}
    onkeydown={handleBackdropKeydown}
  >
    <div
      class={`modal-panel ${wide ? 'modal-wide' : ''}`}
      role="dialog"
      tabindex="-1"
      aria-modal="true"
      aria-label={title}
      onclick={(event) => event.stopPropagation()}
      onkeydown={(event) => event.stopPropagation()}
    >
      <header class="modal-header">
        <h3>{title}</h3>
        <button type="button" class="icon-btn" onclick={onClose} aria-label="Cerrar">×</button>
      </header>
      <div class="modal-content">
        {@render children?.()}
      </div>
    </div>
  </div>
{/if}
