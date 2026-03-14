<script>
  import Modal from '../ui/Modal.svelte';
  import { productImageUrl } from '../../services/http.js';
  import { isProductActive, productCategory } from '../../state/products.svelte.js';

  let {
    product = null,
    open = false,
    onClose = () => {}
  } = $props();

  const status = $derived(product ? (isProductActive(product) ? 'Activo' : 'No activo') : 'Sin datos');
  const category = $derived(product ? productCategory(product) : 'Sin categoría');
  const imageSrc = $derived(product ? productImageUrl(product.imagen) : '');
</script>

<Modal {open} title="Detalle de producto" onClose={onClose}>
  {#if product}
    <div class="detail-block">
      <p><strong>Nombre:</strong> {product.nombre}</p>
      <p><strong>Precio:</strong> € {Number(product.precio || 0).toFixed(2)}</p>
      <p><strong>Categoría:</strong> {category}</p>
      <p><strong>Estado:</strong> {status}</p>
      <p><strong>ID:</strong> {product._id}</p>

      {#if imageSrc}
        <img src={imageSrc} alt={`Imagen de ${product.nombre}`} class="detail-image" />
      {/if}
    </div>
  {/if}
</Modal>
