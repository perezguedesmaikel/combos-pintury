'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, LogOut, Home, Upload, X } from 'lucide-react';
import { mockCombos } from '@/lib/mockData';
import { Combo, ComboFormData } from '@/types/combo';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminPage() {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCombo, setEditingCombo] = useState<Combo | null>(null);
  const [formData, setFormData] = useState<ComboFormData>({
    name: '',
    description: '',
    price: 0,
    category: 'general',
    available: true,
    image: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  async function fetchCombos() {
    try {
      // Usando datos mock temporalmente
      const data = [...mockCombos];
      setCombos(data);
    } catch (error) {
      console.error('Error fetching combos:', error);
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  async function uploadImage(file: File): Promise<string | null> {
    try {
      // Simular subida de imagen con URL de ejemplo
      // En producción esto usará Supabase Storage
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = editingCombo?.image_url || null;

      if (formData.image) {
        const uploadedUrl = await uploadImage(formData.image);
        if (uploadedUrl) imageUrl = uploadedUrl;
      }

      const comboData: Combo = {
        id: editingCombo?.id || `${Date.now()}`,
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        available: formData.available,
        image_url: imageUrl,
        created_at: editingCombo?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (editingCombo) {
        // Actualizar combo existente
        setCombos(combos.map(c => c.id === editingCombo.id ? comboData : c));
        alert('Combo actualizado (mock - no persistente)');
      } else {
        // Agregar nuevo combo
        setCombos([comboData, ...combos]);
        alert('Combo creado (mock - no persistente)');
      }

      resetForm();
    } catch (error) {
      console.error('Error saving combo:', error);
      alert('Error al guardar el combo');
    } finally {
      setLoading(false);
    }
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

  function handleEdit(combo: Combo) {
    setEditingCombo(combo);
    setFormData({
      name: combo.name,
      description: combo.description,
      price: combo.price,
      category: combo.category,
      available: combo.available,
      image: null,
    });
    setImagePreview(combo.image_url);
    setShowForm(true);
  }

  function resetForm() {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: 'general',
      available: true,
      image: null,
    });
    setImagePreview(null);
    setEditingCombo(null);
    setShowForm(false);
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
        >
          <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Pintury - Panel Admin
          </h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 text-blue-950 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
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
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="mb-8 flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <Plus className="w-5 h-5" />
          Agregar Nuevo Combo
        </motion.button>

        {/* Form Modal */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 z-50"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-white md:rounded-2xl md:max-w-2xl md:w-full md:max-h-[90vh] h-full md:h-auto overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center sticky top-0 bg-white z-10 px-6 md:px-8 py-4 border-b">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                  {editingCombo ? 'Editar Combo' : 'Nuevo Combo'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700 p-2"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form id="combo-form" onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Combo
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border text-blue-950 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border text-blue-950 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border text-blue-950 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border text-blue-950 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="ej: familiar, individual"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagen
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                      <Upload className="w-5 h-5" />
                      Subir Imagen
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    {imagePreview && (
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="available"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="available" className="text-sm font-medium text-gray-700">
                    Disponible para clientes
                  </label>
                </div>

                </form>

              <div className="flex flex-col sm:flex-row gap-3 sticky bottom-0 bg-white px-6 md:px-8 py-4 border-t">
                <button
                  type="submit"
                  form="combo-form"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : editingCombo ? 'Actualizar' : 'Crear Combo'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="sm:px-6 bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

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
                  <button
                    onClick={() => handleEdit(combo)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar
                  </button>
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
            <p className="text-gray-500 mt-2">Haz clic en "Agregar Nuevo Combo" para comenzar</p>
          </div>
        )}
      </main>
    </div>
  );
}
