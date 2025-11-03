'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, LogOut, Home } from 'lucide-react';
import { mockCombos } from '@/lib/mockData';
import { Combo } from '@/types/combo';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminPage() {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  async function fetchCombos() {
    try {
      // Usando datos mock temporalmente
      const data = [...mockCombos];
      setCombos(data);
    } catch (error) {
      console.error('Error fetching combos:', error);
    }
  }

  useEffect(() => {
    const session = localStorage.getItem('admin_session');
    if (session === 'authenticated') {
      setIsAuthenticated(true);
      fetchCombos();
    }
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    // Simple password protection (in production, use Supabase Auth)
    if (password === 'admin123') {
      localStorage.setItem('admin_session', 'authenticated');
      setIsAuthenticated(true);
      fetchCombos();
    } else {
      alert('Contraseña incorrecta');
    }
  }

  function handleLogout() {
    localStorage.removeItem('admin_session');
    setIsAuthenticated(false);
    setPassword('');
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de eliminar este combo?')) return;

    try {
      setCombos(combos.filter(c => c.id !== id));
      alert('Combo eliminado (mock - no persistente)');
    } catch (error) {
      console.error('Error deleting combo:', error);
      alert('Error al eliminar el combo');
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8"
        >
          <h1 className="text-2xl font-bold text-gray-800">Panel Administrativo</h1>
          <p className="mt-2 text-gray-500">Ingresa la contraseña para gestionar los combos.</p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 text-blue-950 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-shadow"
            >
              Ingresar
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Contraseña por defecto: <code className="bg-gray-100 px-2 py-1 rounded">admin123</code>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Pintury - Gestión de Combos
            </h1>
            <div className="flex gap-3">
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-gray-200 text-gray-700 px-3 md:px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden md:inline">Ver Sitio</span>
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Salir</span>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Add Button */}
        <Link href="/admin/combos/nuevo">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mb-8 flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <Plus className="w-5 h-5" />
            Agregar Nuevo Combo
          </motion.button>
        </Link>

        {/* Combos List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {combos.map((combo) => (
            <motion.div
              key={combo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="relative h-48 bg-gradient-to-br from-orange-100 to-red-100">
                {combo.image_url ? (
                  <Image
                    src={combo.image_url}
                    alt={combo.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    Sin imagen
                  </div>
                )}
                {!combo.available && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold">
                      No Disponible
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-800">{combo.name}</h3>
                  <span className="text-lg font-bold text-orange-600">
                    ${combo.price.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{combo.description}</p>
                <p className="text-xs text-gray-500 mb-4">
                  Categoría: <span className="font-semibold">{combo.category}</span>
                </p>

                <div className="flex gap-2">
                  <Link href={`/admin/combos/${combo.id}`} className="flex-1">
                    <button className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                      <Edit2 className="w-4 h-4" />
                      Editar
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(combo.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {combos.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">No hay combos creados aún</p>
            <p className="text-gray-500 mt-2">Haz clic en &quot;Agregar Nuevo Combo&quot; para comenzar</p>
          </div>
        )}
      </main>
    </div>
  );
}
