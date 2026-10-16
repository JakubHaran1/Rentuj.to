import { useId, type InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  labelClassName?: string;
};

const baseInputClassName =
  "mt-1.5 w-full rounded-lg border border-[#c2c9d2] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#2f80ed] focus:ring-2 focus:ring-[#2f80ed]/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white";

function Input({
  label,
  error,
  labelClassName = "mt-4",
  className = "",
  id,
  type = "text",
  ...inputProps
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputClassName = [
    baseInputClassName,
    type === "file"
      ? "file:mr-3 file:rounded-md file:border-0 file:bg-[#2f80ed] file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white"
      : "transition placeholder:text-[#9ca3af]",
    className,
  ]
    .filter((el) => Boolean(el))
    .join(" ");

  return (
    <label
      className={`block text-sm font-medium text-[#1f2937] dark:text-slate-200 ${labelClassName}`}
      htmlFor={inputId}
    >
      {label}
      <input
        {...inputProps}
        aria-describedby={error ? `${inputId}-error` : undefined}
        aria-invalid={error ? true : undefined}
        className={inputClassName}
        id={inputId}
        type={type}
      />
      {error && (
        <span
          className="mt-1 block text-sm font-normal text-red-600 dark:text-red-400"
          id={`${inputId}-error`}
          role="alert"
        >
          {error}
        </span>
      )}
    </label>
  );
}

export default Input;
