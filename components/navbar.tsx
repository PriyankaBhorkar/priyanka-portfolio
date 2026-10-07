"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, MessageCircle, X } from "lucide-react";
import { navItems } from "@/data/navigation";
import { person } from "@/data/profile";
import { cn } from "@/lib/utils";
import { useChat } from "./chat/chat-provider";

export function Navbar() {
  const { openChat } = useChat();
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Highlight the section currently crossing the middle of the viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const id of ["home", ...navItems.map((n) => n.id)]) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const current = active;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-white/80 backdrop-blur-md transition-[border-color,box-shadow] duration-300",
        scrolled || menuOpen ? "border-line" : "border-transparent",
      )}
    >
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href="#home" className="font-display text-xl font-semibold tracking-[-0.01em]" onClick={() => setMenuOpen(false)}>
          Priyanka Bhorkar
        </a>

        <ul className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={current === item.id ? "true" : undefined}
                className={cn(
                  "relative rounded-full px-3 py-2 text-[0.93rem] transition-colors",
                  current === item.id ? "text-ink" : "text-muted hover:text-ink",
                )}
              >
                {item.label}
                {current === item.id && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  />
                )}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full border border-line lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line bg-white lg:hidden"
          >
            <ul className="mx-auto flex h-[calc(100dvh-4rem)] max-w-6xl flex-col overflow-y-auto px-5 pb-8 pt-4 sm:px-8">
              {navItems.map((item) => (
                <li key={item.id} className="border-b border-line">
                  <a
                    href={`#${item.id}`}
                    onClick={() => setMenuOpen(false)}
                    className={cn("flex items-center justify-between py-4 font-display text-2xl", current === item.id && "text-accent")}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li className="mt-6 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => { setMenuOpen(false); openChat(); }}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 font-medium text-white"
                >
                  <MessageCircle className="size-4" />
                  Ask Priyanka
                </button>
                <a href={person.cv} download className="inline-flex items-center justify-center rounded-full border border-line px-5 py-3 font-medium">
                  Download CV
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
