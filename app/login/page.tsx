'use client';

// 👇 ESTA ES LA LÍNEA QUE ARREGLA EL ERROR DE BUILD 👇
export const dynamic = 'force-dynamic'; 

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, User, Loader2, ChefHat } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const { login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const registered = searchParams.get('registered');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoggingIn(true);

        // Asumimos que tu hook login devuelve true/false
        const success = await login(email, password);

        if (success) {
            router.push('/');
        } else {
            setError('Credenciales incorrectas. Intenta de nuevo.');
            setIsLoggingIn(false);
        }
    };

    return (
        <div className="min-h-screen bg-orange-50 flex items-center justify-center p-6">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-orange-100">

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4 text-orange-600">
                        <ChefHat size={32} />
                    </div>
                    <h1 className="text-2xl font-black text-gray-800">Bienvenido de nuevo</h1>
                    <p className="text-gray-500 text-sm">Ingresa para administrar tu pastelería</p>
                </div>

                {/* Mensaje de éxito si viene de registrarse */}
                {registered && (
                    <div className="mb-6 p-3 bg-green-50 text-green-700 text-sm font-bold text-center rounded-lg border border-green-200 animate-in fade-in slide-in-from-top-2">
                        ¡Cuenta creada con éxito! Inicia sesión.
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Correo Electrónico</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all text-gray-900 font-medium placeholder-gray-400"
                                placeholder="admin@coffee.break"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all text-gray-900 font-medium placeholder-gray-400"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium animate-pulse border border-red-100">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoggingIn}
                        className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition-all shadow-lg active:scale-95 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoggingIn ? <Loader2 className="animate-spin" /> : 'Ingresar al Portal'}
                    </button>
                </form>

                <div className="mt-6 text-center pt-6 border-t border-gray-100">
                    <p className="text-sm text-gray-400 mb-2">¿Nuevo por aquí?</p>
                    <Link href="/register" className="text-orange-600 font-bold hover:underline">
                        ¡Crea tu cuenta gratis!
                    </Link>
                </div>

                <div className="mt-4 text-center">
                    <a href="/" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                        ← Volver a la tienda
                    </a>
                </div>

            </div>
        </div>
    );
}
