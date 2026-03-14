const Producto = require('../models/Producto');
const client = require('../config/redis');

async function safeCacheGet(key) {
  if (!client?.isOpen) return null;
  try {
    return await client.get(key);
  } catch {
    return null;
  }
}

async function safeCacheSet(key, value, ttlSeconds) {
  if (!client?.isOpen) return;
  try {
    await client.set(key, value, { EX: ttlSeconds });
  } catch {
    // Ignore cache errors to keep API available
  }
}

async function safeCacheDel(key) {
  if (!client?.isOpen) return;
  try {
    await client.del(key);
  } catch {
    // Ignore cache errors to keep API available
  }
}

function parseNumericQuery(value) {
  if (value === undefined || value === null || value === '') return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function parsePositiveIntegerQuery(value, fallback) {
  const num = Number(value);
  if (!Number.isInteger(num) || num < 1) return fallback;
  return num;
}

class ProductService {
  async getAllProducts(filters = {}) {
    // 1. Try to get from Redis
    const cachedProducts = await safeCacheGet('lista_productos');
    let products;

    if (cachedProducts) {
      console.log('Sirviendo desde caché (Redis) ⚡️');
      products = JSON.parse(cachedProducts);
    } else {
      console.log('Consultando MongoDB 🐢');
      products = await Producto.find();
      await safeCacheSet('lista_productos', JSON.stringify(products), 60);
    }

    const nameFilter = typeof filters.name === 'string' ? filters.name.trim().toLowerCase() : '';
    const categoryFilter = typeof filters.categoria === 'string' ? filters.categoria.trim().toLowerCase() : '';
    const minPrice = parseNumericQuery(filters.minPrecio);
    const maxPrice = parseNumericQuery(filters.maxPrecio);

    if (nameFilter) {
      products = products.filter((p) => (p.nombre || '').toLowerCase().includes(nameFilter));
    }

    if (categoryFilter && categoryFilter !== 'all') {
      products = products.filter((p) => {
        const category = (p.categoria || 'General').toLowerCase();
        return category === categoryFilter;
      });
    }

    if (minPrice !== null) {
      products = products.filter((p) => Number(p.precio || 0) >= minPrice);
    }

    if (maxPrice !== null) {
      products = products.filter((p) => Number(p.precio || 0) <= maxPrice);
    }

    if (filters.page !== undefined || filters.limit !== undefined) {
      const page = parsePositiveIntegerQuery(filters.page, 1);
      const limit = parsePositiveIntegerQuery(filters.limit, 12);
      const start = (page - 1) * limit;
      products = products.slice(start, start + limit);
    }

    return products;
  }

  async createProduct(data) {
    const producto = new Producto(data);
    await producto.save();
    await safeCacheDel('lista_productos');
    return producto;
  }

  async updateProduct(id, data) {
    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });
    await safeCacheDel('lista_productos');
    return producto;
  }

  async deleteProduct(id) {
    await Producto.findByIdAndDelete(id);
    await safeCacheDel('lista_productos');
  }
}

module.exports = new ProductService();
