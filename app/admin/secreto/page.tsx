'use client';

import React, { useState } from 'react';
import { ShieldAlert, Cookie, Trash2, Search, CheckCircle } from 'lucide-react';

export default function SecretAdminPanel() {
  const [email, setEmail] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');

  // Función para llamar a nuestra API secreta
  const ejecutarAccion = async (accion: string) => {
    if (!email) return;
    setLoading(true);
    setMensaje('');

    try {
      const res = await fetch('/api/admin/sellos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, accion }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setUserData(data.user);
        setMensaje(accion === 'agregar' ? '¡Sello agregado!' : 'Datos reiniciados');
      } else {
        setMensaje('Error: ' + data.error);
      }
    } catch (error) {
      setMensaje('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 font-mono">
      <div className="max-w-xl mx-auto border border-slate-700 rounded-lg p-6 bg-slate-800 shadow-2xl">
        
        {/* Encabezado Top Secret */}
        <div className="flex items-center gap-3 mb-8 border-b border-slate-700 pb-4">
          <ShieldAlert className="text-red-500 animate-pulse" />
          <h1 className="text-xl font-bold text-red-500 tracking-widest uppercase">
            Panel Confidencial: Nivel 5
          </h1>
        </div>

        {/* Buscador de Objetivo */}
        <div className="mb-6">
          <label className="block text-xs text-slate-400 mb-2 uppercase">Identificador del Objetivo (Email)</label>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="cliente@ejemplo.com"
              className="flex-1 bg-slate-900 border border-slate-600 rounded p-2 text-green-400 focus:outline-none focus:border-green-500 placeholder-slate-700"
            />
            <button 
              onClick={() => ejecutarAccion('consultar')} // Solo consulta (crea si no existe con 0 cambios)
              className="bg-slate-700 hover:bg-slate-600 px-4 rounded text-slate-300"
            >
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* Panel de Control (Solo aparece si hay datos) */}
        {userData && (
          <div className="bg-slate-900 rounded p-4 border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-2 gap-4 mb-6 text-center">
              <div className="p-3 bg-slate-800 rounded">
                <p className="text-slate-500 text-xs uppercase">Sellos Actuales</p>
                <p className="text-3xl font-bold text-orange-400">{userData.sellos} / 10</p>
              </div>
              <div className="p-3 bg-slate-800 rounded">
                <p className="text-slate-500 text-xs uppercase">Premios Ganados</p>
                <p className="text-3xl font-bold text-yellow-400">{userData.premios}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => ejecutarAccion('agregar')}
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Cookie /> +1 Sello
              </button>
              
              <button
                onClick={() => ejecutarAccion('reset')}
                disabled={loading}
                className="px-4 bg-red-900/50 hover:bg-red-900 text-red-200 rounded border border-red-800 transition-colors"
                title="Borrar todo el progreso"
              >
                <Trash2 size={20} />
              </button>
            </div>

            {mensaje && (
              <div className="mt-4 text-center text-sm flex items-center justify-center gap-2 text-green-400">
                 <CheckCircle size={14} /> {mensaje}
              </div>
            )}
          </div>
        )}

        <div className="mt-8 text-center text-xs text-slate-600">
          SISTEMA SEGURO • PROPIEDAD DE MI PASTELERÍA • NO COMPARTIR
        </div>
      </div>
    </div>
  );
}