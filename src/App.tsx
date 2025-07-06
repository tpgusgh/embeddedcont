import { useMemo } from 'react';
import { Carousel } from './components/Carousel';
import { MQTTControls } from './components/MQTTControls';
import { SlideData } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const initialSlides: SlideData[] = useMemo(() => 
    Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      name: '',
      imageUrl: '',
    })), []
  );

  const [slides, setSlides] = useLocalStorage<SlideData[]>('carousel-slides', initialSlides);
  const [currentSlideIndex, setCurrentSlideIndex] = useLocalStorage<number>('carousel-current-index', 0);

  const handleUpdateSlide = (id: number, data: Partial<SlideData>) => {
    setSlides(prevSlides => 
      prevSlides.map(slide => 
        slide.id === id ? { ...slide, ...data } : slide
      )
    );
  };

  const handleSlideChange = (index: number) => {
    setCurrentSlideIndex(index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.1),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.1),transparent_50%)] pointer-events-none" />
      
      <div className="relative z-10 h-screen flex flex-col">


        <main className="flex-1 container mx-auto px-4 flex items-center justify-center">
          <div className="w-full max-w-4xl h-full max-h-[600px]">
            <Carousel 
              slides={slides} 
              onUpdateSlide={handleUpdateSlide}
              currentIndex={currentSlideIndex}
              onSlideChange={handleSlideChange}
            />
          </div>
        </main>

        <div className="flex-shrink-0 flex justify-center pb-8">
          <MQTTControls currentSlide={currentSlideIndex} />
        </div>

      </div>
    </div>
  );
}

export default App;