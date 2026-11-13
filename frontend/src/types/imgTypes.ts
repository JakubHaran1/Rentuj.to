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

// Same shape as the backend PropertyImg. pk is a number for saved images
// and a client-side UUID for new ones (those also carry the file to upload).
export interface GalleryImage {
  pk: number | string;
  img: string;
  is_main: boolean;
  file?: File;
}
