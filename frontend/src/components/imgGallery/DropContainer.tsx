import { useDroppable } from "@dnd-kit/react";
import type { ReactNode } from "react";

type DropContainerProps = {
  id: string;
  children: ReactNode;
};

function DropContainer({ id, children }: DropContainerProps) {
  const { ref } = useDroppable({
    id,
  });

  return (
    <div className="bg-black" ref={ref} style={{ width: 300, height: 300 }}>
      {children}
    </div>
  );
}
export default DropContainer;
