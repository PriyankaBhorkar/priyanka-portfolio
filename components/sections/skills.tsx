import { Sparkles } from "lucide-react";
import { skillCards, skills } from "@/data/skills";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Chip } from "@/components/ui/chip";
import { dataIcons, tileTones } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export function Skills() {
  return (
    <Section id="skills" icon={Sparkles} title="Skills and technologies" lead="The tools I know best, and what I have used each one for.">
      <Reveal>
        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {skillCards.map((skill, i) => {
            const Icon = dataIcons[skill.icon];
            return (
              <li
                key={skill.name}
                className="group flex flex-col items-center rounded-3xl border border-line bg-white px-4 py-7 text-center transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lift"
              >
                <span className={cn("grid size-16 place-items-center rounded-2xl transition-transform duration-300 group-hover:scale-110", tileTones[i % tileTones.length])}>
                  {Icon && <Icon className="size-7" aria-hidden="true" />}
                </span>
                <h3 className="mt-4 font-semibold leading-snug">{skill.name}</h3>
                <p className="mt-1.5 text-sm leading-snug text-muted">{skill.text}</p>
              </li>
            );
          })}
        </ul>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mt-12 rounded-3xl border border-line bg-white/80 p-6 sm:p-9">
          <h3 className="font-display text-2xl font-semibold tracking-[-0.01em]">The full toolkit</h3>
          <div className="mt-4 divide-y divide-line">
            {skills.map((group) => (
              <div key={group.category} className="grid gap-3 py-5 md:grid-cols-[13rem_1fr] md:gap-8">
                <h4 className="font-semibold text-accent">{group.category}</h4>
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li key={item}><Chip>{item}</Chip></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
