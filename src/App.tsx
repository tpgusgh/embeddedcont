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

  const [slides, setSlides] = useLocalStorage<SlideData[]>(
    "carousel-slides",
    initialSlides
  );
  const [currentSlideIndex, setCurrentSlideIndex] =
    useLocalStorage<number>("carousel-current-index", 0);

  const [showSent, setShowSent] = useState(false);
  const [analyzeData, setAnalyzeData] = useState<any>(null);

  // MQTT 연결
  const { isConnected, publishMessage } = useMQTT({
    brokerUrl: "ws://192.168.236.6:9001",
    topic: "hyunho/slide",
    clientId: "carouselClient_" + Math.random().toString(16).substr(2, 8),
  });

  const handleSlideChange = (index: number) => {
    const slidesCount = slides.length;
    const newIndex = (index + slidesCount) % slidesCount; // 순환
    setCurrentSlideIndex(newIndex);
  };

  const handleUpdateSlide = (id: number, data: Partial<SlideData>) => {
    setSlides((prevSlides) =>
      prevSlides.map((slide) =>
        slide.id === id ? { ...slide, ...data } : slide
      )
    );
  };

  // 1초마다 제스처 확인
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://192.168.236.197:8000/gesture");
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

  // 1초마다 /analyze 데이터 fetch
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://192.168.236.6:8000/analyze", {
          method: "POST",
        });
        const data = await res.json();
        setAnalyzeData(data);
      } catch (err) {
        console.error("analyze fetch error", err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 relative">
      {/* ✅ 전송 완료 애니메이션 */}
      <AnimatePresence>
        {showSent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.4 }}
            className="fixed top-10 left-1/2 -translate-x-1/2 z-[9999]
                       bg-green-500 text-white px-6 py-3 rounded-2xl shadow-lg font-bold text-lg"
          >
            ✅ 전송 완료!
          </motion.div>
        )}
      </AnimatePresence>

      {/* analyze 데이터: 중앙 상단, 한 줄, 스크롤 가능 */}
      {analyzeData && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[1000] bg-black/50 backdrop-blur-md px-4 py-2 rounded-2xl shadow-md text-white text-sm flex gap-2 overflow-x-auto whitespace-nowrap max-w-[90vw]">
          {Object.entries(analyzeData.results).map(([key, value]: [string, any]) => {
            const keyMap: Record<string, string> = {
              pigmentation: "색소침착",
              moisture: "수분",
              elasticity_R2: "탄력",
              wrinkle_Ra: "주름",
              pore: "모공",
            };
            const label = keyMap[key] || key;
            const shortDesc = value.description?.split("-")[0].trim() || "";
            return (
              <span
                key={key}
                className="bg-white/20 px-3 py-1 rounded-full flex-shrink-0"
              >
                {label}: {shortDesc}
              </span>
            );
          })}
        </div>
      )}

      {/* 배경 효과 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.1),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.1),transparent_50%)] pointer-events-none" />

      {/* 메인 레이아웃 */}
      <div className="relative z-10 h-screen flex flex-col">
        {/* 🎯 Carousel: 화면 대부분 차지 */}
        <main className="flex-1 container mx-auto px-4 flex items-center justify-center">
          <div className="w-full max-w-6xl h-[100vh]">
            <Carousel
              slides={slides}
              onUpdateSlide={handleUpdateSlide}
              currentIndex={currentSlideIndex}
              onSlideChange={handleSlideChange}
            />
          </div>
        </main>

        {/* ⚙️ MQTTControls: 하단 작게 */}
        <footer className="flex-shrink-0 flex justify-center pb-6">
          <MQTTControls
            publishMessage={(msg) => {
              publishMessage(msg);
              setShowSent(true);
              setTimeout(() => setShowSent(false), 1500);
            }}
            isConnected={isConnected}
            currentSlide={currentSlideIndex}
          />
        </footer>
      </div>
    </div>
  );
}

export default App;
