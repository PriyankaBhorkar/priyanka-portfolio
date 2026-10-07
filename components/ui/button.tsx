import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[0.95rem] font-medium transition-colors duration-200 disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-white shadow-[0_8px_20px_-8px_rgb(194_24_91/0.6)] hover:bg-accent-deep",
  outline: "border border-line bg-white text-ink hover:border-accent hover:text-accent-deep",
  ghost: "text-ink hover:bg-surface",
};

export function buttonClass(variant: Variant = "primary", className?: string) {
  return cn(base, variants[variant], className);
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: Variant }

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return <button className={buttonClass(variant, className)} {...props} />;
}
