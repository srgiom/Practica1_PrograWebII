<script>
  import { isProductActive } from '../../state/products.svelte.js';

  let {
    initialProduct = null,
    busy = false,
    onCancel = () => {},
    onSave = () => {}
  } = $props();

  let form = $state({
    nombre: '',
    precio: '',
    categoria: 'General',
    activo: true,
    imagen: null
  });

  let validationError = $state('');

  const formTitle = $derived(initialProduct ? 'Editar producto' : 'Nuevo producto');
  const submitLabel = $derived(busy ? 'Guardando...' : initialProduct ? 'Actualizar producto' : 'Crear producto');

  $effect(() => {
    const product = initialProduct;

    form.nombre = product?.nombre ?? '';
    form.precio = product?.precio != null ? String(product.precio) : '';
    form.categoria = product?.categoria || 'General';
    form.activo = product ? isProductActive(product) : true;
    form.imagen = null;
    validationError = '';
  });

  function handleImageSelection(event) {
    const [file] = event.currentTarget.files || [];
    form.imagen = file || null;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    validationError = '';

    const nombre = form.nombre.trim();
    const categoria = form.categoria.trim();
    const precio = Number(form.precio);

    if (!nombre) {
      validationError = 'El nombre es obligatorio';
      return;
    }

    if (!categoria) {
      validationError = 'La categoría es obligatoria';
      return;
    }

    if (Number.isNaN(precio) || precio < 0) {
      validationError = 'El precio debe ser un número mayor o igual a 0';
      return;
    }

    try {
      await onSave({
        nombre,
        precio,
        categoria,
        activo: form.activo,
        imagen: form.imagen
      });
    } catch (error) {
      validationError = error.message;
    }
  }
</script>

<form class="form-grid" onsubmit={handleSubmit}>
  <h4>{formTitle}</h4>

  <label>
    Nombre
    <input type="text" bind:value={form.nombre} placeholder="Ej. Camisa oversize" maxlength="90" required />
  </label>

  <label>
    Precio
    <input type="number" bind:value={form.precio} min="0" step="0.01" required />
  </label>

  <label>
    Categoría
    <input type="text" bind:value={form.categoria} maxlength="60" placeholder="Ej. Ropa, Electrónica..." required />
  </label>

  <label class="checkbox-row">
    <input type="checkbox" bind:checked={form.activo} />
    Activo
  </label>

  <label>
    Imagen (opcional)
    <input type="file" accept="image/*" onchange={handleImageSelection} />
  </label>

  {#if validationError}
    <p class="error-text">{validationError}</p>
  {/if}

  <div class="form-actions">
    <button type="button" class="outline-btn" onclick={onCancel} disabled={busy}>Cancelar</button>
    <button type="submit" class="primary-btn" disabled={busy}>{submitLabel}</button>
  </div>
</form>
