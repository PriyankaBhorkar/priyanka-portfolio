import { CalendarDays, MapPin, type LucideIcon } from "lucide-react";

interface TimelineItemProps {
  icon: LucideIcon;
  title: string;
  organization: string;
  period: string;
  location?: string;
  children: React.ReactNode;
}

/** A vertical rail with a dot per entry; each entry is a card. */
export function Timeline({ children }: { children: React.ReactNode }) {
  return (
    <ol className="relative mx-auto max-w-5xl space-y-8">
      <span className="absolute bottom-0 left-[7px] top-3 w-0.5 rounded-full bg-gradient-to-b from-accent via-accent/40 to-transparent" aria-hidden="true" />
      {children}
    </ol>
  );
}

export function TimelineItem({ icon: Icon, title, organization, period, location, children }: TimelineItemProps) {
  return (
    <li className="relative pl-9 sm:pl-12">
      <span className="absolute left-0 top-9 size-4 rounded-full border-[3px] border-white bg-accent shadow-[0_0_0_4px_rgb(194_24_91/0.15)]" aria-hidden="true" />
      <article className="rounded-3xl border border-line bg-white p-6 shadow-lift sm:p-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-display text-[1.45rem] font-semibold leading-tight tracking-[-0.01em] sm:text-2xl">{title}</h3>
              <p className="mt-1 font-semibold text-accent">{organization}</p>
            </div>
          </div>
          <p className="shrink-0 space-y-1 text-[0.93rem] text-muted sm:text-right">
            <span className="flex items-center gap-2 tabular-nums sm:justify-end">
              <CalendarDays className="size-4 text-accent" aria-hidden="true" />
              {period}
            </span>
            {location && (
              <span className="flex items-center gap-2 sm:justify-end">
                <MapPin className="size-4 text-accent" aria-hidden="true" />
                {location}
              </span>
            )}
          </p>
        </header>
        {children}
      </article>
    </li>
  );
}

export function Bullets({ items, first }: { items: string[]; first?: string }) {
  return (
    <ul className="mt-6 space-y-3 text-[0.99rem] text-ink/85">
      {first && (
        <li className="flex gap-3 font-semibold text-ink">
          <span className="mt-[0.62em] size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
          {first}
        </li>
      )}
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-[0.62em] size-1.5 shrink-0 rounded-full bg-accent/60" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );
}
