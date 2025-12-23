import mongoose, { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
  },
  descripcion: {
    type: String,
    required: true,
  },
  precio: {
    type: String, // Lo guardamos como string ("$45.00") por simplicidad ahora
    required: true,
  },
  imagen: {
    type: String,
    default: 'portada1.jpg',
  },
  categoria: {
    type: String,
    default: 'postres', // Para filtrar entre bebidas y comida después
  }
}, {
  timestamps: true, // Esto guarda automáticamente la fecha de creación
});

// Si el modelo ya existe, úsalo. Si no, créalo.
const Product = models.Product || model('Product', ProductSchema);

export default Product;