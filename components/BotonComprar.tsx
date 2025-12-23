'use client';

import React, { useState } from 'react';
import { ShoppingBag, MapPin, Send, Home, TreePalm, Plus, Minus, Info } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function BotonComprar({ nombreProducto }: { nombreProducto: string }) {
  const { user } = useAuth();
  const [step, setStep] = useState<'initial' | 'details'>('initial');

  // Datos del pedido
  const [cantidad, setCantidad] = useState(1);
  const [isRegistering, setIsRegistering] = useState(false);
  const [guestData, setGuestData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    password: ''
  });

  // Datos de Dirección
  const [tipoUbicacion, setTipoUbicacion] = useState<'ciudad' | 'comunidad'>('ciudad');
  const [address, setAddress] = useState({
    calle: '',
    ciudad: '',
    extra: ''
  });

  const irADetalles = () => {
    setStep('details');
  };

  const handleGuestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuestData({ ...guestData, [e.target.name]: e.target.value });
  };

  const enviarPedidoWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address.calle || !address.ciudad) {
      alert("Por favor completa la información de entrega.");
      return;
    }

    let clienteNombre = user?.nombre;
    let clienteEmail = user?.email; // undefined if guest

    // Logic for Guest Registration & Data
    if (!user) {
      if (!guestData.nombre) {
        alert("Por favor ingresa tu nombre.");
        return;
      }
      clienteNombre = guestData.nombre;

      if (isRegistering) {
        if (!guestData.email || !guestData.password) {
          alert("Para registrarte necesitamos email y contraseña.");
          return;
        }

        try {
          // 1. Register User
          const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              nombre: guestData.nombre,
              email: guestData.email,
              password: guestData.password,
              telefono: guestData.telefono
            })
          });
          const data = await res.json();

          if (!res.ok) {
            alert(`Error en registro: ${data.error}`);
            return;
          }

          clienteEmail = guestData.email;
          alert("¡Cuenta creada! Tu pedido acumulará sellos.");
        } catch (err) {
          alert("Error de conexión. Intenta de nuevo.");
          return;
        }
      }
    }

    const numero = "9851082068";

    let direccionTexto = "";
    if (tipoUbicacion === 'ciudad') {
      direccionTexto = `Calle: ${address.calle}, Ciudad: ${address.ciudad}, CP: ${address.extra || 'N/A'}`;
    } else {
      direccionTexto = `Comunidad: ${address.ciudad}, Ref: ${address.calle}, Familia/Tienda: ${address.extra || 'N/A'}`;
    }

    const clienteInfo = user
      ? `Soy ${user.nombre} (${user.email})`
      : `Soy ${clienteNombre}${clienteEmail ? ` (${clienteEmail})` : ''}${isRegistering ? ' (Nuevo Registro)' : ' (Invitado)'}`;

    const mensaje = `Hola *The Coffee Break*! %0A%0AQuiero realizar un pedido:%0A *${cantidad}x ${nombreProducto}*%0A%0A ${clienteInfo}%0A ${guestData.telefono || user?.telefono || 'N/A'}%0A *Entrega (${tipoUbicacion.toUpperCase()}):*%0A${direccionTexto}%0A%0A¿Me confirman el total y tiempo de entrega? Gracias!`;

    window.open(`https://wa.me/${numero}?text=${mensaje}`, '_blank');
  };

  // --- VISTA DETALLES (CANTIDAD + DIRECCIÓN) ---
  if (step === 'details') {
    return (
      <div className="mt-8 bg-white p-6 rounded-xl shadow-lg border border-orange-100 animate-in slide-in-from-right-4 relative">

        <button
          onClick={() => setStep('initial')}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xs font-bold"
        >
          CERRAR X
        </button>

        <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2 text-xl">
          <Send size={24} className="text-green-500" />
          Detalles del Pedido
        </h3>

        <form onSubmit={enviarPedidoWhatsApp} className="space-y-6">

          {/* CANTIDAD */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Cantidad</label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setCantidad(c => Math.max(1, c - 1))}
                className="w-10 h-10 rounded-full bg-white border border-slate-300 flex items-center justify-center hover:bg-slate-100 shadow-sm transition-colors text-slate-800"
              >
                <Minus size={16} />
              </button>
              <span className="text-2xl font-black text-slate-900 w-12 text-center">{cantidad}</span>
              <button
                type="button"
                onClick={() => setCantidad(c => c + 1)}
                className="w-10 h-10 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center hover:bg-orange-200 shadow-sm transition-colors text-orange-700"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* 3. Datos Personales (Solo Invitados) */}
          {!user && (
            <div className="space-y-3 pb-4 border-b border-orange-100 mb-4 animate-in fade-in">
              <h3 className="font-semibold text-orange-800 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A7.5 7.5 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                Tus Datos
              </h3>

              <input
                type="text"
                name="nombre"
                placeholder="Tu Nombre (Obligatorio)"
                value={guestData.nombre}
                onChange={handleGuestChange}
                required
                className="w-full p-3 border-2 border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 font-medium focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
              />

              <input
                type="tel"
                name="telefono"
                placeholder="Teléfono (Opcional)"
                value={guestData.telefono}
                onChange={handleGuestChange}
                className="w-full p-3 border-2 border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 font-medium focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
              />

              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isRegistering}
                    onChange={(e) => setIsRegistering(e.target.checked)}
                    className="mt-1 w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <div className="flex-1">
                    <span className="font-bold text-slate-800">¡Quiero ganar sellos por esta compra!</span>
                    <p className="text-sm text-slate-600 mt-1">Crea una cuenta gratis para acumular puntos.</p>
                  </div>
                </label>

                {isRegistering && (
                  <div className="mt-3 space-y-3 pl-2 border-l-2 border-orange-200 ml-1 animate-in slide-in-from-top-2">
                    <input
                      type="email"
                      name="email"
                      placeholder="Correo Electrónico"
                      value={guestData.email}
                      onChange={handleGuestChange}
                      className="w-full p-3 border-2 border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 bg-white"
                    />
                    <input
                      type="password"
                      name="password"
                      placeholder="Crea una Contraseña"
                      value={guestData.password}
                      onChange={handleGuestChange}
                      className="w-full p-3 border-2 border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 bg-white"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* DIRECCIÓN */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block flex items-center gap-1">
              <MapPin size={14} /> ¿Dónde entregamos?
            </label>

            {/* Selector de Tipo */}
            <div className="flex bg-slate-100 p-1 rounded-lg mb-4">
              <button
                type="button"
                onClick={() => { setTipoUbicacion('ciudad'); setAddress({ calle: '', ciudad: '', extra: '' }); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold transition-all ${tipoUbicacion === 'ciudad' ? 'bg-white text-orange-600 shadow-sm border border-orange-200' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <Home size={14} /> Ciudad
              </button>
              <button
                type="button"
                onClick={() => { setTipoUbicacion('comunidad'); setAddress({ calle: '', ciudad: '', extra: '' }); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold transition-all ${tipoUbicacion === 'comunidad' ? 'bg-white text-orange-600 shadow-sm border border-orange-200' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <TreePalm size={14} /> Comunidad
              </button>
            </div>

            {tipoUbicacion === 'ciudad' ? (
              <div className="space-y-3 animate-in fade-in">
                <input
                  type="text" required placeholder="Calle y Número (Ej. Av. Hidalgo 50)"
                  value={address.calle}
                  onChange={e => setAddress({ ...address, calle: e.target.value })}
                  className="w-full p-3 border-2 border-slate-300 rounded-lg focus:border-orange-500 outline-none text-slate-900 placeholder:text-slate-400 font-medium"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text" required placeholder="Ciudad (Ej. Valladolid)"
                    value={address.ciudad}
                    onChange={e => setAddress({ ...address, ciudad: e.target.value })}
                    className="w-full p-3 border-2 border-slate-300 rounded-lg focus:border-orange-500 outline-none text-slate-900 placeholder:text-slate-400 font-medium"
                  />
                  <input
                    type="text" placeholder="C. Postal"
                    value={address.extra}
                    onChange={e => setAddress({ ...address, extra: e.target.value })}
                    className="w-full p-3 border-2 border-slate-300 rounded-lg focus:border-orange-500 outline-none text-slate-900 placeholder:text-slate-400 font-medium"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3 animate-in fade-in">
                <input
                  type="text" required placeholder="Nombre de la Comunidad (Ej. Tesoco)"
                  value={address.ciudad}
                  onChange={e => setAddress({ ...address, ciudad: e.target.value })}
                  className="w-full p-3 border-2 border-slate-300 rounded-lg focus:border-orange-500 outline-none text-slate-900 placeholder:text-slate-400 font-medium"
                />
                <input
                  type="text" required placeholder="Referencia (Ej: Casa azul frente al parque)"
                  value={address.calle}
                  onChange={e => setAddress({ ...address, calle: e.target.value })}
                  className="w-full p-3 border-2 border-slate-300 rounded-lg focus:border-orange-500 outline-none text-slate-900 placeholder:text-slate-400 font-medium"
                />
                <input
                  type="text" placeholder="Familia o Tienda Cercana (Ej. Familia Pérez)"
                  value={address.extra}
                  onChange={e => setAddress({ ...address, extra: e.target.value })}
                  className="w-full p-3 border-2 border-slate-300 rounded-lg focus:border-orange-500 outline-none text-slate-900 placeholder:text-slate-400 font-medium"
                />
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transform transition-all active:scale-[0.98]"
            >
              <Send size={20} /> Pedir por WhatsApp
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-3 flex items-center justify-center gap-1">
              <Info size={12} /> Serás redirigido/a al chat de la pastelería
            </p>
          </div>

          {!user && (
            <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 text-center">
              <p className="text-xs text-orange-800 font-medium">
                💡 <strong>Tip:</strong> Si te registras, ¡ganarás sellos por esta compra!
              </p>
              <Link href="/register" className="text-xs font-bold text-orange-600 hover:underline block mt-1">
                Crear cuenta gratis
              </Link>
            </div>
          )}
        </form>
      </div>
    );
  }

  // --- VISTA INICIAL (BOTÓN GRANDE) ---
  return (
    <div className="mt-8">
      <button
        onClick={irADetalles}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-4 rounded-2xl shadow-xl flex justify-center items-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] text-lg group"
      >
        <ShoppingBag size={24} className="group-hover:animate-bounce" />
        Hacer Pedido
      </button>

      {!user ? (
        <p className="text-center text-xs text-slate-400 mt-3">
          ¿Ya tienes cuenta? <Link href="/login" className="font-bold text-orange-600 hover:underline">Inicia Sesión</Link> para usar tus puntos.
        </p>
      ) : (
        <p className="text-center text-xs text-green-600 font-bold mt-3 bg-green-50 py-1 px-3 rounded-full inline-block mx-auto w-full">
          👋 Hola {user.nombre}, ¡acumularás puntos con este pedido!
        </p>
      )}
    </div>
  );
}