'use client';

import { motion } from 'framer-motion';
import { Link2, Lock, MessageCircle, ShoppingBag, Store } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <header className="bg-white/80 shadow-md backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 p-3">
              <ShoppingBag className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">Pintury</h1>
              <p className="text-sm text-gray-600">Catálogos de comida por vendedor</p>
            </div>
          </div>
          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-xl bg-gray-800 px-4 py-2 text-white transition-colors hover:bg-gray-700"
          >
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Administración</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-20">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-white shadow-xl">
            <Store className="h-12 w-12 text-orange-500" />
          </div>
          <h2 className="text-4xl font-bold text-gray-800 md:text-6xl">
            Tu vendedor tiene un catálogo preparado para ti
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 md:text-xl">
            Solicita su enlace por WhatsApp, ábrelo sin registro y elige tus combos favoritos.
          </p>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              { icon: MessageCircle, title: 'Recibe el enlace', text: 'Tu vendedor te lo enviará directamente por WhatsApp.' },
              { icon: Link2, title: 'Abre su catálogo', text: 'Verás únicamente las ofertas publicadas por ese vendedor.' },
              { icon: ShoppingBag, title: 'Realiza tu pedido', text: 'Pide el combo desde el botón de WhatsApp del catálogo.' },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl bg-white p-6 text-left shadow-lg">
                <Icon className="mb-4 h-8 w-8 text-orange-500" />
                <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{text}</p>
              </div>
            ))}
          </div>
        </motion.section>
      </main>

      <footer className="mt-16 bg-gray-800 py-8 text-center text-sm text-gray-400">
        © 2026 Pintury Remesas y Combos. Todos los derechos reservados.
      </footer>
    </div>
  );
}
