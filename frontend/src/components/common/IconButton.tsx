import type { ButtonHTMLAttributes } from "react";

export type IconButtonVariant = "close";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: IconButtonVariant;
};

function IconButton({ variant, className, ...props }: IconButtonProps) {
  const getIconVariant = () => {
    if (variant == "close") {
      return (
        <i className="fa-solid fa-x text-sm text-[#16324f] text-xs dark:text-white"></i>
      );
    }
  };
  return (
    <div className={className}>
      <button className="cursor-pointer" {...props}>
        {getIconVariant()}
      </button>
    </div>
  );
}

export default IconButton;
