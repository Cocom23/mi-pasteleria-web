"use client";

import React, { useState } from 'react';
import { ShoppingBag, Loader2, PartyPopper, CheckCircle, ArrowLeft } from 'lucide-react';

// 1. Componente del Botón (Lógica interactiva)
function BotonComprar({ nombreProducto }: { nombreProducto: string }) {
  const [email, setEmail] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [resultado, setResultado] = useState<{mensaje: string, tipo: 'exito' | 'premio' | 'error'} | null>(null);

  const realizarCompra = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!email) return;
    setProcesando(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, producto: nombreProducto }) 
      });
      const data = await res.json();
      if (res.ok) {
        const esPremio = data.mensaje.includes('PREMIO');
        setResultado({ mensaje: data.mensaje, tipo: esPremio ? 'premio' : 'exito' });
      } else {
        setResultado({ mensaje: 'Hubo un error en el pago.', tipo: 'error' });
      }
    } catch (error) {
      setResultado({ mensaje: 'Error de conexión', tipo: 'error' });
    }
    setProcesando(false);
  };

  if (resultado?.tipo === 'exito' || resultado?.tipo === 'premio') {
    return (
      <div className={`p-6 rounded-xl border-2 text-center animate-in zoom-in ${resultado.tipo === 'premio' ? 'bg-yellow-50 border-yellow-400' : 'bg-green-50 border-green-200'}`}>
        <div className="flex justify-center mb-2">
            {resultado.tipo === 'premio' ? <PartyPopper className="text-yellow-600 animate-bounce" size={32}/> : <CheckCircle className="text-green-600" size={32}/>}
        </div>
        <h3 className={`font-bold text-lg ${resultado.tipo === 'premio' ? 'text-yellow-800' : 'text-green-800'}`}>
            {resultado.tipo === 'premio' ? '¡PREMIO DESBLOQUEADO!' : '¡Gracias por tu compra!'}
        </h3>
        <p className="text-slate-600 mt-1">{resultado.mensaje}</p>
        <button onClick={() => setResultado(null)} className="mt-4 text-sm underline text-slate-500 hover:text-slate-800">Comprar otro</button>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
        <ShoppingBag size={20} className="text-orange-500"/> Comprar en línea
      </h3>
      <form onSubmit={realizarCompra} className="flex flex-col gap-3">
        <input 
          type="email" 
          placeholder="tu@correo.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-slate-300 p-3 rounded-lg focus:border-orange-500 outline-none"
          required 
        />
        <button type="submit" disabled={procesando} className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 disabled:opacity-70">
          {procesando ? <Loader2 className="animate-spin" /> : 'Pagar Ahora'}
        </button>
      </form>
    </div>
  );
}

// 2. Componente de la Página Principal
export default function ProductDetail() {
  const product = {
    nombre: "Pastel Especial de la Casa",
    precio: "25.00",
    descripcion: "Nuestra creación más famosa con chocolate belga y fresas frescas.",
    categoria: "Especialidad"
  };

  const whatsappUrl = `https://wa.me/9851082068?text=Hola, quiero el ${product.nombre}`;

  return (
    <div className="min-h-screen bg-orange-50 p-6 flex items-center justify-center font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="h-80 md:h-full rounded-2xl bg-gray-200 flex items-center justify-center text-gray-400">
          [Imagen de {product.nombre}]
        </div>
        <div className="flex flex-col">
          <a href="/" className="text-orange-500 font-medium mb-6 flex items-center gap-1">
            <ArrowLeft size={16} /> Volver al menú
          </a>
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">{product.nombre}</h1>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-black text-orange-600">${product.precio}</span>
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full uppercase">{product.categoria}</span>
          </div>
          <p className="text-gray-600 mb-8 italic text-lg">"{product.descripcion}"</p>
          <div className="space-y-4">
            <a href={whatsappUrl} target="_blank" className="w-full flex items-center justify-center bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition-all shadow-md">
              💬 Pedir por WhatsApp
            </a>
            <BotonComprar nombreProducto={product.nombre} />
          </div>
        </div>
      </div>
    </div>
  );
}