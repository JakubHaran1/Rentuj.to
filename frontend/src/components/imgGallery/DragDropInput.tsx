import { useDropzone } from "react-dropzone";
type DragDropInputProps = {
  onAddImg: (files: File[]) => void;
};
function DragDropInput({ onAddImg }: DragDropInputProps) {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },

    multiple: true,
    onDragEnter: () => console.log("enter"),
    onDrop: (acceptedFiles) => {
      onAddImg(acceptedFiles);
    },
  });
  return (
    <section className="container flex aspect-[1.35] flex-col items-center justify-center gap-2 rounded-2xl h-full border border-dashed border-[#c2c9d2] text-sm text-[#6b7280] text-center transition hover:border-[#2f80ed] hover:bg-[#f5f8fc] dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-950">
      <div
        {...getRootProps({
          className: "dropzone h-full flex flex-col justify-center",
        })}
      >
        <input {...getInputProps()} />
        <span className="text-3xl leading-none font-light">+</span>
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
    </section>
  );
}

export default DragDropInput;
