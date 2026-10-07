import { navItems } from "@/data/navigation";
import { person } from "@/data/profile";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";

export function Footer() {
  return (
    <footer className="border-t border-line bg-white/70">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-display text-2xl tracking-[-0.01em]">{person.name}</p>
            <p className="mt-1 text-[0.95rem] text-muted">{person.title}</p>
          </div>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[0.95rem] text-muted">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="transition-colors hover:text-ink">{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-10 flex flex-col-reverse gap-4 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {person.name}</p>
          <ul className="flex gap-5">
            <li>
              <a href={person.links.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-ink">
                <LinkedInIcon className="size-4" /> LinkedIn
              </a>
            </li>
            <li>
              <a href={person.links.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-ink">
                <GitHubIcon className="size-4" /> GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
