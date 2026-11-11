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

// file is null and pk is set for images already stored on the server
export interface GalleryImage {
  id: string;
  file: File | null;
  previewUrl: string;
  isMain: boolean;
  pk?: number;
}

export interface GalleryImageResponse {
  pk: number;
  img: string;
  is_main: boolean;
}
