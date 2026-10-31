export type SpaceSummary = { id: string; name: string; updatedAt: string; nodeCount: number };
export type StudioProject = { id: string; name: string; createdAt: string; spaces: SpaceSummary[] };

export const PROJECTS_KEY = "bas-spaces-projects-v1";

export function starterProjects(): StudioProject[] {
  const now = new Date().toISOString();
  return [{ id: crypto.randomUUID(), name: "My first production", createdAt: now, spaces: [{ id: crypto.randomUUID(), name: "Main studio", updatedAt: now, nodeCount: 0 }] }];
}
