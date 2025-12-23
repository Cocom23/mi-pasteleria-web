'use client';

import React, { useState } from 'react';
import { ShoppingBag, Loader2, PartyPopper, CheckCircle, Ticket } from 'lucide-react';

export default function BotonComprar({ nombreProducto }: { nombreProducto: string }) {
  const [email, setEmail] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [resultado, setResultado] = useState<{ mensaje: string, tipo: 'exito' | 'premio' | 'error', sellos?: number } | null>(null);

  const realizarCompra = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setProcesando(true);
    setResultado(null);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, producto: nombreProducto })
      });

      const data = await res.json();

      if (res.ok) {
        const esPremio = data.mensaje.includes('PREMIO');
        setResultado({
          mensaje: data.mensaje,
          tipo: esPremio ? 'premio' : 'exito',
          sellos: data.sellos // Recibimos los sellos actuales de la API
        });

        // Disparar evento personalizado para actualizar la tarjeta de lealtad
        window.dispatchEvent(new CustomEvent('loyaltyUpdate', {
          detail: { sellos: data.sellos, premios: data.premios }
        }));
      } else {
        setResultado({ mensaje: 'Hubo un error en el pago.', tipo: 'error' });
      }
    } catch (error) {
      setResultado({ mensaje: 'Error de conexión', tipo: 'error' });
    }
    setProcesando(false);
  };

  // --- VISTA DE ÉXITO CON TARJETA DE PUNTOS ---
  if (resultado?.tipo === 'exito' || resultado?.tipo === 'premio') {
    return (
      <div className={`p-6 rounded-xl border-2 text-center animate-in zoom-in duration-300 ${resultado.tipo === 'premio' ? 'bg-yellow-50 border-yellow-400' : 'bg-green-50 border-green-200'}`}>
        <div className="flex justify-center mb-2">
          {resultado.tipo === 'premio' ? <PartyPopper className="text-yellow-600 animate-bounce" size={32} /> : <CheckCircle className="text-green-600" size={32} />}
        </div>
        <h3 className={`font-bold text-lg ${resultado.tipo === 'premio' ? 'text-yellow-800' : 'text-green-800'}`}>
          {resultado.tipo === 'premio' ? '¡PREMIO DESBLOQUEADO!' : '¡Sello Recibido!'}
        </h3>
        <p className="text-slate-600 mt-1 mb-4">{resultado.mensaje}</p>

        {/* TARJETA DE FIDELIDAD VISUAL */}
        {resultado.sellos !== undefined && (
          <div className="bg-white/50 p-4 rounded-lg border border-white shadow-sm mb-4">
            <div className="flex justify-between text-xs font-bold text-slate-500 mb-2 uppercase tracking-tighter">
              <span>Progreso de Regalo</span>
              <span>{resultado.sellos} / 10</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className={`h-8 rounded-md border-2 flex items-center justify-center transition-all duration-500 ${i < resultado.sellos! ? 'bg-orange-500 border-orange-600 shadow-inner' : 'bg-white border-slate-200'}`}
                >
                  {i < resultado.sellos! ? <CheckCircle size={14} className="text-white" /> : <div className="w-1 h-1 bg-slate-200 rounded-full" />}
                </div>
              ))}
            </div>
            {resultado.sellos < 10 && (
              <p className="text-[10px] text-orange-600 mt-3 font-bold italic">
                ¡Solo faltan {10 - resultado.sellos} compras para tu postre gratis!
              </p>
            )}
          </div>
        )}

        <button
          onClick={() => setResultado(null)}
          className="mt-2 text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center gap-2 mx-auto justify-center"
        >
          <Ticket size={16} /> Seguir Comprando
        </button>
      </div>
    );
  }

  // --- VISTA INICIAL (FORMULARIO) ---
  return (
    <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
        <ShoppingBag size={20} className="text-orange-500" />
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
            className="w-full border border-slate-300 p-3 rounded-lg focus:border-orange-500 outline-none transition-colors text-black"
            required
          />
        </div>

        <button
          type="submit"
          disabled={procesando}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
        >
          {procesando ? (
            <> <Loader2 className="animate-spin" /> Procesando... </>
          ) : (
            'Pagar Ahora y Sumar Puntos'
          )}
        </button>
      </form>
      <p className="text-[10px] text-slate-400 mt-3 text-center uppercase font-medium">
        🔒 Al pagar recibirás 1 sello automáticamente en tu cuenta.
      </p>
    </div>
  );
}