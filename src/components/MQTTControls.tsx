// MQTTControls.tsx
import React from 'react';
import { Send } from 'lucide-react';

interface MQTTControlsProps {
  currentSlide: number;
  publishMessage: (msg: string) => void; // 부모에서 받은 함수
  isConnected: boolean;
}

export const MQTTControls: React.FC<MQTTControlsProps> = ({
  currentSlide,
  publishMessage,
  isConnected,
}) => {
  const handleSendSlide = () => {
    const slideNumber = currentSlide + 1;
    publishMessage(slideNumber.toString());
  };

  return (
    <button
      onClick={handleSendSlide}
      disabled={!isConnected}
      className={`w-16 h-16 rounded-full font-semibold transition-all duration-200 flex items-center justify-center ${
        isConnected
          ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
          : 'bg-gray-500 text-gray-300 cursor-not-allowed'
      }`}
    >
      <Send size={24} />
    </button>
  );
};
