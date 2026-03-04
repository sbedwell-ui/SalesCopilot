import { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

interface ImageLightboxProps {
  pages: { pageNumber: number; imageUrl: string }[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function ImageLightbox({ pages, currentIndex, onClose, onNavigate }: ImageLightboxProps) {
  const current = pages[currentIndex];
  const hasMultiple = pages.length > 1;

  const goLeft = useCallback(() => {
    if (currentIndex > 0) onNavigate(currentIndex - 1);
  }, [currentIndex, onNavigate]);

  const goRight = useCallback(() => {
    if (currentIndex < pages.length - 1) onNavigate(currentIndex + 1);
  }, [currentIndex, pages.length, onNavigate]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goLeft();
      if (e.key === 'ArrowRight') goRight();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, goLeft, goRight]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col items-center gap-3 max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center gap-4 self-end">
          {hasMultiple && (
            <span className="text-sm text-white/80">
              {currentIndex + 1} of {pages.length}
            </span>
          )}
          <a
            href={current.imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-white/80 hover:text-white transition-colors"
          >
            <ExternalLink size={14} />
            Open in new tab
          </a>
          <button
            onClick={onClose}
            className="p-1 text-white/80 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Image + nav */}
        <div className="flex items-center gap-4">
          {hasMultiple && (
            <button
              onClick={goLeft}
              disabled={currentIndex === 0}
              className="p-2 text-white/80 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          <img
            src={current.imageUrl}
            alt={`PDF page ${current.pageNumber}`}
            className="max-h-[80vh] max-w-full object-contain rounded-lg"
          />

          {hasMultiple && (
            <button
              onClick={goRight}
              disabled={currentIndex === pages.length - 1}
              className="p-2 text-white/80 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={28} />
            </button>
          )}
        </div>

        {/* Page label */}
        <span className="text-sm text-white/70">Page {current.pageNumber}</span>
      </div>
    </div>
  );
}
