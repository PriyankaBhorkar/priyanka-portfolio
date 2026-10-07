import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

interface SectionProps {
  id: string;
  title: string;
  lead?: string;
  icon?: LucideIcon;
  tone?: "clear" | "veil";
  children: React.ReactNode;
  className?: string;
}

/** A page section with a centred heading: icon badge, title, optional lead. */
export function Section({ id, title, lead, icon: Icon, tone = "clear", children, className }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("py-20 sm:py-28", tone === "veil" && "bg-white/55", className)}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          {Icon && (
            <span className="mx-auto mb-5 grid size-14 place-items-center rounded-2xl bg-accent-soft text-accent">
              <Icon className="size-6" aria-hidden="true" />
            </span>
          )}
          <h2 id={`${id}-title`} className="font-display text-[2.3rem] font-semibold leading-[1.08] tracking-[-0.02em] sm:text-[3.4rem]">
            {title}
          </h2>
          {lead && <p className="mt-4 text-lg text-muted">{lead}</p>}
        </Reveal>
        <div className="mt-12 sm:mt-14">{children}</div>
      </div>
    </section>
  );
}
