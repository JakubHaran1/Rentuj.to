import type { ReactNode } from "react";
import type { GalleryImage } from "../../types/imgTypes";
import { useSortable } from "@dnd-kit/react/sortable";
type DragItemProps = {
  id: GalleryImage["pk"];
  children: ReactNode;
  index: number;
};

function DragItem({ children, id, index }: DragItemProps) {
  const { ref } = useSortable({
    id: id,
    index: index,
  });

  return (
    <div
      ref={ref}
      className="image-gallery__item relative h-48 touch-none select-none overflow-hidden rounded-2xl sm:h-56 lg:h-64"
    >
      {children}
    </div>
  );
}

export default DragItem;
