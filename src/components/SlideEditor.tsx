import React, { useState, useEffect } from 'react';
import { Edit3, Save, X, Image } from 'lucide-react';
import { SlideData } from '../types';

interface SlideEditorProps {
  slide: SlideData;
  onUpdate: (id: number, data: Partial<SlideData>) => void;
  isEditing: boolean;
  onEditToggle: (id: number) => void;
}

export const SlideEditor: React.FC<SlideEditorProps> = ({
  slide,
  onUpdate,
  isEditing,
  onEditToggle,
}) => {
  const [tempName, setTempName] = useState(slide.name);
  const [tempImageUrl, setTempImageUrl] = useState(slide.imageUrl);

  useEffect(() => {
    if (isEditing) {
      setTempName(slide.name);
      setTempImageUrl(slide.imageUrl);
    }
  }, [isEditing, slide]);

  const handleSave = () => {
    onUpdate(slide.id, { name: tempName, imageUrl: tempImageUrl });
    onEditToggle(slide.id);
  };

  const handleCancel = () => {
    setTempName(slide.name);
    setTempImageUrl(slide.imageUrl);
    onEditToggle(slide.id);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-3">
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 w-full max-w-xs border border-white/20 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-white/90">
            {slide.id}
          </h2>
          {!isEditing && (
            <button
              onClick={() => onEditToggle(slide.id)}
              className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 text-white/80 hover:text-white"
            >
              <Edit3 size={14} />
            </button>
          )}
        </div>

        <div className="space-y-3">
          <div className="w-full h-24 bg-white/10 rounded-md overflow-hidden border border-white/20">
            {slide.imageUrl ? (
              <img
                src={slide.imageUrl}
                alt={slide.name || 'Slide image'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/50">
                <Image size={28} />
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <div>
                <label className="block text-[11px] font-medium text-white/70 mb-1">
                  화장품 이름
                </label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-transparent text-xs"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-white/70 mb-1">
                  이미지 URL
                </label>
                <input
                  type="url"
                  value={tempImageUrl}
                  onChange={(e) => setTempImageUrl(e.target.value)}
                  className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-transparent text-xs"
                  placeholder="Enter image URL"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded transition-colors duration-200 flex items-center justify-center space-x-1 text-xs"
                >
                  <Save size={12} />
                  <span>저장</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white py-1 px-2 rounded transition-colors duration-200 flex items-center justify-center space-x-1 text-xs"
                >
                  <X size={12} />
                  <span>취소</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h3 className="text-base font-semibold text-white/90 mb-1">
                {slide.name || 'Untitled Slide'}
              </h3>
              <p className="text-white/60 text-[11px]">
                편집하려면 위 아이콘을 눌러주세요
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
