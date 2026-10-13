import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

export type ButtonVariant = "primary" | "secondary";

const baseClassName =
  "inline-flex items-center justify-center rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f80ed]";

const variantClassNames: Record<ButtonVariant, string> = {
  primary:
    "border-[#2f80ed] bg-[#2f80ed] text-white hover:bg-transparent hover:text-[#2f80ed] dark:border-[#2f80ed] dark:bg-[#2f80ed] dark:text-white dark:hover:bg-transparent dark:hover:text-[#60a5fa]",
  secondary:
    "border-[#2f80ed] bg-transparent text-[#2f80ed] hover:bg-[#2f80ed] hover:text-white dark:hover:bg-[#2f80ed] dark:hover:text-white",
};

const getButtonClassName = (
  variant: ButtonVariant,
  className = "",
) => `${baseClassName} ${variantClassNames[variant]} ${className}`.trim();

type SharedProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
};

type ButtonProps = SharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof SharedProps | "type"> & {
    href?: never;
    type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  };

type LinkProps = SharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof SharedProps> & {
    href: string;
  };

function Button(props: ButtonProps | LinkProps) {
  if ("href" in props && typeof props.href === "string") {
    const {
      href,
      children,
      variant = "primary",
      className = "",
      ...linkProps
    } = props;

    return (
      <a
        className={getButtonClassName(variant, className)}
        href={href}
        {...linkProps}
      >
        {children}
      </a>
    );
  }

  const {
    children,
    variant = "primary",
    className = "",
    ...buttonProps
  } = props;

  return (
    <button className={getButtonClassName(variant, className)} {...buttonProps}>
      {children}
    </button>
  );
}

export default Button;
