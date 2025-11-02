'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter } from 'lucide-react';

interface FilterBarProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function FilterBar({ categories, selectedCategory, onCategoryChange }: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md mb-4"
      >
        <Filter className="w-5 h-5" />
        Filtros
      </button>

      <AnimatePresence>
        {(isOpen || true) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="hidden md:flex flex-wrap gap-3 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCategoryChange('all')}
              className={`px-6 py-3 rounded-full font-semibold transition-all shadow-md ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Todos
            </motion.button>

            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onCategoryChange(category)}
                className={`px-6 py-3 rounded-full font-semibold transition-all shadow-md capitalize ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile filter */}
      <div className="md:hidden">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2"
            >
              <button
                onClick={() => {
                  onCategoryChange('all');
                  setIsOpen(false);
                }}
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                    : 'bg-white text-gray-700'
                }`}
              >
                Todos
              </button>

              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    onCategoryChange(category);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                      : 'bg-white text-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
