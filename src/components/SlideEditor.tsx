// SlideEditor.tsx
import React, { useState, useEffect } from "react";
import { Edit3, Save, X, Image } from "lucide-react";
import { SlideData } from "../types";

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
    // 편집 시작할 때 최신값으로 초기화
    if (isEditing) {
      setTempName(slide.name ?? "");
      setTempImageUrl(slide.imageUrl ?? "");
    }
  }, [isEditing, slide]);

  const handleSave = () => {
    onUpdate(slide.id, { name: tempName, imageUrl: tempImageUrl });
    onEditToggle(slide.id);
  };

  const handleCancel = () => {
    setTempName(slide.name ?? "");
    setTempImageUrl(slide.imageUrl ?? "");
    onEditToggle(slide.id);
  };

  return (
    <div className="w-full flex items-center justify-center p-6">
      {/* 카드 전체에 max-height를 주고 스크롤 허용 */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl
                      max-h-[90vh] overflow-auto p-6 box-border">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white/90">슬라이드 {slide.id}</h2>
          {!isEditing && (
            <button
              onClick={() => onEditToggle(slide.id)}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 text-white/80 hover:text-white"
            >
              <Edit3 size={18} />
            </button>
          )}
        </div>

        {/* 본문(스크롤 되는 영역 전체) */}
        <div className="space-y-4">
          {/* 이미지 영역 (고정 높이, 이미지가 클 때는 내부에서 스크롤됨) */}
          <div className="w-full h-56 bg-white/10 rounded-lg overflow-hidden border border-white/20">
            {slide.imageUrl ? (
              <img
                src={slide.imageUrl}
                alt={slide.name || "Slide image"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/50">
                <Image size={40} />
              </div>
            )}
          </div>

          {/* 편집 폼 */}
          {isEditing ? (
            <>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">제품 이름</label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                  placeholder="Enter name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">이미지 URL</label>
                <input
                  type="url"
                  value={tempImageUrl}
                  onChange={(e) => setTempImageUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                  placeholder="Enter image URL"
                />
              </div>

              {/* 버튼 — 카드가 길어져도 같이 스크롤 됨 */}
              <div className="flex space-x-3 pt-2">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-sm font-medium"
                >
                  <Save size={16} />
                  <span>저장</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-sm font-medium"
                >
                  <X size={16} />
                  <span>취소</span>
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white/90 mb-2">
                {slide.name || "Untitled Slide"}
              </h3>
              <p className="text-white/60 text-sm">편집하려면 우측 상단 아이콘을 눌러주세요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
