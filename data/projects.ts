import data from "./profile.json";
import type { Project, ProjectCategory } from "./types";

export const projects = data.projects as Project[];

export const projectFilters: { id: "all" | ProjectCategory; label: string }[] = [
  { id: "all", label: "All work" },
  { id: "enterprise", label: "Enterprise SAP" },
  { id: "web", label: "Web and data" },
];
