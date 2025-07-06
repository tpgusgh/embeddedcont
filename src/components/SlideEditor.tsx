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
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8">
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 w-full max-w-md border border-white/20 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white/90">
            {slide.id}
          </h2>
          {!isEditing && (
            <button
              onClick={() => onEditToggle(slide.id)}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 text-white/80 hover:text-white"
            >
              <Edit3 size={18} />
            </button>
          )}
        </div>

        <div className="space-y-6">
          <div className="w-full h-48 bg-white/10 rounded-xl overflow-hidden border border-white/20">
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
                <Image size={48} />
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  화장품 이름을 입력해주세요
                </label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  이미지 URL을 삽입해주세요
                </label>
                <input
                  type="url"
                  value={tempImageUrl}
                  onChange={(e) => setTempImageUrl(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="Enter image URL"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Save size={16} />
                  <span>저장</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <X size={16} />
                  <span>취소</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white/90 mb-2">
                {slide.name || 'Untitled Slide'}
              </h3>
              <p className="text-white/60 text-sm">
                편집하고싶으면 위에 아이콘을 눌러주세요
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};