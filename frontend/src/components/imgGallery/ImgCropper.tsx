import { useEffect, useRef, useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import type { GalleryImage } from "./imgTypes";

type ImgCropperProps = {
  images: GalleryImage[];
  initialImageId: string;
  onClose: () => void;
  onSave: (image: GalleryImage) => void;
};

async function createCroppedImage(
  imageSrc: string,
  cropArea: Area,
  fileName: string,
  fileType: string,
): Promise<{ file: File; previewUrl: string }> {
  const image = new Image();
  image.crossOrigin = "anonymous";
  image.src = imageSrc;

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () =>
      reject(new Error("Loading a file finished with status false"));
  });

  const canvas = document.createElement("canvas");
  canvas.width = cropArea.width;
  canvas.height = cropArea.height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("We can not prepare a photo for you");
  }

  context.drawImage(
    image,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    cropArea.width,
    cropArea.height,
  );

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, fileType || "image/jpeg"),
  );

  if (!blob) {
    throw new Error("Failed to create a cropped image.");
  }

  const file = new File([blob], fileName, { type: blob.type });

  return {
    file,
    previewUrl: URL.createObjectURL(blob),
  };
}

export default function ImgCropper({
  images,
  initialImageId,
  onClose,
  onSave,
}: ImgCropperProps) {
  const [selectedImageId, setSelectedImageId] = useState(initialImageId);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropArea, setCropArea] = useState<Area | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCreatingPreview, setIsCreatingPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const savedPreviewUrl = useRef<string | null>(null);
  const [isEdit, setIsEdit] = useState(true);
  const selectedImage = images.find((image) => image.id === selectedImageId);

  // Block underground layer
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCropArea(null);
    setPreviewUrl(null);
    setError(null);
  }, [selectedImageId]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl !== savedPreviewUrl.current) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  async function handlePreview() {
    if (!selectedImage || !cropArea) {
      return;
    }

    setIsCreatingPreview(true);
    setError(null);
    setIsEdit(false);

    try {
      const cropped = await createCroppedImage(
        selectedImage.previewUrl,
        cropArea,
        selectedImage.file.name,
        selectedImage.file.type,
      );

      setPreviewUrl(cropped.previewUrl);
      setIsCreatingPreview(false);
    } catch (cropError) {
      setError(
        cropError instanceof Error ? cropError.message : "Cropping img failed",
      );
    }
  }

  function handleSave() {
    if (!selectedImage || !previewUrl) {
      return;
    }

    savedPreviewUrl.current = previewUrl;

    fetch(previewUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const file = new File([blob], selectedImage.file.name, {
          type: blob.type,
        });

        onSave({
          ...selectedImage,
          file,
          previewUrl,
        });
      })
      .catch(() => {
        setError("We can not find a photo to save");
      });
  }

  if (!selectedImage) {
    return null;
  }

  return (
    <div
      className=" fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      aria-modal="true"
      aria-label="Select a frame of your photo"
    >
      <div className="max-h-[95vh] w-full max-w-5xl overflow-y-scroll rounded-2xl bg-white p-5 text-slate-900 shadow-xl md:max-h-[85vh] lg:max-h-[85vh] dark:bg-slate-900 dark:text-slate-100">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Edycja kadru</h2>
          <button type="button" onClick={onClose} aria-label="Zamknij">
            ✕
          </button>
        </div>

        <div className="mt-5 grid gap-5 min-[760px]:grid-cols-[minmax(0,1fr)_220px]">
          <div>
            <div className="relative h-[min(60vh,480px)] overflow-hidden rounded-xl bg-slate-950">
              <Cropper
                image={selectedImage.previewUrl}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3}
                onCropChange={(location: Point) => {
                  setIsEdit(true);
                  setCrop(location);
                }}
                onZoomChange={setZoom}
                onCropComplete={(_, area) => setCropArea(area)}
              />
            </div>

            <label className="mt-4 block text-sm">
              Zoom
              <input
                className="mt-2 w-full"
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(event) => {
                  setZoom(Number(event.target.value));
                  if (!isEdit) setIsEdit(true);
                }}
              />
            </label>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold dark:bg-slate-700"
                onClick={handlePreview}
                disabled={isCreatingPreview}
              >
                {isCreatingPreview ? "Cutting..." : "Preview"}
              </button>
              <button
                type="button"
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                onClick={handleSave}
                disabled={!previewUrl || isCreatingPreview || isEdit}
              >
                Save
              </button>
              <button
                type="button"
                className="rounded-lg px-4 py-2 text-sm"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>

            {error ? (
              <p className="mt-3 text-sm text-red-600" role="alert">
                {error}
              </p>
            ) : null}
          </div>

          <aside>
            <h3 className="text-sm font-semibold">Choose a photo</h3>
            <div className="mt-3 grid grid-cols-1 gap-2 min-[390px]:grid-cols-2 min-[760px]:grid-cols-1">
              {images.map((image) => (
                <button
                  type="button"
                  key={image.id}
                  className={`overflow-hidden rounded-lg border-2 ${
                    image.id === selectedImageId
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                  onClick={() => setSelectedImageId(image.id)}
                >
                  <img
                    src={image.previewUrl}
                    alt="Choose photo to cut"
                    className="aspect-video w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </aside>
        </div>

        {previewUrl ? (
          <div className="mt-5 border-t border-slate-200 pt-5 dark:border-slate-700">
            <h3 className="text-sm font-semibold">
              Preview of the accepted photo
            </h3>
            <img
              src={previewUrl}
              alt="Preview of the accepted photo"
              className="mt-3 max-h-56 rounded-xl object-contain"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
