import {
  Camera, ChartColumn, CodeXml, Compass, Database, Earth, Laptop, Luggage, MapPin, Plane, TicketsPlane, type LucideIcon,
} from "lucide-react";

/**
 * Site-wide animated background: three soft pastel lights (rose, lilac, peach)
 * drifting slowly, small sparkles that twinkle, and little travel and work
 * objects floating at the edges. Pure CSS (see globals.css), fixed behind all
 * content, still when reduced motion is requested.
 */

const colors = { rose: "#ec6aa5", lilac: "#a78bfa", gold: "#f5b454" } as const;

// Position in % of the viewport, size in px, delay in seconds.
const sparkles: { x: number; y: number; size: number; color: keyof typeof colors; delay: number }[] = [
  { x: 6, y: 14, size: 14, color: "rose", delay: 0 },
  { x: 18, y: 62, size: 10, color: "lilac", delay: 1.4 },
  { x: 27, y: 28, size: 8, color: "gold", delay: 2.6 },
  { x: 38, y: 82, size: 12, color: "rose", delay: 0.8 },
  { x: 47, y: 9, size: 10, color: "lilac", delay: 3.2 },
  { x: 55, y: 55, size: 7, color: "gold", delay: 1.9 },
  { x: 64, y: 22, size: 13, color: "rose", delay: 2.2 },
  { x: 72, y: 74, size: 9, color: "lilac", delay: 0.4 },
  { x: 81, y: 40, size: 11, color: "gold", delay: 3.6 },
  { x: 90, y: 12, size: 9, color: "rose", delay: 1.1 },
  { x: 94, y: 66, size: 14, color: "lilac", delay: 2.9 },
  { x: 11, y: 88, size: 9, color: "gold", delay: 4.1 },
];

// Travel and work objects. Position in % of the viewport, size in px, tilt in degrees.
// "wide" objects sit further in and only show on very wide screens, where the margins have room.
const objects: { icon: LucideIcon; x: number; y: number; size: number; tilt: number; color: keyof typeof colors; wide?: boolean }[] = [
  { icon: Plane, x: 3, y: 22, size: 30, tilt: -18, color: "rose" },
  { icon: Database, x: 92, y: 18, size: 26, tilt: 8, color: "lilac" },
  { icon: Compass, x: 95, y: 52, size: 30, tilt: 14, color: "gold" },
  { icon: CodeXml, x: 2.5, y: 56, size: 28, tilt: -8, color: "lilac" },
  { icon: Luggage, x: 4, y: 84, size: 28, tilt: 10, color: "gold" },
  { icon: ChartColumn, x: 93, y: 84, size: 26, tilt: -10, color: "rose" },
  { icon: Earth, x: 7.5, y: 38, size: 24, tilt: 0, color: "gold", wide: true },
  { icon: Laptop, x: 88.5, y: 35, size: 26, tilt: -6, color: "rose", wide: true },
  { icon: MapPin, x: 8, y: 70, size: 24, tilt: 12, color: "rose", wide: true },
  { icon: Camera, x: 89, y: 68, size: 24, tilt: 9, color: "lilac", wide: true },
  { icon: TicketsPlane, x: 7, y: 9, size: 26, tilt: -12, color: "lilac", wide: true },
];

export function AnimatedBackground() {
  return (
    <div className="site-bg" aria-hidden="true">
      <span className="site-bg__light site-bg__light--rose" />
      <span className="site-bg__light site-bg__light--lilac" />
      <span className="site-bg__light site-bg__light--peach" />
      {sparkles.map((s, i) => (
        <svg
          key={i}
          className="site-bg__sparkle"
          viewBox="0 0 24 24"
          width={s.size}
          height={s.size}
          style={{ left: `${s.x}%`, top: `${s.y}%`, animationDelay: `${s.delay}s`, animationDuration: `${4.5 + (i % 4)}s` }}
        >
          <path d="M12 0C12.8 8 16 11.2 24 12C16 12.8 12.8 16 12 24C11.2 16 8 12.8 0 12C8 11.2 11.2 8 12 0Z" fill={colors[s.color]} />
        </svg>
      ))}
      {objects.map(({ icon: Icon, ...o }, i) => (
        <span
          key={i}
          className={o.wide ? "site-bg__object hidden 2xl:block" : "site-bg__object"}
          style={{ left: `${o.x}%`, top: `${o.y}%`, color: colors[o.color], animationDelay: `${-i * 1.3}s`, animationDuration: `${9 + (i % 5)}s` }}
        >
          <Icon width={o.size} height={o.size} strokeWidth={1.5} style={{ transform: `rotate(${o.tilt}deg)` }} />
        </span>
      ))}
    </div>
  );
}
