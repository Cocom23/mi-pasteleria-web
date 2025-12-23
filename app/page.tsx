import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Link from 'next/link';
// Importamos el nuevo componente
import TarjetaLealtad from '@/components/TarjetaLealtad';

export default async function Home({ searchParams }: { searchParams: Promise<{ categoria?: string }> }) {
  
  // 1. Leemos qué categoría pidió el usuario
  const { categoria } = await searchParams;

  // 2. Conectamos a la base de datos
  await dbConnect();

  // 3. Preparamos el filtro
  const filtro = categoria ? { categoria: categoria } : {};
  
  // 4. Pedimos los productos
  const products = await Product.find(filtro).lean();

  return (
    <main className="min-h-screen p-10 bg-orange-50">
      
      {/* Título Principal */}
      <h1 className="text-4xl font-bold text-center text-orange-800 mb-6">
        🍰 Menú Delicioso
      </h1>

      {/* --- AQUÍ INSERTAMOS TU TARJETA DE LEALTAD --- */}
      <div className="mb-10">
        <TarjetaLealtad />
      </div>
      {/* ------------------------------------------- */}

      {/* --- BOTONES DE FILTRO --- */}
      <div className="flex justify-center gap-4 mb-10">
        <Link 
          href="/" 
          className={`px-6 py-2 rounded-full font-bold transition-colors ${!categoria ? 'bg-orange-600 text-white' : 'bg-white text-orange-600 border border-orange-600'}`}
        >
          Todos
        </Link>
        <Link 
          href="/?categoria=postres" 
          className={`px-6 py-2 rounded-full font-bold transition-colors ${categoria === 'postres' ? 'bg-orange-600 text-white' : 'bg-white text-orange-600 border border-orange-600'}`}
        >
          Postres
        </Link>
        <Link 
          href="/?categoria=bebidas" 
          className={`px-6 py-2 rounded-full font-bold transition-colors ${categoria === 'bebidas' ? 'bg-orange-600 text-white' : 'bg-white text-orange-600 border border-orange-600'}`}
        >
          Bebidas
        </Link>
      </div>

      {/* --- REJILLA DE PRODUCTOS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        
        {products.length > 0 ? (
          products.map((product: any) => (
            <Link href={`/product/${product._id}`} key={product._id} className="block group">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-orange-100 h-full flex flex-col">
                <div className="h-48 overflow-hidden bg-gray-200">
                  <img 
                    src={product.imagen || "portada.jpg"} 
                    alt={product.nombre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-bold text-gray-800">{product.nombre}</h2>
                      <span className="bg-green-100 text-green-800 text-sm font-bold px-2 py-1 rounded-full whitespace-nowrap ml-2">
                        ${product.precio}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">{product.descripcion}</p>
                  </div>
                  <div className="mt-4 w-full bg-orange-500 text-white py-2 rounded-lg font-medium text-center group-hover:bg-orange-600 transition-colors">
                    Ver Detalles
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-3 text-center text-gray-500 text-xl py-10">
            😢 No hay productos en esta categoría.
          </div>
        )}

      </div>
    </main>
  );
}