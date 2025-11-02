'use client';

import { motion } from 'framer-motion';
import { ShoppingCart, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { Combo } from '@/types/combo';

interface ComboCardProps {
  combo: Combo;
  onOrder: (combo: Combo) => void;
}

export default function ComboCard({ combo, onOrder }: ComboCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer"
    >
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-orange-100 to-red-100">
        {combo.image_url ? (
          <Image
            src={combo.image_url}
            alt={combo.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <ShoppingCart className="w-24 h-24 text-orange-300" />
          </div>
        )}
        <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
          ${combo.price.toFixed(2)}
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-2xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
            {combo.name}
          </h3>
          <span className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-semibold">
            {combo.category}
          </span>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{combo.description}</p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onOrder(combo)}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
        >
          <MessageCircle className="w-5 h-5" />
          Ordenar por WhatsApp
        </motion.button>
      </div>
    </motion.div>
  );
}
