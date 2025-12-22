'use client'; 

import React, { useState } from 'react';
// Importamos los íconos (Asegúrate de haber instalado: npm install lucide-react)
import { Gift, Cookie, Star, PartyPopper, User } from 'lucide-react';

export default function TarjetaLealtad() {
  // --- ESTADOS (Datos Reales) ---
  const [email, setEmail] = useState('');
  const [usuarioCargado, setUsuarioCargado] = useState(false);
  const [cargando, setCargando] = useState(false);
  
  // Estos datos ahora vienen de MongoDB (empiezan en 0)
  const [sellos, setSellos] = useState(0); 
  const [premios, setPremios] = useState(0);

  const totalSlots = 10;
  const isComplete = sellos >= totalSlots;

  // --- FUNCIÓN: BUSCAR EN BASE DE DATOS ---
  const consultarPuntos = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email) return;

    setCargando(true);
    try {
      // Conexión con tu API real
      const res = await fetch(`/api/user?email=${email}`);
      const data = await res.json();
      
      if (res.ok) {
        setSellos(data.sellos);
        setPremios(data.premios);
        setUsuarioCargado(true);
      }
    } catch (error) {
      console.error("Error al conectar con la base de datos");
    } finally {
      setCargando(false);
    }
  };

  // --- VISTA 1: FORMULARIO DE INGRESO (Cuando entras a la página) ---
  if (!usuarioCargado) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg border border-orange-100 text-center mt-8">
        <div className="mb-4 flex justify-center text-orange-500">
          <Cookie size={48} />
        </div>
        <h3 className="text-xl font-bold text-orange-800 mb-2">Tarjeta de Lealtad</h3>
        <p className="text-slate-500 mb-6 text-sm">
          Ingresa tu correo para ver tus sellos acumulados.
        </p>
        
        <form onSubmit={consultarPuntos} className="flex gap-2">
          <div className="relative flex-1">
            <User className="absolute left-3 top-3 text-slate-400" size={18} />
            <input 
              type="email" 
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500 text-slate-700"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={cargando}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-600 disabled:opacity-50 transition-colors"
          >
            {cargando ? '...' : 'Ver'}
          </button>
        </form>
      </div>
    );
  }

  // --- VISTA 2: LA TARJETA (Cuando ya pusiste tu correo) ---
  return (
    <div className="w-full max-w-md mx-auto mt-8">
      
      {/* Barra superior con info del usuario */}
      <div className="flex justify-between items-center px-4 mb-2 text-xs text-slate-500 font-medium">
        <span>Hola, {email.split('@')[0]}</span>
        <button onClick={() => setUsuarioCargado(false)} className="text-orange-500 hover:underline">
          (Salir)
        </button>
      </div>

      {/* COMPONENTE DE TARJETA DE LEALTAD */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-orange-100 relative transition-all duration-300 transform hover:scale-[1.01]">
        
        {/* Encabezado */}
        <div className={`p-6 text-center transition-colors duration-500 ${isComplete ? 'bg-yellow-100' : 'bg-orange-500'}`}>
          <div className="flex justify-center mb-2">
            {isComplete ? (
              <PartyPopper size={48} className="text-yellow-600 animate-bounce" />
            ) : (
              <Gift size={48} className="text-white" />
            )}
          </div>
          <h2 className={`text-2xl font-bold ${isComplete ? 'text-yellow-700' : 'text-white'}`}>
            {isComplete ? '¡FELICIDADES! 🎉' : 'Tu Tarjeta Dulce'}
          </h2>
          <p className={`text-sm mt-1 font-medium ${isComplete ? 'text-yellow-800' : 'text-orange-100'}`}>
            {isComplete 
              ? '¡Tienes un postre gratis disponible!' 
              : `¡Te faltan ${totalSlots - sellos} sellos para tu premio!`}
          </p>

          {/* Premios Guardados */}
          {premios > 0 && !isComplete && (
            <div className="mt-3 inline-block bg-white/20 px-3 py-1 rounded-full text-white text-xs font-bold backdrop-blur-sm">
              🎁 Tienes {premios} {premios === 1 ? 'premio' : 'premios'} guardados
            </div>
          )}
        </div>

        {/* Cuerpo (Grid de Sellos) */}
        <div className="p-6 bg-white">
          <div className="grid grid-cols-5 gap-3 mb-6">
            {[...Array(totalSlots)].map((_, index) => {
              const active = index < sellos;
              const isPrizeSlot = index === totalSlots - 1;
              
              return (
                <div 
                  key={index} 
                  className={`
                    aspect-square rounded-full flex items-center justify-center relative
                    transition-all duration-500 ease-out
                    ${active 
                      ? 'bg-orange-500 shadow-md scale-100' 
                      : 'bg-slate-100 shadow-inner scale-95 border border-slate-200'
                    }
                    ${isPrizeSlot && !active ? 'border-2 border-dashed border-yellow-400 bg-yellow-50' : ''}
                  `}
                >
                  {active ? (
                    <Cookie className="text-white animate-[bounce_0.6s_ease-in-out]" size={20} />
                  ) : (
                    isPrizeSlot ? (
                      <Gift className="text-yellow-400 opacity-50" size={20} />
                    ) : (
                      <span className="text-slate-300 font-bold text-xs">{index + 1}</span>
                    )
                  )}
                </div>
              );
            })}
          </div>

          {/* Barra de Progreso */}
          <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2 overflow-hidden">
            <div 
              className={`h-2.5 rounded-full transition-all duration-700 ${isComplete ? 'bg-yellow-500' : 'bg-orange-400'}`} 
              style={{ width: `${(sellos / totalSlots) * 100}%` }}
            ></div>
          </div>
          <p className="text-center text-xs text-slate-400">
            {sellos} de {totalSlots} sellos completados
          </p>

          {/* Botón de Canje */}
          {isComplete && (
            <div className="mt-6 animate-pulse">
              <button className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold rounded-xl shadow-lg flex items-center justify-center gap-2">
                <Star size={20} className="fill-yellow-700 text-yellow-700" />
                ¡CANJEAR PREMIO!
                <Star size={20} className="fill-yellow-700 text-yellow-700" />
              </button>
              <p className="text-xs text-center text-slate-400 mt-2">
                Muestra esta pantalla en caja para reclamar.
              </p>
            </div>
          )}
        </div>
        
        {/* Decoración inferior (Ticket) */}
        <div className="h-4 bg-slate-800" style={{
            backgroundImage: "linear-gradient(45deg, #ffffff 25%, transparent 25%), linear-gradient(-45deg, #ffffff 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ffffff 75%), linear-gradient(-45deg, transparent 75%, #ffffff 75%)",
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px"
        }}></div>
      </div>
    </div>
  );
}