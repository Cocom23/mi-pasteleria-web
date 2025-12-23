'use client';

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { User, LogOut, Settings, Shield } from "lucide-react";
import { useState } from "react";

export default function NavbarUser() {
    const { user, loading, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    if (loading) {
        return <div className="text-sm opacity-50">Cargando...</div>;
    }

    if (!user) {
        return (
            <Link
                href="/login"
                className="bg-white text-orange-600 px-4 py-2 rounded-full font-bold text-sm hover:bg-orange-50 transition-colors shadow-sm"
            >
                Iniciar Sesión
            </Link>
        );
    }

    return (
        <div className="flex items-center gap-4">

            {/* Botón Acceso Directo Admin (Solo visible para admins) */}
            {(user.role === 'admin' || user.role === 'superuser') && (
                <Link
                    href="/admin/productos"
                    className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white text-orange-600 hover:bg-orange-50 text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-sm border border-orange-200"
                >
                    <Settings size={14} /> Inventario
                </Link>
            )}

            <div className="relative">
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-2 hover:bg-orange-700 px-3 py-2 rounded-lg transition-colors focus:outline-none"
                >
                    <div className="w-8 h-8 bg-orange-300 rounded-full flex items-center justify-center text-orange-800 font-bold border-2 border-white">
                        {user.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left hidden md:block">
                        <p className="text-xs font-bold leading-none">{user.nombre}</p>
                        <p className="text-[10px] opacity-80 font-mono uppercase">{user.role}</p>
                    </div>
                </button>

                {/* Menú Desplegable */}
                {menuOpen && (
                    <div
                        className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden text-gray-800 animate-in fade-in slide-in-from-top-2 z-50"
                        onMouseLeave={() => setMenuOpen(false)}
                    >
                        <div className="p-3 border-b border-gray-100 bg-gray-50">
                            <p className="text-xs text-gray-500 uppercase font-bold">Cuenta</p>
                            <p className="text-sm font-medium truncate">{user.email}</p>
                        </div>

                        <div className="p-2">
                            {/* Opciones solo para Admin/Superuser */}
                            {(user.role === 'admin' || user.role === 'superuser') && (
                                <Link
                                    href="/admin/productos"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-orange-50 rounded-lg text-orange-700 font-medium"
                                >
                                    <Settings size={16} /> Panel de Ventas
                                </Link>
                            )}

                            {/* Opciones solo Superuser */}
                            {user.role === 'superuser' && (
                                <Link
                                    href="/admin/secreto"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-red-50 rounded-lg text-red-600 font-medium"
                                >
                                    <Shield size={16} /> Zona Secreta
                                </Link>
                            )}

                            {/* Gestión Usuarios (Superuser) */}
                            {user.role === 'superuser' && (
                                <Link
                                    href="/admin/usuarios"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-blue-50 rounded-lg text-blue-600 font-medium"
                                >
                                    <User size={16} /> Gestionar Usuarios
                                </Link>
                            )}

                            <button
                                onClick={() => { logout(); setMenuOpen(false); }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded-lg text-gray-600 mt-1"
                            >
                                <LogOut size={16} /> Cerrar Sesión
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
