import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';     // El @ significa "carpeta raíz"
import Product from '@/models/Product';

export async function GET() {
  try {
    // 1. Conectamos a la base de datos
    await dbConnect();

    // 2. Borramos todo lo que haya antes (para no tener duplicados al probar)
    await Product.deleteMany({});

    // 3. Definimos tus productos iniciales
    const productosIniciales = [
      {
        nombre: "Pastel de Chocolate",
        descripcion: "Esponjoso, con triple capa de cacao y relleno de fudge.",
        precio: "$50.00",
        imagen: "chocolate.jpg",
        categoria: "postres"
      },
      {
        nombre: "Cheesecake de Frutos Rojos",
        descripcion: "Base de galleta crujiente con topping natural de fresas.",
        precio: "$55.00",
        imagen: "rojos.jpg",
        categoria: "postres"
      },
      {
        nombre: "Café Latte Especial",
        descripcion: "Nuestro blend de la casa con arte latte personalizado.",
        precio: "$60.00",
        imagen: "cafe.jpg",
        categoria: "bebidas"
      },
      {
        nombre: "Tarta de Limón",
        descripcion: "El equilibrio perfecto entre dulce y ácido con merengue.",
        precio: "$55.00",
        imagen: "limon.jpg",
        categoria: "postres"
      },
      {
        nombre: "Muffin de Magali",
        descripcion: "Suave y fresca, repleta de amor solo para su novio, el creador de esta página.",
        precio: "$1,000.00",
        imagen: "mufin.jpg",
        categoria: "postres"
      }
    ];

    // 4. Los insertamos en la base de datos
    await Product.insertMany(productosIniciales);

    return NextResponse.json({ 
      message: "¡Éxito! Base de datos cargada correctamente", 
      productos: productosIniciales 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}