'use client';

import React, { useState } from 'react';
import { ShoppingBag, Loader2, PartyPopper, CheckCircle } from 'lucide-react';

export default function BotonComprar({ nombreProducto }: { nombreProducto: string }) {
  const [email, setEmail] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [resultado, setResultado] = useState<{mensaje: string, tipo: 'exito' | 'premio' | 'error'} | null>(null);

  const realizarCompra = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!email) return;

    setProcesando(true);
    setResultado(null);

    try {
      // Llamamos a la API de Checkout (Simulando pago real)
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, producto: nombreProducto }) 
      });

      const data = await res.json();
      
      if (res.ok) {
        // Determinamos si fue premio o solo compra normal
        const esPremio = data.mensaje.includes('PREMIO');
        setResultado({ 
            mensaje: data.mensaje, 
            tipo: esPremio ? 'premio' : 'exito' 
        });
        // Limpiamos el email si quieres, o lo dejas para otra compra
      } else {
        setResultado({ mensaje: 'Hubo un error en el pago.', tipo: 'error' });
      }
    } catch (error) {
      setResultado({ mensaje: 'Error de conexión', tipo: 'error' });
    }
    setProcesando(false);
  };

  // Si ya compró, mostramos mensaje de éxito
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
        <button 
            onClick={() => setResultado(null)} 
            className="mt-4 text-sm underline text-slate-500 hover:text-slate-800"
        >
            Comprar otro producto
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
        <ShoppingBag size={20} className="text-orange-500"/>
        Comprar en línea
      </h3>
      
      <form onSubmit={realizarCompra} className="flex flex-col gap-3">
        <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Tu Correo (Para tus puntos)</label>
            <input 
            type="email" 
            placeholder="ejemplo@correo.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-slate-300 p-3 rounded-lg focus:border-orange-500 outline-none transition-colors"
            required
            />
        </div>
        
        <button 
          type="submit" 
          disabled={procesando}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        >
          {procesando ? (
            <>
                <Loader2 className="animate-spin" /> Procesando pago...
            </>
          ) : (
            'Pagar Ahora y Sumar Puntos'
          )}
        </button>
      </form>
      <p className="text-xs text-slate-400 mt-3 text-center">
        🔒 Pago seguro simulado. Se sumará 1 sello automáticamente.
      </p>
    </div>
  );
}