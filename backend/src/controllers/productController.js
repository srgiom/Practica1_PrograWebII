const ProductService = require('../services/productService');

function normalizeBoolean(value, defaultValue = true) {
  if (value === undefined) return defaultValue;
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  return defaultValue;
}

function normalizeCategory(value) {
  const raw = typeof value === 'string' ? value.trim() : '';
  return raw || 'General';
}

class ProductController {
  async getProducts(req, res) {
    try {
      const products = await ProductService.getAllProducts(req.query);
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener productos' });
    }
  }

  async createProduct(req, res) {
    try {
      if (req.user.role !== "admin") return res.status(403).json({ error: "Solo admin" });
      
      const { nombre, precio, activo, categoria } = req.body;
      const imagen = req.file ? req.file.filename : null;
      
      const product = await ProductService.createProduct({
        nombre,
        precio,
        categoria: normalizeCategory(categoria),
        activo: normalizeBoolean(activo, true),
        imagen
      });
      res.status(201).json(product);
    } catch (err) {
      res.status(500).json({ error: 'Error al crear producto' });
    }
  }

  async updateProduct(req, res) {
    try {
      if (req.user.role !== "admin") return res.status(403).json({ error: "Solo admin" });

      const updateData = { ...req.body };
      if (updateData.categoria !== undefined) {
        updateData.categoria = normalizeCategory(updateData.categoria);
      }
      if (updateData.activo !== undefined) {
        updateData.activo = normalizeBoolean(updateData.activo, true);
      }

      const product = await ProductService.updateProduct(req.params.id, updateData);
      res.json(product);
    } catch (err) {
      res.status(500).json({ error: 'Error al actualizar producto' });
    }
  }

  async deleteProduct(req, res) {
    try {
      if (req.user.role !== "admin") return res.status(403).json({ error: "Solo admin" });
      await ProductService.deleteProduct(req.params.id);
      res.json({ message: 'Producto eliminado' });
    } catch (err) {
      res.status(500).json({ error: 'Error al eliminar producto' });
    }
  }
}

module.exports = new ProductController();
