import mongoose, { Schema, model, models } from 'mongoose';

// 1. Definimos la estructura de los datos (El esqueleto)
const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, // No puede haber dos usuarios con el mismo correo
    },
    sellos: {
      type: Number,
      default: 0, // Todos empiezan con 0 sellos
    },
    premios: {
      type: Number,
      default: 0, // Cupones canjeables disponibles
    },
    // Fecha de registro automática
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Agrega automáticamente cuándo se creó y cuándo se actualizó
  }
);

// 2. Exportamos el modelo
// (Si ya existe lo usa, si no, lo crea)
const User = models.User || model('User', UserSchema);

export default User;