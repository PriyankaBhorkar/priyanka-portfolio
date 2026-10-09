"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { Briefcase, ChevronDown, Flag, MapPin, Sparkles } from "lucide-react";
import { experience } from "@/data/experience";
import type { Role } from "@/data/types";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";

/*
 * Work experience as a journey map.
 * Desktop: a dotted route runs from "Start 2019" through each job to "Next stop".
 * As the visitor scrolls, the route draws itself, a plane flies along it, and each
 * stop's card pops up when the plane reaches it. Clicking a card shows that role's
 * full details below the map.
 * Mobile: the same journey runs downwards, with a details toggle on each card.
 * Visitors who prefer reduced motion see the finished route straight away.
 */

const ease = [0.22, 1, 0.36, 1] as const;
const year = (date: string) => date.split("/")[1] ?? date;

// Map drawn in a 1000 x 700 box. Stops sit at these fractions along the route.
const W = 1000;
const H = 700;
const ROUTE = "M40 600 C 170 600, 210 360, 340 350 S 560 410, 680 380 S 880 190, 960 100";
const STOPS = [0, 0.4, 0.72, 1];

// Each job card sits above (first job) or below (second job) its pin.
const cardStyle = (pin: { x: number; y: number }, i: number): React.CSSProperties => {
  const left = `${(pin.x / W) * 100}%`;
  return i % 2 === 0
    ? { left, bottom: `${((H - pin.y + 34) / H) * 100}%`, transform: "translateX(-50%)" }
    : { left, top: `${((pin.y + 34) / H) * 100}%`, transform: "translateX(-50%)" };
};

// Oldest job first, so the journey reads forwards in time.
const journey = [...experience].reverse();

function Details({ role }: { role: Role }) {
  return (
    <div className="grid gap-8 md:grid-cols-[1fr_15rem]">
      <div>
        <p className="text-[1.03rem] leading-relaxed text-ink/85">{role.summary}</p>
        <ul className="mt-5 space-y-2.5">
          {role.contributions.map((point) => (
            <li key={point} className="flex gap-3 text-[0.97rem] text-ink/85">
              <span className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-sm font-semibold text-muted">Technologies</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {role.technologies.map((tech) => (
            <li key={tech} className="rounded-full bg-accent-soft px-3 py-1 text-sm">{tech}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StopCard({ role, active, selected, onSelect }: { role: Role; active: boolean; selected: boolean; onSelect: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      initial={false}
      animate={active ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 16, scale: 0.92 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={cn(
        "w-[19rem] rounded-2xl border bg-white p-5 text-left shadow-lift transition-[border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-panel",
        selected ? "border-accent ring-4 ring-accent/10" : "border-line",
        !active && "pointer-events-none",
      )}
    >
      <span className="inline-flex rounded-full bg-accent-soft px-3 py-1 text-xs font-bold tabular-nums text-accent">
        {year(role.start)} – {year(role.end)}
      </span>
      <span className="mt-3 block font-display text-2xl font-semibold leading-tight">{role.shortCompany}</span>
      <span className="mt-1 block text-sm text-muted">{role.title}</span>
      <span className="mt-3 block text-[0.95rem] font-semibold text-ink">{role.highlight}</span>
      <span className="mt-3 block text-sm font-semibold text-accent-deep">{selected ? "Showing details below" : "See details"}</span>
    </motion.button>
  );
}

function DesktopMap({ selected, onSelect }: { selected: number; onSelect: (i: number) => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const reduce = useReducedMotion();
  const [length, setLength] = useState(0);
  const [pins, setPins] = useState<{ x: number; y: number }[]>([]);
  const [plane, setPlane] = useState({ x: 40, y: 600, angle: 0 });
  const [progress, setProgress] = useState(reduce ? 1 : 0);

  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start 80%", "end 60%"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 22 });

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    setLength(len);
    setPins(STOPS.map((f) => { const p = path.getPointAtLength(f * len); return { x: p.x, y: p.y }; }));
  }, []);

  const place = (v: number) => {
    const path = pathRef.current;
    if (!path || !length) return;
    const p = Math.min(1, Math.max(0, v));
    const a = path.getPointAtLength(p * length);
    const b = path.getPointAtLength(Math.min(length, p * length + 1));
    const c = path.getPointAtLength(Math.max(0, p * length - 1));
    const angle = (Math.atan2(b.y - c.y, b.x - c.x) * 180) / Math.PI;
    setPlane({ x: a.x, y: a.y, angle });
    setProgress(p);
  };

  useEffect(() => { place(reduce ? 1 : smooth.get()); }, [length, reduce]); // eslint-disable-line react-hooks/exhaustive-deps
  useMotionValueEvent(smooth, "change", (v) => { if (!reduce) place(v); });

  const reached = (i: number) => progress >= STOPS[i] - 0.03;

  return (
    <div ref={wrap} className="relative mx-auto aspect-[1000/700] w-full max-w-5xl">
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        {/* Full route, faint */}
        <path d={ROUTE} fill="none" stroke="#c2185b" strokeOpacity=".16" strokeWidth="3" strokeDasharray="2 12" strokeLinecap="round" />
        {/* Travelled part, drawn as you scroll */}
        <path
          ref={pathRef}
          d={ROUTE}
          fill="none"
          stroke="#c2185b"
          strokeOpacity=".55"
          strokeWidth="3"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1 - progress}
        />
        {/* Pins */}
        {pins.map((p, i) => {
          const last = i === pins.length - 1;
          return (
            <g key={i} transform={`translate(${p.x} ${p.y})`}>
              <circle r="17" fill={last ? "#6d4fc4" : "#c2185b"} fillOpacity={reached(i) ? 0.16 : 0.06} />
              <circle r="8" fill={reached(i) ? (last ? "#6d4fc4" : "#c2185b") : "#fff"} stroke={last ? "#6d4fc4" : "#c2185b"} strokeWidth="3" />
            </g>
          );
        })}
        {/* Plane */}
        <g transform={`translate(${plane.x} ${plane.y}) rotate(${plane.angle})`}>
          <path d="M-16 -10 L18 0 L-16 10 L-9 0 Z" fill="#c2185b" />
        </g>
      </svg>

      {/* Start and finish labels */}
      {pins.length > 0 && (
        <>
          <p className="absolute flex items-center gap-1.5 font-display text-lg font-semibold" style={{ left: `${(pins[0].x / W) * 100}%`, top: `${(pins[0].y / H) * 100 + 4}%`, transform: "translateX(-20%)" }}>
            <Flag className="size-4 text-accent" aria-hidden="true" /> Start {year(journey[0].start)}
          </p>
          <motion.div
            className="absolute w-52 text-right"
            style={{ right: `${100 - (pins[3].x / W) * 100 - 2}%`, top: `${(pins[3].y / H) * 100 - 12}%` }}
            initial={false}
            animate={{ opacity: reached(3) ? 1 : 0.35 }}
          >
            <p className="flex items-center justify-end gap-1.5 font-display text-lg font-semibold text-lilac">
              <Sparkles className="size-4" aria-hidden="true" /> Next stop
            </p>
            <p className="text-sm text-muted">A Werkstudent role in Germany</p>
          </motion.div>
        </>
      )}

      {/* Job cards */}
      {pins.length > 0 && journey.map((role, i) => (
        <div key={role.id} className="absolute" style={cardStyle(pins[i + 1], i)}>
          <StopCard role={role} active={reached(i + 1)} selected={selected === i} onSelect={() => onSelect(i)} />
        </div>
      ))}
    </div>
  );
}

function MobileJourney() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <ol className="relative space-y-6 pl-10">
      <span className="absolute bottom-6 left-[0.9rem] top-2 border-l-[3px] border-dotted border-accent/40" aria-hidden="true" />
      <li className="relative flex items-center gap-2 font-display text-lg font-semibold">
        <span className="absolute -left-10 grid size-8 place-items-center rounded-full bg-accent text-white"><Flag className="size-4" aria-hidden="true" /></span>
        Start {year(journey[0].start)}
      </li>
      {journey.map((role, i) => (
        <motion.li
          key={role.id}
          className="relative"
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={{ duration: 0.6, ease }}
        >
          <span className="absolute -left-10 top-6 grid size-8 place-items-center rounded-full border-[3px] border-accent bg-white">
            <MapPin className="size-3.5 text-accent" aria-hidden="true" />
          </span>
          <div className="rounded-2xl border border-line bg-white p-5 shadow-lift">
            <span className="inline-flex rounded-full bg-accent-soft px-3 py-1 text-xs font-bold tabular-nums text-accent">
              {year(role.start)} – {year(role.end)}
            </span>
            <h3 className="mt-3 font-display text-2xl font-semibold leading-tight">{role.shortCompany}</h3>
            <p className="mt-1 text-sm text-muted">{role.title}</p>
            <p className="mt-3 font-semibold">{role.highlight}</p>
            <button
              type="button"
              aria-expanded={open === i}
              onClick={() => setOpen(open === i ? null : i)}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-deep"
            >
              {open === i ? "Hide details" : "See details"}
              <ChevronDown className={cn("size-4 transition-transform", open === i && "rotate-180")} aria-hidden="true" />
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 border-t border-line pt-4"><Details role={role} /></div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.li>
      ))}
      <li className="relative">
        <span className="absolute -left-10 grid size-8 place-items-center rounded-full bg-lilac text-white"><Sparkles className="size-4" aria-hidden="true" /></span>
        <p className="font-display text-lg font-semibold text-lilac">Next stop</p>
        <p className="text-sm text-muted">A Werkstudent role in Germany</p>
      </li>
    </ol>
  );
}

export function Experience() {
  const [selected, setSelected] = useState(journey.length - 1);
  const role = journey[selected];

  return (
    <Section id="experience" icon={Briefcase} title="Work experience" lead="My journey so far. Scroll to fly the route, and click a stop to see the details.">
      <div className="hidden md:block">
        <DesktopMap selected={selected} onSelect={setSelected} />

        <div className="mx-auto mt-10 max-w-5xl rounded-3xl border border-line bg-white/90 p-8 shadow-lift backdrop-blur-sm">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease }}
            >
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-line pb-5">
                <div>
                  <p className="text-sm font-semibold text-accent">{role.company}</p>
                  <h3 className="mt-1 font-display text-3xl font-semibold leading-tight">{role.title}</h3>
                </div>
                <p className="flex items-center gap-3 text-sm text-muted">
                  <span className="tabular-nums">{role.start} – {role.end}</span>
                  {role.location && <span className="inline-flex items-center gap-1"><MapPin className="size-4 text-accent" aria-hidden="true" />{role.location}</span>}
                </p>
              </div>
              <Details role={role} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="md:hidden">
        <MobileJourney />
      </div>
    </Section>
  );
}
