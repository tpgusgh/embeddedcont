import { useMemo, useEffect, useState } from "react";
import { Carousel } from "./components/Carousel";
import { MQTTControls } from "./components/MQTTControls";
import { SlideData } from "./types";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useMQTT } from "./hooks/useMQTT";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  // 초기 슬라이드 6개
  const initialSlides: SlideData[] = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        id: i + 1,
        name: "",
        imageUrl: "",
      })),
    []
  );

  // 슬라이드 상태
  const [slides, setSlides] = useLocalStorage<SlideData[]>(
    "carousel-slides",
    initialSlides
  );
  const [currentSlideIndex, setCurrentSlideIndex] =
    useLocalStorage<number>("carousel-current-index", 0);

  // OK 제스처 전송 완료 애니메이션 상태
  const [showSent, setShowSent] = useState(false);
  const [faceData, setFaceData] = useState<any>(null);
  // MQTT 연결
  const { isConnected, publishMessage } = useMQTT({
    brokerUrl: "ws://192.168.171.6:9001", // 브로커 주소
    topic: "hyunho/slide",
    clientId: "carouselClient_" + Math.random().toString(16).substr(2, 8),
  });

  // 슬라이드 변경 함수
  const handleSlideChange = (index: number) => {
    const slidesCount = slides.length;
    const newIndex = (index + slidesCount) % slidesCount; // 순환
    setCurrentSlideIndex(newIndex);
  };

  // 슬라이드 업데이트 함수
  const handleUpdateSlide = (id: number, data: Partial<SlideData>) => {
    setSlides((prevSlides) =>
      prevSlides.map((slide) => (slide.id === id ? { ...slide, ...data } : slide))
    );
  };

  // 1초마다 제스처 확인
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://192.168.171.198:8000/gesture");
        const data = await res.json();

        if (data.gesture === "LEFT") {
          handleSlideChange(currentSlideIndex - 1);
        } else if (data.gesture === "RIGHT") {
          handleSlideChange(currentSlideIndex + 1);
        } else if (data.gesture === "OK") {
          const slideNumber = currentSlideIndex + 1;
          publishMessage(slideNumber.toString());

          // 전송 완료 애니메이션
          setShowSent(true);
          setTimeout(() => setShowSent(false), 1500);
        }
      } catch (err) {
        console.error("gesture fetch error", err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentSlideIndex, publishMessage]);

  // 👉 face 데이터 fetch
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://192.168.171.198:8000/face");
        const data = await res.json();
        setFaceData(data);
      } catch (err) {
        console.error("face fetch error", err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 relative">
      <AnimatePresence>
        {showSent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.4 }}
            className="fixed top-10 left-1/2 transform -translate-x-1/2 z-[9999]
                       bg-green-500 text-white px-6 py-3 rounded-2xl shadow-lg font-bold text-lg"
          >
            ✅ 전송 완료!
          </motion.div>
        )}
      </AnimatePresence>

      {faceData && (
        <div className="absolute top-4 left-4 z-50 bg-black/50 text-white p-4 rounded-xl text-sm max-w-xs">
          <pre className="whitespace-pre-wrap break-words">
            {JSON.stringify(faceData, null, 2)}
          </pre>
        </div>
      )}



      {/* 배경 효과 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.1),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.1),transparent_50%)] pointer-events-none" />

      {/* 메인 */}
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

        {/* MQTT 컨트롤 버튼 */}
        <div className="flex-shrink-0 flex justify-center pb-8">
          <MQTTControls
            publishMessage={(msg) => {
              publishMessage(msg);
              // 버튼으로 보낼 때도 애니메이션 실행
              setShowSent(true);
              setTimeout(() => setShowSent(false), 1500);
            }}
            isConnected={isConnected}
            currentSlide={currentSlideIndex}
          />

        </div>
      </div>
    </div>
  );
}

export default App;
