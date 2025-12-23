import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Product from '@/models/Product';
import dbConnect from '@/lib/db';
import BotonComprar from '@/components/BotonComprar';
import { notFound } from 'next/navigation';
import mongoose from 'mongoose';

// Componente de servidor
export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Validamos si es un ID válido de MongoDB
  if (!mongoose.Types.ObjectId.isValid(id)) {
    notFound();
  }

  await dbConnect();

  // Obtenemos el producto de la BD
  const product = await Product.findById(id).lean();

  if (!product) {
    notFound();
  }

  // Preparamos los datos
  const nombre = product.nombre;
  const precio = product.precio;
  const descripcion = product.descripcion;
  const categoria = product.categoria;
  const imagen = product.imagen || "portada.jpg";



  return (
    <div className="min-h-screen bg-orange-50 p-6 md:p-10 flex items-center justify-center font-sans">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

        {/* Lado Izquierdo: Imagen */}
        <div className="h-80 md:h-full rounded-2xl overflow-hidden shadow-lg border border-orange-100 bg-gray-200">
          <img
            src={imagen.startsWith('http') ? imagen : `/${imagen}`}
            alt={nombre}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Lado Derecho: Info */}
        <div className="flex flex-col">
          <Link href="/" className="text-orange-500 hover:text-orange-600 font-medium mb-6 flex items-center gap-1 transition-colors">
            <ArrowLeft size={18} /> Volver al menú
          </Link>

          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2 leading-tight">
            {nombre}
          </h1>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-black text-orange-600">
              {precio.includes('$') ? precio : `$${precio}`}
            </span>
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full uppercase italic">
              {categoria}
            </span>
          </div>

          <div className="text-gray-600 mb-8 flex-1">
            <p className="text-lg leading-relaxed italic">"{descripcion}"</p>
          </div>



          {/* Usamos el componente compartido */}
          <BotonComprar nombreProducto={nombre} />
        </div>
      </div>
    </div>

  );
}