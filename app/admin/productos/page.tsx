'use client';

import React, { useState, useEffect } from 'react';
import { Edit3, Trash2, Plus, Save, X, Loader2 } from 'lucide-react';

export default function GestionProductos() {
  const [productos, setProductos] = useState<any[]>([]);
  const [editando, setEditando] = useState<any>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // Estado para crear producto
  const [creando, setCreando] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    precio: '',
    categoria: '',
    descripcion: '',
    imagen: '',
    stock: 0
  });

  // Cargar productos al entrar
  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setCargando(false);
    }
  };

  const handleCreate = async () => {
    if (!nuevoProducto.nombre || !nuevoProducto.precio) {
      alert("Nombre y precio son obligatorios");
      return;
    }

    setGuardando(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoProducto),
      });

      if (res.ok) {
        const p = await res.json();
        setProductos((prev: any) => [p, ...prev]);
        setCreando(false);
        setNuevoProducto({
          nombre: '',
          precio: '',
          categoria: '',
          descripcion: '',
          imagen: '',
          stock: 0
        });
      } else {
        alert("Error al crear el producto.");
      }
    } catch (error) {
      alert("Error de conexión.");
    } finally {
      setGuardando(false);
    }
  };

  const handleEdit = (prod: any) => {
    setEditando({ ...prod });
  };

  const handleSave = async () => {
    if (!editando) return;

    setGuardando(true);
    try {
      // Llamada real a la API para actualizar en MongoDB
      const res = await fetch(`/api/products/${editando._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editando),
      });

      if (res.ok) {
        // Actualizamos la lista local para no tener que recargar la página
        setProductos((prev: any) =>
          prev.map((p: any) => p._id === editando._id ? editando : p)
        );
        setEditando(null);
      } else {
        alert("Error al guardar los cambios en el servidor.");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("Error de conexión con la base de datos.");
    } finally {
      setGuardando(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este delicioso producto?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProductos(prev => prev.filter((p: any) => p._id !== id));
      }
    } catch (error) {
      alert("No se pudo eliminar el producto.");
    }
  };

  if (cargando) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <Loader2 className="animate-spin text-orange-600" size={48} />
      <p className="font-bold text-slate-600">Abriendo el almacén...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">
              Gestión de Inventario
            </h1>
            <p className="text-slate-500 text-sm">Administra los productos de tu pastelería</p>
          </div>
          <button
            onClick={() => setCreando(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-orange-700 transition-all shadow-md"
          >
            <Plus size={20} /> Nuevo Producto
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-800 text-slate-200">
              <tr>
                <th className="p-4">Producto</th>
                <th className="p-4">Precio</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Categoría</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-slate-400 italic">No hay productos registrados aún.</td>
                </tr>
              ) : (
                productos.map((prod: any) => (
                  <tr key={prod._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-700">{prod.nombre}</div>
                      <div className="text-xs text-slate-400 truncate max-w-[200px]">{prod.descripcion}</div>
                    </td>
                    <td className="p-4 text-orange-600 font-bold">${prod.precio}</td>
                    <td className="p-4">
                      {prod.stock > 0 ? (
                        <span className="text-green-600 font-bold">{prod.stock} un.</span>
                      ) : (
                        <span className="text-red-500 font-bold text-xs bg-red-100 px-2 py-1 rounded">AGOTADO</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full border border-slate-200">
                        {prod.categoria || 'Especialidad'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(prod)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar producto"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(prod._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar producto"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Edición Rápida */}
      {editando && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-xl font-bold text-slate-800">Editar Producto</h2>
              <button
                onClick={() => setEditando(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Nombre del Postre</label>
                <input
                  type="text"
                  value={editando.nombre}
                  onChange={e => setEditando({ ...editando, nombre: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  placeholder="Ej: Pastel de Chocolate"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Precio ($)</label>
                  <input
                    type="text"
                    value={editando.precio}
                    onChange={e => setEditando({ ...editando, precio: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Categoría</label>
                  <input
                    type="text"
                    value={editando.categoria || ''}
                    onChange={e => setEditando({ ...editando, categoria: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    placeholder="Ej: Pasteles"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Stock</label>
                <input
                  type="number"
                  value={editando.stock || 0}
                  onChange={e => setEditando({ ...editando, stock: parseInt(e.target.value) })}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Descripción Corta</label>
                <textarea
                  value={editando.descripcion || ''}
                  onChange={e => setEditando({ ...editando, descripcion: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all h-24 resize-none"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={guardando}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${guardando ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-900 text-white active:scale-95'
                  }`}
              >
                {guardando ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={20} /> Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Creación */}
      {creando && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-xl font-bold text-slate-800">✨ Nuevo Producto</h2>
              <button
                onClick={() => setCreando(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Nombre del Postre *</label>
                <input
                  type="text"
                  value={nuevoProducto.nombre}
                  onChange={e => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  placeholder="Ej: Tarta de Fresa"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Precio ($) *</label>
                  <input
                    type="text"
                    value={nuevoProducto.precio}
                    onChange={e => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    placeholder="50.00"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Categoría</label>
                  <input
                    type="text"
                    value={nuevoProducto.categoria}
                    onChange={e => setNuevoProducto({ ...nuevoProducto, categoria: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    placeholder="postres"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Stock</label>
                <input
                  type="number"
                  value={nuevoProducto.stock}
                  onChange={e => setNuevoProducto({ ...nuevoProducto, stock: parseInt(e.target.value) })}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Imagen (ruta)</label>
                <input
                  type="text"
                  value={nuevoProducto.imagen}
                  onChange={e => setNuevoProducto({ ...nuevoProducto, imagen: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  placeholder="Ej: pastelfresa.jpg"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Descripción</label>
                <textarea
                  value={nuevoProducto.descripcion}
                  onChange={e => setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all h-24 resize-none"
                  placeholder="Una descripción deliciosa..."
                />
              </div>

              <button
                onClick={handleCreate}
                disabled={guardando}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${guardando ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700 text-white active:scale-95'
                  }`}
              >
                {guardando ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Creando...
                  </>
                ) : (
                  <>
                    <Plus size={20} /> Crear Producto
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}