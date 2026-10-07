import Image from "next/image";
import { Award, UserRound } from "lucide-react";
import { aboutHighlight, aboutRich, person, stats } from "@/data/profile";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Counter } from "@/components/ui/counter";

const marks: Record<string, string> = {
  tech: "font-semibold text-accent",
  metric: "font-semibold text-lilac",
  em: "italic text-ink",
};

export function About() {
  return (
    <Section id="about" tone="veil" icon={UserRound} title="About me">
      <div className="grid items-center gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
        <Reveal className="relative mx-auto w-full max-w-sm lg:max-w-none">
          <span className="absolute -bottom-4 -right-4 h-full w-full rounded-[2rem] bg-gradient-to-br from-accent/25 to-lilac/25" aria-hidden="true" />
          <Image
            src={person.photo}
            alt="Portrait of Priyanka Nitin Bhorkar"
            width={377}
            height={377}
            sizes="(min-width: 1024px) 440px, 384px"
            className="relative aspect-square w-full rounded-[2rem] border border-line object-cover shadow-lift"
          />
        </Reveal>

        <Reveal delay={0.08}>
          <div className="space-y-6 text-[1.1rem] leading-[1.8] text-ink/85">
            {aboutRich.map((paragraph, i) => (
              <p key={i}>
                {paragraph.map((segment, j) =>
                  segment.mark ? (
                    <span key={j} className={marks[segment.mark]}>{segment.text}</span>
                  ) : (
                    <span key={j}>{segment.text}</span>
                  ),
                )}
              </p>
            ))}
          </div>
          <p className="mt-7 flex items-center gap-3 font-semibold text-accent">
            <Award className="size-5 shrink-0" aria-hidden="true" />
            {aboutHighlight}
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
