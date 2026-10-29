"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Boxes, Copy, FolderPlus, Grid2X2, Heart, LayoutGrid, ListFilter, MoreHorizontal, Plus, Search, Sparkles, Trash2, Users, Workflow } from "lucide-react";
import type { SpacesUser } from "../../lib/spaces-auth";
import StudioNav from "../_components/StudioNav";
import { PROJECTS_KEY, starterProjects, type StudioProject } from "./types";

export default function SpacesDashboard({ user, accessConfigured }: { user: SpacesUser | null; accessConfigured: boolean }) {
  const [projects, setProjects] = useState<StudioProject[]>([]);
  const [query, setQuery] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(PROJECTS_KEY);
    queueMicrotask(() => {
      setProjects(stored ? JSON.parse(stored) : starterProjects());
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  }, [projects, ready]);

  const visible = useMemo(() => projects.filter((project) => project.name.toLowerCase().includes(query.toLowerCase())), [projects, query]);
  const createProject = () => {
    const name = window.prompt("Project name", "Untitled project")?.trim();
    if (!name) return;
    const now = new Date().toISOString();
    setProjects((items) => [{ id: crypto.randomUUID(), name, createdAt: now, spaces: [] }, ...items]);
  };
  const addSpace = (projectId: string) => {
    const name = window.prompt("Space name", "New space")?.trim();
    if (!name) return;
    setProjects((items) => items.map((project) => project.id === projectId ? { ...project, spaces: [...project.spaces, { id: crypto.randomUUID(), name, updatedAt: new Date().toISOString(), nodeCount: 0 }] } : project));
  };
  const removeProject = (id: string) => {
    if (window.confirm("Delete this local demo project and all of its spaces?")) setProjects((items) => items.filter((item) => item.id !== id));
  };
  const duplicateProject = (source: StudioProject) => setProjects((items) => [{ ...source, id: crypto.randomUUID(), name: `${source.name} copy`, spaces: source.spaces.map((space) => ({ ...space, id: crypto.randomUUID() })) }, ...items]);
  const renameSpace = (projectId: string, spaceId: string, currentName: string) => {
    const name = window.prompt("Rename space", currentName)?.trim();
    if (!name) return;
    setProjects((items) => items.map((project) => project.id === projectId ? { ...project, spaces: project.spaces.map((space) => space.id === spaceId ? { ...space, name, updatedAt: new Date().toISOString() } : space) } : project));
  };
  const duplicateSpace = (projectId: string, spaceId: string) => setProjects((items) => items.map((project) => project.id === projectId ? { ...project, spaces: [...project.spaces, ...project.spaces.filter((space) => space.id === spaceId).map((space) => ({ ...space, id: crypto.randomUUID(), name: `${space.name} copy`, updatedAt: new Date().toISOString() }))] } : project));
  const removeSpace = (projectId: string, spaceId: string) => {
    if (!window.confirm("Delete this local demo space?")) return;
    setProjects((items) => items.map((project) => project.id === projectId ? { ...project, spaces: project.spaces.filter((space) => space.id !== spaceId) } : project));
  };
  const spaceCards = visible.flatMap((project) => project.spaces.map((space) => ({ project, space })));

  if (!user) return <main className="spaces-access"><div className="spaces-access-card"><Sparkles/><span>PRIVATE BETA</span><h1>Spaces is ready for invited creators.</h1><p>{accessConfigured ? "Sign in with an invited account to continue." : "Set BAS_BETA_EMAILS in the server environment to invite up to five trusted users. Development access remains available after signing in."}</p><Link href="/">Return to Burma AI Studio</Link></div></main>;

  return <main className="spaces-dashboard">
    <div className="spaces-dashboard-body">
      <StudioNav/>
      <section className="spaces-projects">
        <div className="spaces-context"><span/><b>{visible[0]?.name || "Personal project"}</b><small>Private workspace</small><button onClick={createProject}><FolderPlus/>New project</button></div>
        <div className="spaces-heading"><div><p>BURMA AI STUDIO</p><h1>Spaces</h1><span>Build node-based generative workflows and bring your ideas to life.</span></div></div>
        <div className="spaces-browser-bar"><div className="spaces-tabs"><button className="active"><Boxes/>My spaces</button><button disabled><Users/>Shared</button><button disabled><LayoutGrid/>Templates</button><button disabled><Workflow/>Flows</button></div><div className="spaces-view-actions"><button className="spaces-new" onClick={() => visible[0] ? addSpace(visible[0].id) : createProject()}><Plus/>New space</button><button title="Favorites"><Heart/></button><button><Grid2X2/>Layout</button><button><ListFilter/>Filters</button><label className="spaces-search"><Search/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search spaces"/></label></div></div>
        {!ready ? <div className="spaces-empty">Loading your local demo workspace…</div> : visible.length === 0 ? <button className="spaces-empty" onClick={createProject}><Plus/>Create your first project</button> : <div className="spaces-project-grid">
          {spaceCards.map(({ project, space }, index) => <article key={space.id} className="spaces-project-card"><Link className="spaces-card-link" href={`/studio/spaces/${space.id}?project=${project.id}`}><div className="spaces-card-cover"><div className="spaces-preview-flow"><i/><i/><i/><span/><span/></div><em>{index % 3 === 0 ? "Creative flow" : index % 3 === 1 ? "Image sequence" : "Motion study"}</em></div><div className="spaces-card-status"><Sparkles/>Demo ready</div><div className="spaces-card-title"><div><h2>{space.name}</h2><p>{project.name} · Updated locally</p></div></div></Link><details className="spaces-card-menu"><summary aria-label={`Manage ${space.name}`}><MoreHorizontal/></summary><div><button onClick={() => renameSpace(project.id, space.id, space.name)}>Rename</button><button onClick={() => duplicateSpace(project.id, space.id)}>Duplicate</button><button onClick={() => removeSpace(project.id, space.id)}>Delete</button></div></details></article>)}
          {visible.map((project) => project.spaces.length === 0 && <article key={project.id} className="spaces-project-card spaces-new-project"><button onClick={() => addSpace(project.id)}><FolderPlus/><b>{project.name}</b><span>Create space</span></button><details className="spaces-card-menu"><summary aria-label="Project actions"><MoreHorizontal/></summary><div><button onClick={() => duplicateProject(project)}><Copy/>Duplicate project</button><button onClick={() => removeProject(project.id)}><Trash2/>Delete project</button></div></details></article>)}
          <button className="spaces-create-card" onClick={() => visible[0] ? addSpace(visible[0].id) : createProject()}><Plus/><b>New space</b><span>Start with a blank infinite canvas</span></button>
        </div>}
      </section>
    </div>
  </main>;
}
