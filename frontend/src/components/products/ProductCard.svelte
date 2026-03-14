<script>
  import { isProductActive, productCategory } from '../../state/products.svelte.js';

  let {
    product,
    canEdit = false,
    canDelete = false,
    onView = () => {},
    onEdit = () => {},
    onDelete = () => {}
  } = $props();

  const active = $derived(isProductActive(product));
  const category = $derived(productCategory(product));
</script>

<article class="product-card">
  <header>
    <h3>{product.nombre}</h3>
    <span class={`status-chip ${active ? 'active' : 'inactive'}`}>
      {active ? 'Activo' : 'No activo'}
    </span>
  </header>

  <p class="price">€ {Number(product.precio || 0).toFixed(2)}</p>
  <p class="muted">Categoría: {category}</p>

  <div class="actions">
    <button type="button" class="outline-btn" onclick={() => onView(product)}>Detalle</button>

    {#if canEdit}
      <button type="button" class="outline-btn" onclick={() => onEdit(product)}>Editar</button>
    {/if}

    {#if canDelete}
      <button type="button" class="danger-btn" onclick={() => onDelete(product)}>Borrar</button>
    {/if}
  </div>
</article>
