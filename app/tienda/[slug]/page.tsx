'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ShoppingBag } from 'lucide-react';
import { useParams } from 'next/navigation';
import ComboCard from '@/components/ComboCard';
import FilterBar from '@/components/FilterBar';
import { ApiError, errorMessage, getPublicCatalog, PublicCatalog } from '@/lib/api';
import { Combo } from '@/types/combo';

export default function SellerCatalogPage() {
  const params = useParams<{ slug: string }>();
  const [catalog, setCatalog] = useState<PublicCatalog | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = useMemo(
    () => Array.from(new Set((catalog?.combos ?? []).map(combo => combo.category))),
    [catalog],
  );
  const filteredCombos = useMemo(
    () => selectedCategory === 'all'
      ? catalog?.combos ?? []
      : (catalog?.combos ?? []).filter(combo => combo.category === selectedCategory),
    [catalog, selectedCategory],
  );

  async function loadCatalog() {
    try {
      setError(null);
      setNotFound(false);
      setCatalog(await getPublicCatalog(params.slug));
    } catch (caught) {
      if (caught instanceof ApiError && caught.status === 404) {
        setNotFound(true);
      } else {
        setError(errorMessage(caught));
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCatalog();
    // params.slug identifica por completo el catálogo que se debe cargar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.slug]);

  function openWhatsApp(combo?: Combo) {
    if (!catalog) return;

    const message = combo
      ? `¡Hola! Me interesa el producto: *${combo.name}* - ${combo.price.toFixed(2)} ${combo.currency}`
      : `¡Hola! Vi el catálogo de ${catalog.seller.name} y quisiera más información.`;
    window.open(
      `https://wa.me/${catalog.seller.whatsapp}?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer',
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-orange-50">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-orange-50 px-4 text-center">
        <div>
          <ShoppingBag className="mx-auto h-20 w-20 text-gray-300" />
          <h1 className="mt-5 text-3xl font-bold text-gray-700">Catálogo no encontrado</h1>
          <p className="mt-2 text-gray-500">Comprueba que el enlace enviado por tu vendedor esté completo.</p>
        </div>
      </div>
    );
  }

  if (!catalog || error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-orange-50 px-4 text-center">
        <div className="max-w-lg rounded-2xl border border-red-200 bg-white p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-red-700">No pudimos cargar el catálogo</h1>
          <p className="mt-2 text-red-600">{error}</p>
          <button onClick={loadCatalog} className="mt-5 rounded-xl bg-red-600 px-5 py-2 font-semibold text-white">
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <header className="sticky top-0 z-50 bg-white/90 shadow-md backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 p-3">
              <ShoppingBag className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 md:text-3xl">{catalog.seller.name}</h1>
              <p className="text-xs text-gray-500 md:text-sm">Catálogo de productos</p>
            </div>
          </div>
          <button
            onClick={() => openWhatsApp()}
            className="flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2 font-semibold text-white hover:bg-green-600"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Contactar</span>
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <h2 className="text-4xl font-bold text-gray-800 md:text-5xl">Productos disponibles</h2>
          <p className="mt-3 text-lg text-gray-600">Elige tu favorito y realiza el pedido por WhatsApp.</p>
        </motion.div>

        <FilterBar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {filteredCombos.length === 0 ? (
          <div className="py-20 text-center">
            <ShoppingBag className="mx-auto mb-4 h-24 w-24 text-gray-300" />
            <h3 className="text-2xl font-bold text-gray-600">No hay productos disponibles</h3>
            <p className="mt-2 text-gray-500">Vuelve pronto para ver nuevas ofertas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredCombos.map(combo => (
              <ComboCard key={combo.id} combo={combo} onOrder={openWhatsApp} />
            ))}
          </div>
        )}
      </main>

      <footer className="mt-20 bg-gray-800 py-10 text-center text-white">
        <h3 className="text-xl font-bold">{catalog.seller.name}</h3>
        <button onClick={() => openWhatsApp()} className="mt-4 rounded-full bg-green-500 px-8 py-3 font-bold hover:bg-green-600">
          Contáctanos por WhatsApp
        </button>
        <p className="mt-7 text-sm text-gray-400">Catálogo publicado con Pintury</p>
      </footer>
    </div>
  );
}
