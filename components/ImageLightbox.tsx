'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { X } from 'lucide-react';

type ImageLightboxProps = {
  imageUrl: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function ImageLightbox({ imageUrl, alt, isOpen, onClose }: ImageLightboxProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }

      if (event.key === 'Tab') {
        event.preventDefault();
        closeButtonRef.current?.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Imagen ampliada de ${alt}`}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-3 backdrop-blur-sm md:p-8"
      onMouseDown={event => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        aria-label="Cerrar imagen ampliada"
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-gray-900 shadow-lg transition hover:scale-105 hover:bg-white focus:outline-none focus:ring-4 focus:ring-orange-400 md:right-8 md:top-8"
      >
        <X className="h-6 w-6" />
      </button>

      <div className="relative h-[calc(100dvh-1.5rem)] w-full max-w-7xl md:h-[calc(100dvh-4rem)]">
        <Image
          src={imageUrl}
          alt={alt}
          fill
          sizes="100vw"
          className="select-none object-contain"
          priority
        />
      </div>
    </div>,
    document.body,
  );
}
