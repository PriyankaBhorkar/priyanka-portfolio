import { Award, BadgeCheck, BookOpen, GraduationCap, Languages } from "lucide-react";
import { education } from "@/data/education";
import { certifications } from "@/data/certifications";
import { awards, languages } from "@/data/profile";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Bullets, Timeline, TimelineItem } from "@/components/ui/timeline";

export function Education() {
  return (
    <Section id="education" tone="veil" icon={GraduationCap} title="Education" lead="Academic background, certifications and languages.">
      <Timeline>
        {education.map((item) => (
          <Reveal key={item.degree}>
            <TimelineItem
              icon={GraduationCap}
              title={item.degree}
              organization={item.school}
              period={item.period}
              location={item.location || undefined}
            >
              <div className="mt-6 border-t border-line pt-5">
                <p className="flex items-center gap-2 text-sm font-semibold text-muted">
                  <BookOpen className="size-4 text-accent" aria-hidden="true" />
                  Coursework
                </p>
                <div className="-mt-2"><Bullets items={item.courses} /></div>
              </div>
            </TimelineItem>
          </Reveal>
        ))}
      </Timeline>

      <Reveal delay={0.05}>
        <div className="mx-auto mt-10 grid max-w-5xl gap-6 pl-9 sm:pl-12 lg:grid-cols-[1.35fr_1fr] lg:items-start">
          <section id="certifications" aria-labelledby="certifications-title" className="rounded-3xl border border-line bg-white p-6 shadow-lift sm:p-8">
            <h3 id="certifications-title" className="flex items-center gap-3 font-display text-2xl font-semibold tracking-[-0.01em]">
              <span className="grid size-10 place-items-center rounded-xl bg-lilac-soft text-lilac"><BadgeCheck className="size-5" aria-hidden="true" /></span>
              Certifications
            </h3>
            <ul className="mt-4 grid gap-x-8 sm:grid-cols-2">
              {certifications.map((cert) => (
                <li key={cert.name} className="border-b border-line py-3.5 last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0">
                  <p className="font-semibold leading-snug">{cert.name}</p>
                  <p className="mt-0.5 text-sm text-muted">{cert.issuer}</p>
                </li>
              ))}
            </ul>
          </section>

          <div className="space-y-6">
            <div className="rounded-3xl border border-line bg-white p-6 shadow-lift sm:p-8">
              <h3 className="flex items-center gap-3 font-display text-2xl font-semibold tracking-[-0.01em]">
                <span className="grid size-10 place-items-center rounded-xl bg-peach-soft text-peach"><Languages className="size-5" aria-hidden="true" /></span>
                Languages
              </h3>
              <ul className="mt-4">
                {languages.map((language) => (
                  <li key={language.name} className="flex items-center justify-between border-b border-line py-3 last:border-b-0">
                    <span className="font-semibold">{language.name}</span>
                    <span className="rounded-full bg-surface px-3 py-0.5 text-sm tabular-nums text-muted">{language.level}</span>
                  </li>
                ))}
              </ul>
            </div>

            {awards.map((award) => (
              <div key={award.name} className="flex gap-4 rounded-3xl border border-line bg-white p-6 shadow-lift">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                  <Award className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-semibold">{award.name}</h3>
                  <p className="text-[0.95rem] text-muted">{award.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
