import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import type { GalleryImage } from "./imgTypes";
import {
  useCallback,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import DragItem from "./DragItem";
import { isSortable } from "@dnd-kit/react/sortable";
import ImgCropper from "./ImgCropper";
import DragDropInput from "./DragDropInput";

type ImgGalleryProps = {
  imgs: GalleryImage[];
  setImgs: Dispatch<SetStateAction<GalleryImage[]>>;
  croppedImgs: GalleryImage[];
  setCroppedImgs: Dispatch<SetStateAction<GalleryImage[]>>;
};

function ImgGallery({
  imgs,
  setImgs,
  croppedImgs,
  setCroppedImgs,
}: ImgGalleryProps) {
  const [isCropperOpen, setIsCropperOpen] = useState(false);

  const onAddImg = useCallback(
    (files: File[]) => {
      const acceptedImg = files.map((file) => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
      }));

      setImgs((prev) => [...prev, ...acceptedImg]);
    },
    [setImgs],
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { source } = event.operation;
    if (event.canceled || !isSortable(source)) {
      return;
    }

    const oldIndex = source.initialIndex;
    const newIndex = source.index;
    const reordered = [...imgs];

    const [movedImage] = reordered.splice(oldIndex, 1);

    if (!movedImage) {
      return;
    }

    reordered.splice(newIndex, 0, movedImage);
    setImgs(reordered);
  };

  function handleCropSave(updatedImage: GalleryImage) {
    setCroppedImgs((previousCroppedImgs) => {
      const alreadyCropped = previousCroppedImgs.some(
        (image) => image.id === updatedImage.id,
      );

      if (alreadyCropped) {
        return previousCroppedImgs.map((image) =>
          image.id === updatedImage.id ? updatedImage : image,
        );
      }

      return [...previousCroppedImgs, updatedImage];
    });

    setIsCropperOpen(false);
  }

  const displayedImgs = imgs.map(
    (originalImage) =>
      croppedImgs.find(
        (croppedImage) => croppedImage.id === originalImage.id,
      ) ?? originalImage,
  );

  return (
    <section className="rounded-2xl border border-[#c2c9d2] bg-white p-5 text-[#1f2937] shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-[#16324f] dark:text-white">
          Photo Gallery
        </h2>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-[#16324f] dark:text-white">
          Zdjęcia ({imgs.length}/10)
        </h3>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <DragDropProvider onDragEnd={onDragEnd}>
          {displayedImgs.map((image, index) => (
            <DragItem key={image.id} id={image.id} index={index}>
              <img
                src={image.previewUrl}
                alt="Photo preview"
                draggable={false}
                className="h-full w-full object-cover rounded-2xl"
              />

              {index === 0 && (
                <span className="rounded-full absolute bottom-0 left-0 bg-[#e6f4ec] px-3 py-1 text-xs font-semibold text-[#2e8b57] dark:bg-emerald-950 dark:text-emerald-400">
                  Main Photo
                </span>
              )}
            </DragItem>
          ))}
        </DragDropProvider>
        <DragDropInput onAddImg={onAddImg} />
      </div>

      <p className="mt-4 text-sm text-[#6b7280] dark:text-slate-400">
        Drag photos to change their order. Click to edit.
      </p>

      <button
        type="button"
        onClick={() => {
          const firstImage = imgs[0];

          if (firstImage) {
            setIsCropperOpen(true);
          }
        }}
        className="mt-7 flex w-full items-center justify-between border-t border-[#e5e7eb] pt-5 text-left font-semibold text-[#16324f] transition hover:text-[#2f80ed] dark:border-slate-800 dark:text-slate-200 dark:hover:text-white"
      >
        <span className="flex items-center gap-3">
          <span className="text-xl">⌗</span>
          Photo edit
        </span>
        <span className="text-2xl font-light">›</span>
      </button>

      {isCropperOpen && imgs[0] ? (
        <ImgCropper
          images={imgs}
          initialImageId={imgs[0].id}
          onClose={() => setIsCropperOpen(false)}
          onSave={handleCropSave}
        />
      ) : null}
    </section>
  );
}

export default ImgGallery;
