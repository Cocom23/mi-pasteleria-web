import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Link from 'next/link'; // Para el botón de "Volver"

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  // 1. Esperamos a saber qué ID nos pidieron (Truco de Next.js 15)
  const { id } = await params;

  // 2. Conectamos y buscamos ESE producto específico
  await dbConnect();
  const product = await Product.findById(id).lean();

  if (!product) {
    return <div>Producto no encontrado :(</div>;
  }

  return (
    <div className="min-h-screen bg-orange-50 p-10 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Lado Izquierdo: Foto Gigante */}
        <div className="h-96 rounded-xl overflow-hidden shadow-inner bg-gray-100">
           <img 
              src={product.imagen || "/portada.jpg"} 
              alt={product.nombre}
              className="w-full h-full object-cover"
           />
        </div>

        {/* Lado Derecho: Info */}
        <div className="flex flex-col justify-center">
          <Link href="/" className="text-orange-500 hover:underline mb-4">
            ← Volver al menú
          </Link>

          <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.nombre}</h1>
          <span className="text-3xl text-orange-600 font-bold mb-6 block">{product.precio}</span>
          
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            {product.descripcion}
            <br/><br/>
            Este es un postre artesanal hecho con los mejores ingredientes seleccionados. ¡Ideal para compartir!
          </p>

          {/* Lógica para el botón de WhatsApp */}
          {(() => {
            // TU NÚMERO DE TELÉFONO AQUÍ (Ponlo con código de país, ej: 521...)
            const telefono = "9851082068"; 
            
            // Creamos el mensaje automático
            const mensaje = `Hola 👋, me gustaría pedir el postre: ${product.nombre} que cuesta ${product.precio}.`;
            
            // Creamos el link especial de WhatsApp
            const whatsappUrl = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

            return (
              <a 
                href={whatsappUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-center bg-green-600 text-white text-xl py-4 px-8 rounded-xl hover:bg-green-700 transition-all shadow-lg transform hover:-translate-y-1 decoration-clone"
              >
                🛒 Pedir por WhatsApp
              </a>
            );
          })()}

        </div>

      </div>
    </div>
  );
}