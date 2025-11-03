'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Save } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { ComboFormData, Combo } from '@/types/combo';
import { mockCombos } from '@/lib/mockData';

export default function EditarComboPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [combo, setCombo] = useState<Combo | null>(null);
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
    // Cargar combo existente
    const comboId = params.id as string;
    const foundCombo = mockCombos.find(c => c.id === comboId);
    
    if (foundCombo) {
      setCombo(foundCombo);
      setFormData({
        name: foundCombo.name,
        description: foundCombo.description,
        price: foundCombo.price,
        category: foundCombo.category,
        available: foundCombo.available,
        image: null,
      });
      setImagePreview(foundCombo.image_url);
    }
  }, [params.id]);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Aquí se actualizaría en Supabase
      alert('Combo actualizado exitosamente (mock)');
      router.push('/admin');
    } catch (error) {
      console.error('Error updating combo:', error);
      alert('Error al actualizar el combo');
    } finally {
      setLoading(false);
    }
  }

  if (!combo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Cargando combo...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-gray-200 text-gray-700 px-3 md:px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Volver</span>
              </motion.button>
            </Link>
            <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Editar Combo
            </h1>
          </div>
        </div>
      </header>

      {/* Formulario */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 md:p-8 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Combo
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border text-blue-950 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border text-blue-950 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Precio ($)
                </label>
                <input
                  type="number"
                  id="price"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border text-blue-950 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <input
                  type="text"
                  id="category"
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
                <label className="flex items-center text-blue-950 gap-2 bg-gray-100 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                  <Upload className="w-5 h-5" />
                  Cambiar Imagen
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

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link href="/admin" className="w-full sm:flex-1">
                <button
                  type="button"
                  className="w-full bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50"
              >
                <Save className="w-5 h-5 flex-shrink-0" />
                <span className="whitespace-nowrap">{loading ? 'Guardando...' : 'Guardar Cambios'}</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
