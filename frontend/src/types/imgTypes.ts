export interface CropPosition {
  x: number;
  y: number;
}

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GalleryImage {
  id: string;
  file: File;
  previewUrl: string;
}
