export function isProductActive(product) {
  if (typeof product?.activo === 'boolean') return product.activo;
  if (typeof product?.estado === 'boolean') return product.estado;
  return true;
}

export function productCategory(product) {
  const raw = typeof product?.categoria === 'string' ? product.categoria.trim() : '';
  return raw || 'General';
}

export const productsState = $state({
  items: [],
  loading: false,
  saving: false,
  error: '',
  selectedProduct: null,
  filters: {
    name: '',
    category: 'all',
    priceMin: '',
    priceMax: ''
  },
  pagination: {
    page: 1,
    pageSize: 6
  }
});
