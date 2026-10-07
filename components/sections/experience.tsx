import { Briefcase } from "lucide-react";
import { experience } from "@/data/experience";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Chip } from "@/components/ui/chip";
import { Bullets, Timeline, TimelineItem } from "@/components/ui/timeline";

export function Experience() {
  return (
    <Section
      id="experience"
      icon={Briefcase}
      title="Work experience"
      lead="Over four years on implementation, migration and support projects in SAP HANA and SAP BI/BW."
    >
      <Timeline>
        {experience.map((role) => (
          <Reveal key={role.id}>
            <TimelineItem
              icon={Briefcase}
              title={role.title}
              organization={role.company}
              period={`${role.start} – ${role.end}`}
              location={role.location || undefined}
            >
              <Bullets first={role.highlight} items={role.contributions} />
              <div className="mt-6 border-t border-line pt-5">
                <p className="text-sm font-semibold text-muted">Technologies and tools</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {role.technologies.map((tech) => (
                    <li key={tech}><Chip className="border-transparent bg-accent-soft">{tech}</Chip></li>
                  ))}
                </ul>
              </div>
            </TimelineItem>
          </Reveal>
        ))}
      </Timeline>
    </Section>
  );
}
