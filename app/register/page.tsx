'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { UserPlus, User, Lock, Mail, Phone, Loader2, ChefHat, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        telefono: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const emailParam = searchParams.get('email');
        if (emailParam) {
            setFormData(prev => ({ ...prev, email: emailParam }));
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                // Registro exitoso, redirigimos al login
                router.push('/login?registered=true');
            } else {
                setError(data.error || 'Error al registrarse');
            }
        } catch (err) {
            setError('Error de conexión. Intenta más tarde.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-orange-100 relative">
            <Link href="/" className="absolute top-4 left-4 text-gray-400 hover:text-orange-500">
                <ArrowLeft size={24} />
            </Link>

            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4 text-orange-600">
                    <UserPlus size={32} />
                </div>
                <h1 className="text-2xl font-black text-gray-800">Crear Cuenta</h1>
                <p className="text-gray-500 text-sm">Únete para ganar recompensas deliciosas</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nombre Completo</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                            type="text"
                            required
                            placeholder="Juan Pérez"
                            value={formData.nombre}
                            onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Correo Electrónico</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                            type="email"
                            required
                            placeholder="juan@ejemplo.com"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Teléfono (Opcional)</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="tel"
                                placeholder="999..."
                                value={formData.telefono}
                                onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                            />
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium animate-pulse">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-all shadow-lg active:scale-95 flex justify-center items-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin" /> : 'Registrarme Ahora'}
                </button>
            </form>

            <div className="mt-6 text-center pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-400 mb-2">¿Ya tienes cuenta?</p>
                <Link href="/login" className="text-orange-600 font-bold hover:underline">
                    Inicia Sesión aquí
                </Link>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-orange-50 flex items-center justify-center p-6">
            <Suspense fallback={<div className="text-orange-600"><Loader2 className="animate-spin" /> Cargando...</div>}>
                <RegisterForm />
            </Suspense>
        </div>
    );
}
