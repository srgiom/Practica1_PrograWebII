<script>
  let {
    flash = null,
    onClose = () => {}
  } = $props();
</script>

{#if flash}
  <aside class={`flash flash-${flash.type}`} role="status">
    <p>{flash.text}</p>
    <button type="button" onclick={onClose} aria-label="Cerrar mensaje">×</button>
  </aside>
{/if}
