'use client';

import React, { useState, useEffect } from 'react';
import { Users, Shield, Save, Loader2, UserCog, User } from 'lucide-react';

export default function GestionUsuarios() {
    const [usuarios, setUsuarios] = useState<any[]>([]);
    const [cargando, setCargando] = useState(true);
    const [actualizando, setActualizando] = useState<string | null>(null);

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        try {
            const res = await fetch('/api/admin/users');
            const data = await res.json();
            if (res.ok) {
                setUsuarios(data);
            } else {
                console.error("Error cargando usuarios:", data.error);
            }
        } catch (error) {
            console.error("Error de conexión:", error);
        } finally {
            setCargando(false);
        }
    };

    const updateRole = async (id: string, newRole: string) => {
        if (!confirm(`¿Cambiar rol a ${newRole}?`)) return;

        setActualizando(id);
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, role: newRole })
            });

            if (res.ok) {
                setUsuarios(prev => prev.map(u => u._id === id ? { ...u, role: newRole } : u));
            } else {
                alert("No se pudo actualizar el rol");
            }
        } catch (error) {
            alert("Error de conexión");
        } finally {
            setActualizando(null);
        }
    };

    if (cargando) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 gap-4">
            <Loader2 className="animate-spin text-orange-500" size={48} />
            <p className="font-bold text-slate-400">Cargando usuarios...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-900 p-8 font-sans text-slate-100">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-orange-600 rounded-lg shadow-lg shadow-orange-500/20">
                        <Users size={32} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white uppercase tracking-tight">
                            Gestión de Usuarios
                        </h1>
                        <p className="text-slate-400 text-sm">Panel de Control de Superusuario</p>
                    </div>
                </div>

                <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-950 text-slate-400 uppercase text-xs tracking-wider">
                            <tr>
                                <th className="p-6 font-bold">Usuario</th>
                                <th className="p-6 font-bold">Email</th>
                                <th className="p-6 font-bold text-center">Rol Actual</th>
                                <th className="p-6 font-bold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {usuarios.map((user) => (
                                <tr key={user._id} className="hover:bg-slate-700/50 transition-colors">
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-slate-300 font-bold">
                                                {user.nombre?.charAt(0) || <User size={18} />}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white">{user.nombre || 'Sin Nombre'}</div>
                                                <div className="text-xs text-slate-500">Registrado: {new Date(user.createdAt).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 text-slate-300 font-mono text-sm">
                                        {user.email}
                                    </td>
                                    <td className="p-6 text-center">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${user.role === 'superuser' ? 'bg-red-500/10 text-red-400 border-red-500/50' :
                                                user.role === 'admin' ? 'bg-orange-500/10 text-orange-400 border-orange-500/50' :
                                                    'bg-blue-500/10 text-blue-400 border-blue-500/50'
                                            }`}>
                                            {user.role === 'superuser' && <Shield size={12} />}
                                            {user.role === 'admin' && <UserCog size={12} />}
                                            {user.role.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            {user.role !== 'client' && (
                                                <button
                                                    disabled={actualizando === user._id || user.role === 'superuser'}
                                                    onClick={() => updateRole(user._id, 'client')}
                                                    className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded text-slate-300 transition-colors disabled:opacity-50"
                                                >
                                                    Degradar a Cliente
                                                </button>
                                            )}
                                            {user.role !== 'admin' && user.role !== 'superuser' && (
                                                <button
                                                    disabled={actualizando === user._id}
                                                    onClick={() => updateRole(user._id, 'admin')}
                                                    className="text-xs bg-orange-600 hover:bg-orange-700 px-3 py-2 rounded text-white font-bold transition-colors shadow-lg shadow-orange-500/20 disabled:opacity-50"
                                                >
                                                    Hacer Admin
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {usuarios.length === 0 && (
                        <div className="p-12 text-center text-slate-500 italic">
                            No se encontraron usuarios.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
