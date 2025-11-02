'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Lock, DollarSign } from 'lucide-react';
import { mockCombos } from '@/lib/mockData';
import { Combo } from '@/types/combo';
import ComboCard from '@/components/ComboCard';
import FilterBar from '@/components/FilterBar';
import Link from 'next/link';

export default function Home() {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [filteredCombos, setFilteredCombos] = useState<Combo[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCombos();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredCombos(combos);
    } else {
      setFilteredCombos(combos.filter(combo => combo.category === selectedCategory));
    }
  }, [selectedCategory, combos]);

  async function fetchCombos() {
    try {
      // Usando datos mock temporalmente
      const data = mockCombos;
      
      setCombos(data);
      setFilteredCombos(data);
      
      // Extract unique categories
      const uniqueCategories = Array.from(new Set(data.map(combo => combo.category)));
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching combos:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleOrder(combo: Combo) {
    const whatsappNumber = '5353910568';
    const message = `Hola! Me interesa el combo: *${combo.name}* - $${combo.price.toFixed(2)}`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-2xl">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Pintury Remesas y Combos
                </h1>
                <p className="text-xs md:text-sm text-gray-600">Envíos desde USA • Combos de comida</p>
              </div>
            </motion.div>

            <Link href="/admin">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors"
              >
                <Lock className="w-4 h-4" />
                <span className="hidden sm:inline">Admin</span>
              </motion.button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Nuestros <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Combos</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Comida deliciosa lista para ti. ¡Ordena ahora por WhatsApp!
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
            <div className="bg-blue-50 px-6 py-3 rounded-full border-2 border-blue-200">
              <span className="font-semibold text-blue-700">💵 Recibimos remesas desde USA</span>
            </div>
            <div className="bg-orange-50 px-6 py-3 rounded-full border-2 border-orange-200">
              <span className="font-semibold text-orange-700">🍗 Combos de comida frescos</span>
            </div>
          </div>
        </motion.div>

        <FilterBar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
          </div>
        ) : filteredCombos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No hay combos disponibles</h3>
            <p className="text-gray-500">Vuelve pronto para ver nuevas ofertas</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCombos.map((combo) => (
              <ComboCard key={combo.id} combo={combo} onOrder={handleOrder} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Pintury Remesas y Combos</h3>
              <p className="text-gray-300 mb-4">
                Tu solución completa para recibir remesas desde Estados Unidos y disfrutar de los mejores combos de comida en Cuba.
              </p>
              <div className="space-y-2 text-sm text-gray-400">
                <p>🇺🇸 Recibimos y entregamos dinero desde USA</p>
                <p>🍗 Combos de comida fresca y deliciosa</p>
                <p>⚡ Servicio rápido y confiable</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-lg mb-4 font-semibold">¿Tienes alguna pregunta?</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open('https://wa.me/5353910568', '_blank')}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full inline-flex items-center gap-2 transition-colors shadow-lg"
              >
                Contáctanos por WhatsApp
              </motion.button>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6 text-center">
            <p className="text-sm text-gray-400">
              © 2025 Pintury Remesas y Combos. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
