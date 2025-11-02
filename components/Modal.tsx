'use client';

import { useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  size = 'md' 
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || typeof window === 'undefined') return null;

  const sizeClasses = {
    sm: 'md:max-w-md',
    md: 'md:max-w-2xl',
    lg: 'md:max-w-4xl',
    xl: 'md:max-w-6xl',
    full: 'md:max-w-full md:m-4'
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex flex-col bg-white md:bg-black/60 md:items-center md:justify-center animate-in fade-in duration-300">
      {/* Backdrop para desktop - clickeable para cerrar */}
      <div 
        className="hidden md:block absolute inset-0 -z-10"
        onClick={onClose}
      />
      
      {/* Contenedor del Modal */}
      <div className={`flex h-full w-full flex-col bg-white md:h-auto md:max-h-[90vh] md:w-full ${sizeClasses[size]} md:rounded-2xl md:shadow-2xl animate-in slide-in-from-bottom duration-300 md:animate-in md:fade-in md:zoom-in-95`}>
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between bg-white px-4 md:px-8 py-4 border-b shadow-sm">
          <h2 className="text-lg md:text-2xl font-bold text-gray-800">
            {title}
          </h2>
          <button
            onClick={onClose}
            type="button"
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Contenido con scroll */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 md:p-8">
          {children}
        </div>
        
        {/* Footer (opcional) */}
        {footer && (
          <div className="flex-shrink-0 bg-white px-4 md:px-8 py-4 border-t shadow-lg">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
