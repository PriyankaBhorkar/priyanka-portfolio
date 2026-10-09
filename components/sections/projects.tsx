"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, FolderHeart, X } from "lucide-react";
import { projects } from "@/data/projects";
import type { Project } from "@/data/types";
import { Section } from "@/components/ui/section";
import { Chip } from "@/components/ui/chip";
import { dataIcons, GitHubIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

const tiles = [
  "from-accent-soft to-lilac-soft text-accent",
  "from-lilac-soft to-peach-soft text-lilac",
  "from-peach-soft to-accent-soft text-peach",
  "from-lilac-soft to-accent-soft text-accent",
];

function ProjectDialog({ project, onClose }: { project: Project; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !dialogRef.current) return;
      // Keep keyboard focus inside the dialog.
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previous?.focus();
    };
  }, [onClose]);

  // "Discuss project" closes the dialog first, then scrolls to the contact form.
  const discuss = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 350);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-[2px] sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-dialog-title"
        tabIndex={-1}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.35, ease }}
        className="relative max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-6 shadow-panel outline-none sm:rounded-3xl sm:p-9"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close project details"
          className="absolute right-5 top-5 grid size-10 place-items-center rounded-full border-2 border-accent/40 text-accent transition-colors hover:bg-accent hover:text-white"
        >
          <X className="size-4" />
        </button>

        <h3 id="project-dialog-title" className="pr-12 font-display text-[1.7rem] font-semibold leading-tight tracking-[-0.01em] sm:text-3xl">
          {project.name}
        </h3>
        <p className="mt-4 text-[1.03rem] leading-relaxed text-muted">{project.description}</p>

        <h4 className="mt-7 font-semibold">Technologies used</h4>
        <ul className="mt-3 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <li key={tech}><Chip className="border-transparent bg-accent-soft">{tech}</Chip></li>
          ))}
        </ul>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 font-medium text-white transition-colors hover:bg-accent-deep"
            >
              <GitHubIcon className="size-4" />
              View on GitHub
            </a>
          )}
          <a
            href="#contact"
            onClick={discuss}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-5 py-3 font-medium text-ink transition-colors hover:border-accent hover:text-accent-deep"
          >
            <ExternalLink className="size-4" aria-hidden="true" />
            Discuss project
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

const tilts = [-2.5, 2, -1.5, 3];
const tapes = ["bg-peach-soft/90", "bg-lilac-soft/90", "bg-accent-soft/90", "bg-peach-soft/90"];

export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <Section
      id="projects"
      icon={FolderHeart}
      title="Featured projects"
      lead="Two platforms I built myself, from raw data to a working dashboard. Open either one for the full story."
    >
      <ul className="mx-auto grid max-w-4xl gap-12 md:grid-cols-2 md:gap-14">
        {projects.map((project, i) => {
          const Icon = dataIcons[project.icon];
          return (
            <motion.li
              key={project.id}
              initial={{ opacity: 0, y: 30, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: tilts[i % tilts.length] }}
              whileHover={{ rotate: 0, y: -6 }}
              viewport={{ once: true, margin: "0px 0px -80px 0px" }}
              transition={{ type: "spring", stiffness: 160, damping: 16, delay: i * 0.08 }}
              className="relative"
            >
              {/* Tape holding the photo */}
              <span className={cn("absolute -top-3 left-1/2 z-10 h-8 w-32 -translate-x-1/2 -rotate-3 rounded-sm shadow-sm", tapes[i % tapes.length])} aria-hidden="true" />
              <button
                type="button"
                onClick={() => setSelected(project)}
                aria-haspopup="dialog"
                className="group block w-full bg-white p-4 pb-6 text-left shadow-panel sm:p-5 sm:pb-7"
              >
                <span className={cn("grid aspect-[4/3] place-items-center bg-gradient-to-br", tiles[i % tiles.length])}>
                  <span className="grid size-24 place-items-center rounded-[2rem] bg-white/85 shadow-lift transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                    {Icon && <Icon className="size-11" aria-hidden="true" />}
                  </span>
                </span>
                <span className="mt-4 block font-hand text-[2rem] leading-tight text-ink">{project.name}</span>
                <span className="mt-1 block text-[0.97rem] text-muted">{project.tagline}</span>
                <span className="mt-4 flex flex-wrap gap-1.5">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <Chip key={tech} className="border-transparent bg-accent-soft px-2.5 py-0.5 text-[0.8rem]">{tech}</Chip>
                  ))}
                </span>
                <span className="mt-5 block text-[0.95rem] font-semibold text-accent-deep underline-offset-4 group-hover:underline">
                  Read the full story
                </span>
              </button>
            </motion.li>
          );
        })}
      </ul>

      <AnimatePresence>
        {selected && <ProjectDialog project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </Section>
  );
}
