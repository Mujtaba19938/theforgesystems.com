import type { ReactNode } from "react";
import { cn } from "../lib/utils";

/* ---- AnimatedText: slides current text up and reveals duplicate from below on hover ---- */
function AnimatedText({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-flex overflow-hidden">
      <span className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden
        className="absolute left-0 top-full block transition-transform duration-300 ease-in-out group-hover:-translate-y-full"
      >
        {children}
      </span>
    </span>
  );
}

/* ---- Size presets ---- */
const SIZES = {
  sm: "h-9 px-5 text-xs font-medium",
  md: "h-10 px-7 text-sm font-medium",
  lg: "h-12 px-9 text-sm font-medium",
} as const;

type Size = keyof typeof SIZES;

interface PrimaryButtonProps {
  as?: "a" | "button";
  size?: Size;
  className?: string;
  children: ReactNode;
  href?: string;
  onClick?: () => void;
}

export function PrimaryButton({
  as = "a",
  size = "lg",
  className,
  children,
  ...rest
}: PrimaryButtonProps) {
  const Component = as;
  return (
    <Component
      className={cn(
        "group inline-flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-black leading-none transition-colors cursor-pointer",
        SIZES[size],
        className
      )}
      {...rest}
    >
      <AnimatedText>{children}</AnimatedText>
    </Component>
  );
}
