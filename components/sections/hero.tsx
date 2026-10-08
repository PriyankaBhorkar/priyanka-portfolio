"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, Download, MessageCircle, Plane } from "lucide-react";
import { boardingPass, person, personal, travel } from "@/data/profile";
import { Flag } from "@/components/ui/flag";
import { buttonClass } from "@/components/ui/button";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";
import { useChat } from "@/components/chat/chat-provider";

const ease = [0.22, 1, 0.36, 1] as const;
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease, delay },
});

/** Types each statement out, pauses, deletes it, and moves to the next. */
function Typewriter({ lines }: { lines: string[] }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(reduce ? lines[0].length : 0);
  const [deleting, setDeleting] = useState(false);
  const line = lines[index];

  useEffect(() => {
    if (reduce) {
      // No typing effect: just swap the full statement every few seconds.
      const t = setTimeout(() => setIndex((i) => (i + 1) % lines.length), 3500);
      return () => clearTimeout(t);
    }
    let delay = deleting ? 28 : 60;
    if (!deleting && length === line.length) delay = 1900;
    if (deleting && length === 0) delay = 350;

    const t = setTimeout(() => {
      if (!deleting && length === line.length) setDeleting(true);
      else if (deleting && length === 0) {
        setDeleting(false);
        setIndex((i) => (i + 1) % lines.length);
      } else setLength((n) => n + (deleting ? -1 : 1));
    }, delay);
    return () => clearTimeout(t);
  }, [reduce, deleting, length, line, lines.length]);

  return (
    <>
      <span className="sr-only">{lines.join(" ")}</span>
      <span aria-hidden="true">
        {reduce ? line : line.slice(0, length)}
        {!reduce && <span className="caret" />}
      </span>
    </>
  );
}

/** Her career move, drawn as a boarding pass: from enterprise data to the web. */
function BoardingPass() {
  const { from, to, fields, luggage } = boardingPass;
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-panel">
      <div className="flex items-center justify-between bg-gradient-to-r from-accent to-lilac px-6 py-3.5 text-white">
        <span className="font-display text-lg font-semibold">Boarding pass</span>
        <span className="flex items-center gap-2 text-sm font-medium">
          <Plane className="size-4" aria-hidden="true" />
          Career class
        </span>
      </div>

      <div className="px-6 pb-5 pt-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-display text-5xl font-semibold tracking-[-0.02em]">{from.code}</p>
            <p className="mt-1 text-sm text-muted">{from.label}</p>
          </div>
          <div className="flex flex-1 items-center gap-2 text-accent" aria-hidden="true">
            <span className="h-px flex-1 border-t-2 border-dashed border-accent/40" />
            <Plane className="size-6 rotate-45" />
            <span className="h-px flex-1 border-t-2 border-dashed border-accent/40" />
          </div>
          <div className="text-right">
            <p className="font-display text-5xl font-semibold tracking-[-0.02em] text-accent">{to.code}</p>
            <p className="mt-1 text-sm text-muted">{to.label}</p>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4">
          {fields.map((field) => (
            <div key={field.label}>
              <dt className="text-xs text-muted">{field.label}</dt>
              <dd className="font-semibold leading-snug">{field.value}</dd>
            </div>
          ))}
        </dl>

        {/* Countries she has travelled to */}
        <div className="mt-5 border-t border-line pt-4">
          <p className="text-xs text-muted">{travel.label}</p>
          <ul className="mt-2 flex flex-wrap gap-1.5 sm:gap-2">
            {travel.countries.map((country) => (
              <li key={country.code} className="transition-transform duration-200 hover:-translate-y-1 hover:scale-110">
                <Flag code={country.code} name={country.name} className="h-[19px] w-[28.5px] drop-shadow-sm sm:h-[22px] sm:w-[33px]" />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tear-off stub */}
      <div className="relative border-t-2 border-dashed border-line bg-surface px-6 py-4">
        <span className="absolute -left-3 -top-3 size-6 rounded-full border border-line bg-[#fffafc]" aria-hidden="true" />
        <span className="absolute -right-3 -top-3 size-6 rounded-full border border-line bg-[#fffafc]" aria-hidden="true" />
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs text-muted">Carry-on</p>
            <p className="text-sm font-semibold">{luggage}</p>
          </div>
          <div className="flex h-9 items-stretch gap-[3px]" aria-hidden="true">
            {[3, 1, 2, 1, 3, 2, 1, 1, 3, 1, 2, 3, 1, 2, 1, 3].map((w, i) => (
              <span key={i} className="bg-ink/80" style={{ width: w }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const { openChat } = useChat();
  const reduce = useReducedMotion();

  return (
    <section id="home" className="relative overflow-hidden">
      {/* A paper plane crossing the hero on a dotted flight path. */}
      <svg className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-52 w-full md:block" viewBox="0 0 1440 208" preserveAspectRatio="none" fill="none" aria-hidden="true">
        <path id="flight-path" d="M-40 150 C 280 200, 520 40, 800 110 S 1220 180, 1480 30" stroke="#c2185b" strokeOpacity="0.28" strokeWidth="1.5" strokeDasharray="2 9" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        {!reduce && (
          <g fill="#c2185b" fillOpacity="0.75">
            <path d="M-13 -9 L15 0 L-13 9 L-7 0 Z" />
            <animateMotion dur="22s" repeatCount="indefinite" rotate="auto">
              <mpath href="#flight-path" />
            </animateMotion>
          </g>
        )}
      </svg>

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:pb-28">
        <div>
          <motion.p {...rise(0)} className="font-display text-2xl italic text-accent sm:text-3xl">
            {personal.greeting}
          </motion.p>

          <motion.h1
            {...rise(0.06)}
            className="mt-2 font-display text-[clamp(2.9rem,7.6vw,5.4rem)] font-semibold leading-[0.98] tracking-[-0.03em]"
          >
            Priyanka Nitin Bhorkar
          </motion.h1>

          <motion.p {...rise(0.14)} className="mt-7 min-h-[2.6em] font-display text-[1.7rem] leading-tight tracking-[-0.01em] sm:min-h-[1.4em] sm:text-4xl">
            <Typewriter lines={personal.statements} />
          </motion.p>

          <motion.p {...rise(0.2)} className="mt-5 max-w-xl text-[1.08rem] text-muted">
            {person.headline}, based in {person.location}. I like new places, good company and data that finally adds up.
          </motion.p>

          <motion.div {...rise(0.28)} className="mt-9 flex flex-wrap gap-3">
            <a href="#about" className={buttonClass("primary")}>Get to know me</a>
            <a href="#projects" className={buttonClass("outline")}>Explore my work</a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24, rotate: 0 }}
          animate={{ opacity: 1, y: 0, rotate: 2 }}
          transition={{ duration: 0.9, ease, delay: 0.2 }}
          className="mx-auto w-full max-w-[26rem]"
        >
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
            <BoardingPass />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
