import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SlideData } from '../types';
import { SlideEditor } from './SlideEditor';
import { motion, AnimatePresence } from 'framer-motion';

interface CarouselProps {
  slides: SlideData[];
  onUpdateSlide: (id: number, data: Partial<SlideData>) => void;
  currentIndex: number;
  onSlideChange: (index: number) => void;
}

export const Carousel: React.FC<CarouselProps> = ({ 
  slides, onUpdateSlide, currentIndex, onSlideChange 
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);
  const currentSlide = slides[currentIndex];

  const changeSlide = (step: number) => {
    setDirection(step);
    onSlideChange((currentIndex + step + slides.length) % slides.length);
  };

  const toggleEdit = (id: number) => 
    setEditingId(editingId === id ? null : id);

  useEffect(() => {
    if (editingId && currentSlide?.id !== editingId) setEditingId(null);
  }, [currentIndex]);

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentSlide.id}
            custom={direction}
            initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute w-full h-full flex items-center justify-center"
          >
            <SlideEditor
              slide={currentSlide}
              onUpdate={onUpdateSlide}
              isEditing={editingId === currentSlide.id}
              onEditToggle={toggleEdit}
            />
          </motion.div>
        </AnimatePresence>

        <button
          onClick={() => changeSlide(-1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 text-white/80 hover:text-white z-10"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={() => changeSlide(1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 text-white/80 hover:text-white z-10"
        >
          <ChevronRight size={24} />
        </button>
      </div>
      <div className="text-center text-white/60 text-sm pb-9">
        {currentIndex + 1} / {slides.length}
      </div>
    </div>
  );
};
