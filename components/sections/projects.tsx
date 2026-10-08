"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, FolderHeart, X } from "lucide-react";
import { projectFilters, projects } from "@/data/projects";
import type { Project } from "@/data/types";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
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

  const { detail } = project;
  const blocks = [
    { label: "Context", text: detail.context },
    { label: "Challenge", text: detail.challenge },
    { label: "My role", text: detail.role },
    { label: "Approach", text: detail.approach },
  ];

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
        className="relative max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-white shadow-panel outline-none sm:rounded-3xl"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line bg-white/95 px-6 py-5 backdrop-blur sm:px-9">
          <div>
            <p className="text-sm text-muted">{project.organization}, {project.role}</p>
            <h3 id="project-dialog-title" className="mt-1 font-display text-2xl leading-tight tracking-[-0.01em] sm:text-3xl">
              {project.name}
            </h3>
          </div>
          <button type="button" onClick={onClose} aria-label="Close project details" className="grid size-10 shrink-0 place-items-center rounded-full border border-line hover:border-ink">
            <X className="size-4" />
          </button>
        </div>

        <div className="px-6 pb-8 pt-6 sm:px-9">
          <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {blocks.map((block) => (
              <div key={block.label}>
                <dt className="text-sm font-semibold text-accent-deep">{block.label}</dt>
                <dd className="mt-1.5 text-[0.97rem] text-ink/90">{block.text}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-7 border-t border-line pt-6">
            <h4 className="text-sm font-semibold text-accent-deep">Technical work</h4>
            <ul className="mt-3 space-y-2.5 text-[0.97rem] text-ink/90">
              {detail.technical.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-[0.7em] size-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-7 rounded-2xl bg-accent-soft p-5">
            <h4 className="text-sm font-semibold text-accent-deep">Result</h4>
            <p className="mt-1.5 font-medium">{detail.result}</p>
          </div>

          <div className="mt-7">
            <h4 className="text-sm font-semibold text-accent-deep">Technologies</h4>
            <ul className="mt-3 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <li key={tech}><Chip>{tech}</Chip></li>
              ))}
            </ul>
          </div>

          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-[0.95rem] font-medium text-white transition-colors hover:bg-accent-deep"
            >
              <GitHubIcon className="size-4" />
              View the code on GitHub
              <ExternalLink className="size-3.5" aria-hidden="true" />
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Projects() {
  const [filter, setFilter] = useState<(typeof projectFilters)[number]["id"]>("all");
  const [selected, setSelected] = useState<Project | null>(null);
  const visible = projects.filter((p) => filter === "all" || p.category === filter);

  return (
    <Section
      id="projects"
      tone="veil"
      icon={FolderHeart}
      title="Featured projects"
      lead="Two assignments from consulting and two platforms I built myself. Open any of them for the full story."
    >
      <Reveal>
        <ul className="mt-8 grid gap-6 md:grid-cols-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((project, i) => {
              const Icon = dataIcons[project.icon];
              return (
              <motion.li
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3, ease }}
              >
                <button
                  type="button"
                  onClick={() => setSelected(project)}
                  aria-haspopup="dialog"
                  className="group flex h-full w-full flex-col overflow-hidden rounded-3xl border border-line bg-white text-left transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lift"
                >
                  <span className={cn("grid h-44 place-items-center bg-gradient-to-br sm:h-52", tiles[i % tiles.length])}>
                    <span className="grid size-20 place-items-center rounded-3xl bg-white/80 shadow-lift transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                      {Icon && <Icon className="size-9" aria-hidden="true" />}
                    </span>
                  </span>
                  <span className="flex flex-1 flex-col p-6 sm:p-7">
                    <span className="text-sm font-semibold text-accent">{project.organization}</span>
                    <span className="mt-1.5 block font-display text-2xl font-semibold leading-tight tracking-[-0.01em]">{project.name}</span>
                    <span className="mt-2.5 block text-[0.99rem] text-muted">{project.tagline}</span>
                    <span className="mt-5 flex flex-wrap gap-2">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <Chip key={tech} className="border-transparent bg-accent-soft text-sm">{tech}</Chip>
                      ))}
                    </span>
                    <span className="mt-auto block pt-6 text-[0.95rem] font-semibold text-accent-deep underline-offset-4 group-hover:underline">
                      Read the full story
                    </span>
                  </span>
                </button>
              </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      </Reveal>

      <AnimatePresence>
        {selected && <ProjectDialog project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </Section>
  );
}
