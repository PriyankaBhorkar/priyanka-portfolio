export interface Stat { value: number; prefix: string; suffix: string; label: string }
export interface ExpertiseArea { icon: string; title: string; text: string }
export interface Role {
  id: string; company: string; shortCompany: string; title: string; location: string;
  start: string; end: string; summary: string; highlight: string;
  contributions: string[]; technologies: string[];
}
export type ProjectCategory = "enterprise" | "web";
export interface Project {
  id: string; name: string; organization: string; category: ProjectCategory; role: string;
    tagline: string; description: string; technologies: string[]; link: string; icon: string; image?: string;
  detail: { context: string; challenge: string; role: string; approach: string; technical: string[]; result: string };
}
export interface SkillGroup { category: string; items: string[]; notes: { name: string; text: string }[] }
export interface JourneyStep {
  id: string; kind: "education" | "work" | "next"; period: string; year: string;
  title: string; place: string; text: string; section: string;
}
export interface Degree { degree: string; school: string; location: string; period: string; courses: string[] }
export interface Certification { name: string; issuer: string }
export type Mark = "tech" | "metric" | "em";
export interface Segment { text: string; mark?: string }
export interface SkillCard { icon: string; name: string; text: string }
