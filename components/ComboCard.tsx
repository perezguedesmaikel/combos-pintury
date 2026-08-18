'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, MessageCircle, ZoomIn } from 'lucide-react';
import Image from 'next/image';
import ImageLightbox from '@/components/ImageLightbox';
import { Combo } from '@/types/combo';

interface ComboCardProps {
  combo: Combo;
  onOrder: (combo: Combo) => void;
}

export default function ComboCard({ combo, onOrder }: ComboCardProps) {
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [imageExpanded, setImageExpanded] = useState(false);
  const hasLongDescription = combo.description.length > 80;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden group"
    >
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-orange-100 to-red-100">
        {combo.image_url ? (
          <button
            type="button"
            onClick={() => setImageExpanded(true)}
            aria-label={`Ver imagen completa de ${combo.name}`}
            className="absolute inset-0 cursor-zoom-in focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-orange-400"
          >
            <Image
              src={combo.image_url}
              alt={combo.name}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <span className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/70 px-3 py-2 text-xs font-semibold text-white opacity-100 shadow-lg transition-opacity md:opacity-0 md:group-hover:opacity-100">
              <ZoomIn className="h-4 w-4" />
              Ver imagen
            </span>
          </button>
        ) : (
          <div className="flex items-center justify-center h-full">
            <ShoppingCart className="w-24 h-24 text-orange-300" />
          </div>
        )}
        <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
          {combo.price.toFixed(2)} {combo.currency}
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

        <p
          className={`whitespace-pre-line break-words text-gray-600 ${
            descriptionExpanded ? '' : 'line-clamp-3'
          }`}
        >
          {combo.description}
        </p>

        {hasLongDescription && (
          <button
            type="button"
            onClick={() => setDescriptionExpanded(current => !current)}
            aria-expanded={descriptionExpanded}
            className="mb-4 mt-2 text-sm font-semibold text-orange-600 underline-offset-4 hover:underline"
          >
            {descriptionExpanded ? 'Mostrar menos' : 'Ver descripción completa'}
          </button>
        )}

        {!hasLongDescription && <div className="mb-4" />}

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

      {combo.image_url && (
        <ImageLightbox
          imageUrl={combo.image_url}
          alt={combo.name}
          isOpen={imageExpanded}
          onClose={() => setImageExpanded(false)}
        />
      )}
    </motion.div>
  );
}
