'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Edit2, ExternalLink, LogOut, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { deleteCombo, errorMessage, getAdminCombos } from '@/lib/api';
import { Combo } from '@/types/combo';
import { AuthUser } from '@/types/seller';

type Props = {
  user: AuthUser;
  onLogout: () => Promise<void>;
};

export default function SellerDashboard({ user, onLogout }: Props) {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const seller = user.seller!;
  const catalogPath = `/tienda/${seller.slug}`;

  useEffect(() => {
    async function loadCombos() {
      try {
        setCombos(await getAdminCombos());
      } catch (caught) {
        setError(errorMessage(caught));
      } finally {
        setLoading(false);
      }
    }

    loadCombos();
  }, []);

  async function copyCatalogUrl() {
    await navigator.clipboard.writeText(`${window.location.origin}${catalogPath}`);
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de eliminar este combo?')) return;

    try {
      await deleteCombo(id);
      setCombos(current => current.filter(combo => combo.id !== id));
    } catch (caught) {
      alert(errorMessage(caught));
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <header className="sticky top-0 z-50 bg-white/90 shadow-md backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-600">Panel del vendedor</p>
            <h1 className="text-xl font-bold text-gray-800 md:text-2xl">{seller.name}</h1>
          </div>
          <div className="flex gap-2">
            <Link href={catalogPath} target="_blank" className="flex items-center gap-2 rounded-lg bg-gray-200 px-3 py-2 text-gray-700">
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">Ver catálogo</span>
            </Link>
            <button onClick={onLogout} className="flex items-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-white">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-8 rounded-2xl border border-orange-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-gray-700">Enlace público para tus clientes</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <code className="min-w-0 flex-1 overflow-x-auto rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-700">
              pintury-combos.netlify.app{catalogPath}
            </code>
            <button onClick={copyCatalogUrl} className="flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white">
              <Copy className="h-4 w-4" /> Copiar enlace
            </button>
          </div>
        </section>

        <Link href="/admin/combos/nuevo" className="mb-8 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 font-bold text-white shadow-lg">
          <Plus className="h-5 w-5" /> Agregar nuevo combo
        </Link>

        {error && <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}
        {loading ? (
          <div className="py-20 text-center text-gray-500">Cargando combos...</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {combos.map(combo => (
              <motion.article key={combo.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-xl bg-white shadow-lg">
                <div className="relative h-48 bg-orange-100">
                  {combo.image_url ? <Image src={combo.image_url} alt={combo.name} fill className="object-cover" /> : <div className="flex h-full items-center justify-center text-gray-400">Sin imagen</div>}
                  {!combo.available && <div className="absolute inset-0 flex items-center justify-center bg-black/50"><span className="rounded-full bg-red-500 px-4 py-2 font-bold text-white">No disponible</span></div>}
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-xl font-bold text-gray-800">{combo.name}</h2>
                    <span className="font-bold text-orange-600">{combo.price.toFixed(2)} {combo.currency}</span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-gray-600">{combo.description}</p>
                  <div className="mt-5 flex gap-2">
                    <Link href={`/admin/combos/${combo.id}`} className="flex-1 rounded-lg bg-blue-500 py-2 text-center text-white"><Edit2 className="mr-1 inline h-4 w-4" /> Editar</Link>
                    <button onClick={() => handleDelete(combo.id)} className="flex-1 rounded-lg bg-red-500 py-2 text-white"><Trash2 className="mr-1 inline h-4 w-4" /> Eliminar</button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {!loading && combos.length === 0 && <div className="py-20 text-center"><p className="text-xl text-gray-600">No has creado combos todavía</p><p className="mt-2 text-gray-500">Agrega el primero para comenzar a compartir tu catálogo.</p></div>}
      </main>
    </div>
  );
}
