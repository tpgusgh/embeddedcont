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
  slides, 
  onUpdateSlide, 
  currentIndex, 
  onSlideChange 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingSlide, setEditingSlide] = useState<number | null>(null);
  const [direction, setDirection] = useState(0); 

  const nextSlide = () => {
    setDirection(1);
    const newIndex = (currentIndex + 1) % slides.length;
    onSlideChange(newIndex);
  };

  const prevSlide = () => {
    setDirection(-1);
    const newIndex = (currentIndex - 1 + slides.length) % slides.length;
    onSlideChange(newIndex);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    onSlideChange(index);
  };

  const handleEditToggle = (slideId: number) => {
    if (isEditing && editingSlide === slideId) {
      setIsEditing(false);
      setEditingSlide(null);
    } else {
      setIsEditing(true);
      setEditingSlide(slideId);
    }
  };

  useEffect(() => {
    if (isEditing && editingSlide !== null) {
      const currentSlideId = slides[currentIndex]?.id;
      if (currentSlideId !== editingSlide) {
        setIsEditing(false);
        setEditingSlide(null);
      }
    }
  }, [currentIndex, isEditing, editingSlide, slides]);

  const currentSlide = slides[currentIndex];

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentSlide.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="absolute w-full h-full flex items-center justify-center"
            >
              <SlideEditor
                slide={currentSlide}
                onUpdate={onUpdateSlide}
                isEditing={isEditing && editingSlide === currentSlide.id}
                onEditToggle={handleEditToggle}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-200 text-white/80 hover:text-white z-10"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-200 text-white/80 hover:text-white z-10"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="flex justify-center space-x-2 py-6">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentIndex
                ? 'bg-white scale-125'
                : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      <div className="text-center text-white/60 text-sm pb-4">
        {currentIndex + 1} / {slides.length}
      </div>
    </div>
  );
};
