import { cn } from "@/lib/utils";

export function Chip({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex rounded-full border border-line bg-white px-3 py-1 text-sm text-ink", className)}>
      {children}
    </span>
  );
}
