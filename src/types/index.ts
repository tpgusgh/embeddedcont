export interface SlideData {
  id: number;
  name: string;
  imageUrl: string;
}

export interface CarouselState {
  slides: SlideData[];
  currentIndex: number;
  isEditing: boolean;
  editingSlide: number | null;
}