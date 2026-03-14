<script>
  import ProductCard from '../components/products/ProductCard.svelte';
  import ProductForm from '../components/products/ProductForm.svelte';
  import ProductDetailModal from '../components/products/ProductDetailModal.svelte';
  import Modal from '../components/ui/Modal.svelte';
  import { authState } from '../state/auth.svelte.js';
  import {
    productsState,
    isProductActive,
    productCategory
  } from '../state/products.svelte.js';
  import { showFlash } from '../state/ui.svelte.js';
  import {
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  } from '../services/productsService.js';

  let showFormModal = $state(false);
  let editingProduct = $state(null);
  let requestId = 0;

  const isAdmin = $derived(authState.user?.role === 'admin');

  const filterKey = $derived.by(() => {
    const { name, category, priceMin, priceMax } = productsState.filters;
    return `${name.trim().toLowerCase()}|${category}|${priceMin}|${priceMax}`;
  });

  const hasInvalidPriceRange = $derived.by(() => {
    const min = productsState.filters.priceMin === '' ? null : Number(productsState.filters.priceMin);
    const max = productsState.filters.priceMax === '' ? null : Number(productsState.filters.priceMax);

    if (min === null || max === null || Number.isNaN(min) || Number.isNaN(max)) {
      return false;
    }

    return min > max;
  });

  const availableCategories = $derived.by(() => {
    const categories = new Set(productsState.items.map((item) => productCategory(item)));
    return [...categories].sort((a, b) => a.localeCompare(b));
  });

  const filteredProducts = $derived.by(() => {
    if (hasInvalidPriceRange) {
      return [];
    }

    const { name, category, priceMin, priceMax } = productsState.filters;
    const normalizedName = name.trim().toLowerCase();
    const normalizedCategory = category;
    const min = priceMin === '' ? null : Number(priceMin);
    const max = priceMax === '' ? null : Number(priceMax);

    return productsState.items.filter((item) => {
      const itemName = (item.nombre || '').toLowerCase();
      const itemCategory = productCategory(item);
      const itemPrice = Number(item.precio || 0);

      if (normalizedName && !itemName.includes(normalizedName)) {
        return false;
      }

      if (normalizedCategory !== 'all' && itemCategory !== normalizedCategory) {
        return false;
      }

      if (min !== null && !Number.isNaN(min) && itemPrice < min) {
        return false;
      }

      if (max !== null && !Number.isNaN(max) && itemPrice > max) {
        return false;
      }

      return true;
    });
  });

  const totalProducts = $derived(filteredProducts.length);
  const activeProducts = $derived(filteredProducts.filter(isProductActive).length);

  const totalPages = $derived.by(() => {
    const pageSize = Number(productsState.pagination.pageSize) || 6;
    return Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  });

  const paginatedProducts = $derived.by(() => {
    const pageSize = Number(productsState.pagination.pageSize) || 6;
    const currentPage = productsState.pagination.page;
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  });

  async function loadProducts() {
    const currentRequest = ++requestId;

    productsState.loading = true;
    productsState.error = '';

    try {
      const products = await fetchProducts(authState.token);
      if (currentRequest !== requestId) {
        return;
      }

      productsState.items = products;
    } catch (error) {
      if (currentRequest !== requestId) {
        return;
      }

      productsState.error = error.message;
      productsState.items = [];
    } finally {
      if (currentRequest === requestId) {
        productsState.loading = false;
      }
    }
  }

  $effect(() => {
    filterKey;
    productsState.pagination.page = 1;
  });

  $effect(() => {
    const pages = totalPages;

    if (productsState.pagination.page > pages) {
      productsState.pagination.page = pages;
      return;
    }

    if (productsState.pagination.page < 1) {
      productsState.pagination.page = 1;
    }
  });

  $effect(() => {
    if (!authState.token) {
      return;
    }

    const role = authState.user?.role;
    void loadProducts();

    // This variable is read intentionally to trigger reload on role changes.
    if (!role) {
      return;
    }
  });

  function closeFormModal() {
    showFormModal = false;
    editingProduct = null;
  }

  function openCreateModal() {
    editingProduct = null;
    showFormModal = true;
  }

  function openEditModal(product) {
    editingProduct = product;
    showFormModal = true;
  }

  function openProductDetail(product) {
    productsState.selectedProduct = product;
  }

  function closeProductDetail() {
    productsState.selectedProduct = null;
  }

  function clearFilters() {
    productsState.filters.name = '';
    productsState.filters.category = 'all';
    productsState.filters.priceMin = '';
    productsState.filters.priceMax = '';
  }

  function handlePageSizeChange(event) {
    productsState.pagination.pageSize = Number(event.currentTarget.value);
    productsState.pagination.page = 1;
  }

  function goToPreviousPage() {
    if (productsState.pagination.page > 1) {
      productsState.pagination.page -= 1;
    }
  }

  function goToNextPage() {
    if (productsState.pagination.page < totalPages) {
      productsState.pagination.page += 1;
    }
  }

  async function handleSaveProduct(productPayload) {
    productsState.saving = true;

    try {
      if (editingProduct) {
        await updateProduct(authState.token, editingProduct._id, productPayload);
        showFlash('success', 'Producto actualizado');
      } else {
        await createProduct(authState.token, productPayload);
        showFlash('success', 'Producto creado');
      }

      closeFormModal();
      await loadProducts();
    } catch (error) {
      showFlash('error', error.message);
      throw error;
    } finally {
      productsState.saving = false;
    }
  }

  async function handleDeleteProduct(product) {
    const accepted = window.confirm(`¿Eliminar "${product.nombre}"? Esta acción no se puede deshacer.`);
    if (!accepted) {
      return;
    }

    productsState.saving = true;

    try {
      await deleteProduct(authState.token, product._id);
      showFlash('success', 'Producto eliminado');
      await loadProducts();
    } catch (error) {
      productsState.error = error.message;
      showFlash('error', error.message);
    } finally {
      productsState.saving = false;
    }
  }
</script>

<section class="page-shell">
  <header class="page-header">
    <div>
      <h1>Productos</h1>
      <p class="muted">Total filtrados: {totalProducts} · Activos: {activeProducts}</p>
    </div>

    {#if isAdmin}
      <button type="button" class="primary-btn" onclick={openCreateModal}>Nuevo producto</button>
    {/if}
  </header>

  <div class="toolbar filters-grid">
    <label>
      Buscar por nombre
      <input
        type="search"
        bind:value={productsState.filters.name}
        placeholder="Ej. camisa, pantalón, zapatilla..."
      />
    </label>

    <label>
      Categoría
      <select bind:value={productsState.filters.category}>
        <option value="all">Todas</option>
        {#each availableCategories as category}
          <option value={category}>{category}</option>
        {/each}
      </select>
    </label>

    <label>
      Precio mínimo
      <input type="number" min="0" step="0.01" bind:value={productsState.filters.priceMin} placeholder="0.00" />
    </label>

    <label>
      Precio máximo
      <input type="number" min="0" step="0.01" bind:value={productsState.filters.priceMax} placeholder="999.99" />
    </label>

    <label>
      Por página
      <select value={String(productsState.pagination.pageSize)} onchange={handlePageSizeChange}>
        <option value="6">6</option>
        <option value="12">12</option>
        <option value="24">24</option>
      </select>
    </label>

    <div class="filter-actions">
      <button type="button" class="outline-btn" onclick={clearFilters}>Limpiar filtros</button>
    </div>
  </div>

  {#if hasInvalidPriceRange}
    <div class="error-box">El precio mínimo no puede ser mayor que el precio máximo.</div>
  {/if}

  {#if productsState.loading}
    <div class="loading-box">Cargando productos...</div>
  {:else if productsState.error}
    <div class="error-box">{productsState.error}</div>
  {:else}
    <div class="results-block">
      <div class="products-grid">
        {#each paginatedProducts as product}
          <ProductCard
            {product}
            canEdit={isAdmin}
            canDelete={isAdmin}
            onView={openProductDetail}
            onEdit={openEditModal}
            onDelete={handleDeleteProduct}
          />
        {:else}
          <article class="empty-state">
            <h3>Sin productos</h3>
            <p>No hay resultados para los filtros seleccionados.</p>
          </article>
        {/each}
      </div>

      {#if totalProducts > 0}
        <footer class="pagination-bar">
          <button
            type="button"
            class="outline-btn"
            onclick={goToPreviousPage}
            disabled={productsState.pagination.page <= 1}
          >
            Anterior
          </button>

          <p class="muted">
            Página {productsState.pagination.page} de {totalPages}
          </p>

          <button
            type="button"
            class="outline-btn"
            onclick={goToNextPage}
            disabled={productsState.pagination.page >= totalPages}
          >
            Siguiente
          </button>
        </footer>
      {/if}
    </div>
  {/if}
</section>

<Modal
  open={showFormModal}
  title={editingProduct ? 'Editar producto' : 'Crear producto'}
  onClose={closeFormModal}
>
  <ProductForm
    initialProduct={editingProduct}
    busy={productsState.saving}
    onCancel={closeFormModal}
    onSave={handleSaveProduct}
  />
</Modal>

<ProductDetailModal
  open={Boolean(productsState.selectedProduct)}
  product={productsState.selectedProduct}
  onClose={closeProductDetail}
/>
