import mongoose, { Schema, model, models } from 'mongoose';

// 1. Definimos la estructura de los datos (El esqueleto)
const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, // No puede haber dos usuarios con el mismo correo
    },
    // Autenticación y Roles
    password: {
      type: String,
      select: false, // Por seguridad, no se devuelve en consultas normales
    },
    role: {
      type: String,
      enum: ['client', 'admin', 'superuser'],
      default: 'client',
    },
    nombre: {
      type: String,
      default: 'Cliente Dulce',
    },

    // Sistema de Lealtad
    sellos: {
      type: Number,
      default: 0,
    },
    premios: {
      type: Number,
      default: 0,
    },
    // Fecha de registro automática
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// 2. Exportamos el modelo
// (Si ya existe lo usa, si no, lo crea)
const User = models.User || model('User', UserSchema);

export default User;