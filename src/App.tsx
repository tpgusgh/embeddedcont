import { useMemo, useEffect } from 'react';
import { Carousel } from './components/Carousel';
import { MQTTControls } from './components/MQTTControls';
import { SlideData } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useMQTT } from './hooks/useMQTT';

function App() {
  const initialSlides: SlideData[] = useMemo(() => 
    Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      name: '',
      imageUrl: '',
    })), []
  );
  const { isConnected, publishMessage } = useMQTT({
    brokerUrl: 'ws://10.129.59.145:9001',
    topic: 'hyunho/slide',
  });
  const [slides, setSlides] = useLocalStorage<SlideData[]>('carousel-slides', initialSlides);
  const [currentSlideIndex, setCurrentSlideIndex] = useLocalStorage<number>('carousel-current-index', 0);

  useEffect(() => { //useEffect로 백엔드에 1초마다 요청
    const interval = setInterval(async () => { 
      try {
        const res = await fetch('http://10.129.59.145:8000/gesture'); // 백엔드 주소 맞게 수정
        const data = await res.json();

        if (data.gesture === 'LEFT') {
          handleSlideChange(currentSlideIndex - 1);
        } else if (data.gesture === 'RIGHT') {
          handleSlideChange(currentSlideIndex + 1);
        } else if (data.gesture === 'OK') {
          const slideNumber = currentSlideIndex + 1;
          publishMessage(slideNumber.toString());
        }
      } catch (err) {
        console.error('gesture fetch error', err);
      }
    }, 1000); // 1초마다 요청

    return () => clearInterval(interval);
  }, [currentSlideIndex, publishMessage]);
  const handleUpdateSlide = (id: number, data: Partial<SlideData>) => {
    setSlides(prevSlides => 
      prevSlides.map(slide => 
        slide.id === id ? { ...slide, ...data } : slide
      )
    );
  };

  const handleSlideChange = (index: number) => {
    const slidesCount = slides.length;
    const newIndex = (index + slidesCount) % slidesCount; //여기가 이제 6 다 찼을때 1로가고 1 더 내려가야할떄 6으로 만들어주는 알고리즘
    setCurrentSlideIndex(newIndex);
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
          <MQTTControls publishMessage={publishMessage} isConnected={isConnected} currentSlide={currentSlideIndex} /> {/* MQTT props로 꺼냄 */}
        </div>

      </div>
    </div>
  );
}

export default App;