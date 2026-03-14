const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: String,
  precio: Number,
  categoria: { type: String, default: 'General' },
  activo: { type: Boolean, default: true },
  imagen: String
});

module.exports = mongoose.model('Producto', productoSchema);
