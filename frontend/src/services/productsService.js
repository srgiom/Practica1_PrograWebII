import { apiRequest } from './http.js';

export async function fetchProducts(token) {
  return apiRequest('/productos', { token });
}

export async function createProduct(token, productInput) {
  const formData = new FormData();
  formData.append('nombre', productInput.nombre);
  formData.append('precio', String(productInput.precio));
  formData.append('categoria', productInput.categoria);
  formData.append('activo', String(Boolean(productInput.activo)));

  if (productInput.imagen instanceof File) {
    formData.append('imagen', productInput.imagen);
  }

  return apiRequest('/productos', {
    method: 'POST',
    token,
    body: formData
  });
}

export async function updateProduct(token, productId, productInput) {
  return apiRequest(`/productos/${productId}`, {
    method: 'PUT',
    token,
    body: {
      nombre: productInput.nombre,
      precio: productInput.precio,
      categoria: productInput.categoria,
      activo: Boolean(productInput.activo)
    }
  });
}

export async function deleteProduct(token, productId) {
  return apiRequest(`/productos/${productId}`, {
    method: 'DELETE',
    token
  });
}
