import type { ButtonProps } from "../types";
function Button({ children }: ButtonProps) {
  return (
    <button
      className="mt-5 rounded-lg border border-[#2f80ed] px-4 py-2.5 text-sm font-semibold text-[#2f80ed] transition hover:bg-blue-50 dark:hover:bg-slate-800"
      type="button"
    >
      {children}
    </button>
  );
}
export default Button;
