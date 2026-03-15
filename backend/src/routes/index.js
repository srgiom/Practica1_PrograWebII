const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const cartRoutes = require('./cartRoutes');
const userRoutes = require('./userRoutes');

router.use('/', authRoutes);

router.use('/productos', productRoutes);
router.use('/cart', cartRoutes);
router.use('/users', userRoutes);

const Producto = require('../models/Producto');
router.get('/sitemap.xml', async (req, res) => {
  try {
    const productos = await Producto.find();
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://mi-tienda.com/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>`;

    productos.forEach(prod => {
      xml += `
      <url>
        <loc>https://mi-tienda.com/producto/${prod._id}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>`;
    });

    xml += '</urlset>';
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    res.status(500).end();
  }
});

module.exports = router;
