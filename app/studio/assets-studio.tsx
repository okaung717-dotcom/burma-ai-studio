"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, BookOpen, Check, ChevronDown, Clapperboard, Folder,
  Grid2X2, Heart, ImageIcon, Info, Layers3, LayoutGrid, LayoutList, Library,
  ListFilter, LockKeyhole, Search, ShieldCheck, SlidersHorizontal, Sparkles,
  Video, X, Plus, UserRound, Palette, MapPin, Shapes, Paintbrush,
  PanelsTopLeft, Workflow, Bot, Network, Sticker,
  type LucideIcon,
} from "lucide-react";
import "./assets-studio.css";

type AssetCategory = "all" | "images" | "videos" | "favorites" | "characters" | "elements" | "styles" | "color" | "locations" | "brand-kit" | "templates" | "flows" | "agents" | "contexts";
type AssetScope = "all" | "private" | "shared";
type AssetsView = "library" | "collections" | "guide";
type AssetsLayout = "grid" | "list";
type AssetSort = "newest" | "oldest" | "name";
const categories: { id: AssetCategory; label: string; Icon: LucideIcon }[] = [
  { id: "all", label: "All assets", Icon: Library },
  { id: "images", label: "Images", Icon: ImageIcon },
  { id: "videos", label: "Videos", Icon: Clapperboard },
  { id: "favorites", label: "Favorites", Icon: Heart },
];
const referenceCategories: { id: AssetCategory; label: string; Icon: LucideIcon }[] = [
  { id: "characters", label: "Characters", Icon: UserRound },
  { id: "elements", label: "Elements", Icon: Shapes },
  { id: "styles", label: "Styles", Icon: Sticker },
  { id: "color", label: "Color", Icon: Palette },
  { id: "locations", label: "Locations", Icon: MapPin },
  { id: "brand-kit", label: "Brand kit", Icon: Paintbrush },
];
const customCategories: { id: AssetCategory; label: string; Icon: LucideIcon }[] = [
  { id: "templates", label: "Templates", Icon: PanelsTopLeft },
  { id: "flows", label: "Flows", Icon: Workflow },
  { id: "agents", label: "Agents", Icon: Bot },
  { id: "contexts", label: "Contexts", Icon: Network },
];
const allCategories = [...referenceCategories, ...customCategories, ...categories];
const categoryCopy: Record<AssetCategory, { heading: string; text: string }> = {
  all: {
    heading: "Your creative library starts here",
    text: "A calm, organized space for your media. No assets are connected to this visual preview; your existing Studio projects remain untouched.",
  },
  images: {
    heading: "Your images will live here",
    text: "A dedicated view for stills, reference frames and concept art. Image Studio and its existing workflow remain unchanged.",
  },
  videos: {
    heading: "Your motion library starts here",
    text: "A dedicated view for video media and scene outputs. Video Studio and its existing workflow remain unchanged.",
  },
  favorites: {
    heading: "Keep your best work close",
    text: "Starred media will be easy to find when library data is connected. Favorites are not yet synced or stored by this page.",
  },
  characters: { heading: "Build a consistent cast", text: "Organize character reference portraits, expressions and outfit continuity here. No characters are linked to this design-only preview." },
  elements: { heading: "Every detail in one place", text: "A reference home for objects, props and scene elements. Your existing media and storage remain unchanged." },
  styles: { heading: "Define your visual language", text: "Collect visual aesthetics, cinematic treatments and art direction references when the library is connected." },
  color: { heading: "Create a signature palette", text: "Curate color directions for cohesive scenes and visual identities. No palettes are saved by this UI." },
  locations: { heading: "Keep your worlds consistent", text: "Organize environments, sets and location references for scene continuity. No locations have been created." },
  "brand-kit": { heading: "One home for your identity", text: "A space for future logo, typography and brand reference assets. No brand files are stored here." },
  templates: { heading: "Start from a creative template", text: "Browse reusable project starters when the reference library is enabled. Your existing Studio templates remain untouched." },
  flows: { heading: "Build reusable creative flows", text: "A future home for organized production workflows. Current Studio Canvas flows have not been moved." },
  agents: { heading: "Organize intelligent assistants", text: "A future library of creative agent presets. No agents are connected or launched by this page." },
  contexts: { heading: "Keep creative context together", text: "Collect project knowledge, references and constraints when supported. No new context data is stored." },
};

export default function AssetsStudio() {
  const [category, setCategory] = useState<AssetCategory>("all");
  const [view, setView] = useState<AssetsView>("library");
  const [layout, setLayout] = useState<AssetsLayout>("grid");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<AssetSort>("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [scope, setScope] = useState<AssetScope>("all");
  const [projectScope, setProjectScope] = useState("personal");
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const selectedCategory = allCategories.find(item => item.id === category)!;
  const isMediaCategory = categories.some(item => item.id === category);
  const hasFilters = !!query.trim() || sort !== "newest" || scope !== "all";
  const emptyTitle = useMemo(() => {
    if (query.trim()) return "No matching media";
    if (scope === "shared") return "Shared library is not connected yet";
    if (scope === "private") return "Private library is not connected yet";
    return categoryCopy[category].heading;
  }, [query, category, scope]);

  function selectCategory(next: AssetCategory) {
    setCategory(next);
    setView("library");
    setFiltersOpen(false);
    setCreateMenuOpen(false);
  }
  function clearFilters() {
    setQuery("");
    setSort("newest");
    setScope("all");
    setFiltersOpen(false);
  }

  return (
    <section className="assets-studio" aria-labelledby="assets-studio-title">
      <aside className="assets-controls">
        <header className="assets-heading">
          <div>
            <span>PERSONAL PROJECT <ArrowRight aria-hidden="true" /> ASSETS LIBRARY</span>
            <h1 id="assets-studio-title">Assets Library</h1>
            <p>Creative media · Private workspace</p>
          </div>
          <button type="button" aria-label="Library information" aria-expanded={infoOpen} title="Library information" onClick={() => setInfoOpen(value => !value)}>
            <SlidersHorizontal />
          </button>
        </header>

        {infoOpen && <div className="assets-info-banner" role="note"><Info /> This is a presentation-only library. No new upload, delete, synchronization or database operations are enabled.</div>}

        <div className="assets-side-scroll">
          <section className="assets-side-group assets-reference-group" aria-label="Reference categories">
            <div className="assets-group-heading"><span>REFERENCES</span><span>LIBRARY</span></div>
            <div className="assets-category-list assets-reference-list">
              {referenceCategories.map(({ id, label, Icon }) => (
                <button key={id} type="button" className={category === id && view === "library" ? "active" : ""} aria-pressed={category === id && view === "library"} onClick={() => selectCategory(id)}>
                  <Icon aria-hidden="true" /><span>{label}</span>
                </button>
              ))}
            </div>
          </section>
          <section className="assets-side-group assets-custom-group" aria-label="Custom categories">
            <div className="assets-group-heading"><span>CUSTOM</span><span>WORKSPACE</span></div>
            <div className="assets-category-list assets-reference-list">
              {customCategories.map(({ id, label, Icon }) => (
                <button key={id} type="button" className={category === id && view === "library" ? "active" : ""} aria-pressed={category === id && view === "library"} onClick={() => selectCategory(id)}>
                  <Icon aria-hidden="true" /><span>{label}</span>
                </button>
              ))}
            </div>
          </section>
          <section className="assets-side-group" aria-label="Browse media">
            <div className="assets-group-heading"><span>MEDIA</span><span>YOUR ASSETS</span></div>
            <div className="assets-category-list">
              {categories.map(({ id, label, Icon }) => (
                <button key={id} type="button" className={category === id && view === "library" ? "active" : ""} aria-pressed={category === id && view === "library"} onClick={() => selectCategory(id)}>
                  <Icon aria-hidden="true" /><span>{label}</span><b>0</b>
                </button>
              ))}
            </div>
          </section>

          <section className="assets-side-group" aria-label="My collections">
            <div className="assets-group-heading"><span>COLLECTIONS</span><span>UI PREVIEW</span></div>
            <div className="assets-collection-sample">
              <div className="assets-collection-icon"><Folder /></div>
              <div><b>My collection</b><span>Your folders will appear here.</span></div>
              <span className="assets-collection-count">0</span>
            </div>
            <p className="assets-side-caption">Collection management isn't enabled. No folders or files have been created.</p>
          </section>

          <section className="assets-side-group" aria-label="Library organization">
            <div className="assets-group-heading"><span>ORGANIZE</span><span>LIBRARY VIEW</span></div>
            <div className="assets-organize-tiles">
              <div><div className="assets-tile-icon"><Layers3 /></div><b>Collections</b><small>Keep projects organized</small></div>
              <div><div className="assets-tile-icon"><Heart /></div><b>Favorites</b><small>Find creative highlights</small></div>
            </div>
          </section>

          <section className="assets-side-group assets-access-section" aria-label="Storage information">
            <div className="assets-group-heading"><span>STORAGE & PRIVACY</span></div>
            <div className="assets-storage-box">
              <span className="assets-storage-icon"><ShieldCheck /></span>
              <div><b>Private workspace</b><p>Original media and existing Studio assets remain untouched by this UI redesign.</p></div>
            </div>
            <div className="assets-storage-row"><span><LockKeyhole /> Asset catalog</span><b>Not connected</b></div>
            <p className="assets-side-caption">Existing browser demo records and private Supabase uploads are not automatically indexed in this page.</p>
          </section>
        </div>

        <footer className="assets-actions">
          <div className="assets-actions-label">QUICK ACTIONS</div>
          <div className="assets-action-grid">
            <Link href="/studio/image"><ImageIcon /> Image Studio <ArrowRight /></Link>
            <Link href="/studio/video"><Video /> Video Studio <ArrowRight /></Link>
          </div>
          <Link href="/studio/spaces" className="assets-open-studio"><Sparkles /> Open Studio Canvas <ArrowRight /></Link>
          <div className="assets-actions-note"><Check /> Visual design only · No changes to stored assets</div>
        </footer>
      </aside>

      <div className="assets-workspace">
        <header className="assets-toolbar">
          <nav aria-label="Assets Library views">
            <button type="button" className={view === "library" ? "active" : ""} aria-current={view === "library" ? "page" : undefined} onClick={() => setView("library")}><Library /> My assets</button>
            <button type="button" className={view === "collections" ? "active" : ""} aria-current={view === "collections" ? "page" : undefined} onClick={() => setView("collections")}><Folder /> Collections</button>
            <button type="button" className={view === "guide" ? "active" : ""} aria-current={view === "guide" ? "page" : undefined} onClick={() => setView("guide")}><BookOpen /> Library guide</button>
          </nav>
          <div className="assets-toolbar-actions">
            <button type="button" aria-label="Show favorite assets" aria-pressed={category === "favorites" && view === "library"} className={category === "favorites" && view === "library" ? "active" : ""} title="Favorites" onClick={() => selectCategory(category === "favorites" ? "all" : "favorites")}><Heart /></button>
            <button type="button" aria-label="Toggle library layout" title={layout === "grid" ? "Switch to list layout" : "Switch to grid layout"} onClick={() => setLayout(current => current === "grid" ? "list" : "grid")}>{layout === "grid" ? <LayoutGrid /> : <LayoutList />}<span>Layout</span></button>
            <div className="assets-filter-wrap">
              <button type="button" aria-expanded={filtersOpen} aria-label="Filter assets" className={filtersOpen || hasFilters ? "active" : ""} onClick={() => setFiltersOpen(open => !open)}><ListFilter /><span>Filters</span></button>
              {filtersOpen && (
                <div className="assets-filter-panel">
                  <label htmlFor="assets-sort">SORT BY</label>
                  <div className="assets-select"><select id="assets-sort" value={sort} onChange={event => setSort(event.target.value as AssetSort)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="name">Name A–Z</option></select><ChevronDown /></div>
                  <label htmlFor="assets-filter-kind">MEDIA TYPE</label>
                  <div className="assets-select"><select id="assets-filter-kind" value={category} onChange={event => selectCategory(event.target.value as AssetCategory)}><option value="all">All media</option><option value="images">Images</option><option value="videos">Videos</option><option value="favorites">Favorites</option></select><ChevronDown /></div>
                  <button type="button" className="assets-clear" onClick={clearFilters}>Reset filters</button>
                </div>
              )}
            </div>
            <label className="assets-search"><Search /><input aria-label="Search assets" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search…" /></label>
          </div>
        </header>

        <div className="assets-workspace-scroll">
          <div className="assets-content-heading assets-reference-heading">
            <div><span>LIBRARY <ArrowRight aria-hidden="true" /> {view === "library" ? selectedCategory.label.toUpperCase() : view === "collections" ? "COLLECTIONS" : "GUIDE"}</span><h2>{view === "library" ? selectedCategory.label : view === "collections" ? "Collections" : "Library guide"}</h2><p>{view === "library" ? "References and media, arranged for your next creative project." : view === "collections" ? "Keep your creative work organized by project." : "Your creative assets, organized clearly and securely."}</p></div>
            <div className="assets-reference-actions">
              <div className="assets-create-wrap">
                <button type="button" className="assets-create-button" aria-expanded={createMenuOpen} aria-label="Create asset workflow" onClick={() => setCreateMenuOpen(open => !open)}><Plus /> Create</button>
                {createMenuOpen && <div className="assets-create-menu" aria-label="Creation destinations">
                  <span>START FROM A WORKSPACE</span>
                  <Link href="/studio/image"><ImageIcon /> Image Studio <ArrowRight /></Link>
                  <Link href="/studio/video"><Clapperboard /> Video Studio <ArrowRight /></Link>
                  <Link href="/studio/spaces"><Sparkles /> Studio Canvas <ArrowRight /></Link>
                  <small>Creation opens an existing Studio tool. It does not create an asset in this library.</small>
                </div>}
              </div>
              <div className="assets-scope-switch" role="group" aria-label="Asset visibility">
                {(["all","private","shared"] as const).map(value => <button key={value} type="button" className={scope === value ? "active" : ""} aria-pressed={scope === value} onClick={() => setScope(value)}>{value === "all" ? "All" : value === "private" ? "Private" : "Shared"}</button>)}
              </div>
              <label className="assets-project-selector"><span className="sr-only">Project filter</span><select aria-label="Project filter" value={projectScope} onChange={event => setProjectScope(event.target.value)}><option value="personal">Personal project</option><option value="all">All projects</option></select><ChevronDown /></label>
            </div>
          </div>

          {view === "library" && (
            <>
              <div className="assets-media-tabs" role="group" aria-label="Filter assets by type">
                {isMediaCategory ? categories.map(({ id, label }) => <button key={id} type="button" className={category === id ? "active" : ""} aria-pressed={category === id} onClick={() => selectCategory(id)}>{label}</button>) : <span className="assets-reference-kind"><selectedCategory.Icon aria-hidden="true" /> {selectedCategory.label} · Reference library</span>}
                <span className="assets-data-disclaimer"><Info /> UI preview · Catalog not connected</span>
                <span className="assets-gallery-layout">{layout === "grid" ? "Grid view" : "List view"} <Grid2X2 /></span>
              </div>
              <div className={"assets-empty " + (layout === "list" ? "assets-empty-list" : "")}>
                <div className="assets-empty-art"><div className="assets-art-grid" /><div className="assets-art-card card-one"><ImageIcon /></div><div className="assets-art-card card-two"><Clapperboard /></div><div className="assets-art-spark"><Sparkles /></div></div>
                <span>{query.trim() ? "NO SEARCH RESULTS" : "YOUR CREATIVE SPACE"}</span>
                <h3>{emptyTitle}</h3>
                <p>{query.trim() ? "No assets match your search in this UI-only library view. Try another query or clear your filters." : scope !== "all" ? "The private and shared scopes are a visual preview only. Connected media, permissions and ownership remain unchanged." : categoryCopy[category].text}</p>
                <div className="assets-empty-actions">
                  {hasFilters ? <button type="button" className="assets-primary" onClick={clearFilters}><X /> Clear search & filters</button> : <Link href="/studio/spaces" className="assets-primary"><Sparkles /> Open Studio Canvas <ArrowRight /></Link>}
                  <Link href={category === "videos" || category === "flows" ? "/studio/video" : "/studio/image"} className="assets-secondary">{category === "videos" || category === "flows" ? "Video" : "Image"} Studio <ArrowRight /></Link>
                </div>
              </div>
            </>
          )}

          {view === "collections" && (
            <div className="assets-collections-empty">
              <div className="assets-feature-symbol"><Folder /></div>
              <span>WORKSPACE ORGANIZATION</span>
              <h3>Keep every project in its place</h3>
              <p>Folders, collections, tags and shared asset permissions require an approved data integration. This page is currently UI-only.</p>
              <div className="assets-collection-preview"><Folder /><div><b>My collection</b><span>0 assets · Preview only</span></div><span>EMPTY</span></div>
              <Link href="/studio/spaces"><Sparkles /> Open Studio Canvas <ArrowRight /></Link>
            </div>
          )}

          {view === "guide" && (
            <div className="assets-guide">
              <div className="assets-guide-lead"><ShieldCheck /><div><span>DESIGN PREVIEW</span><h3>Keep your media organized.</h3><p>A clear structure for creative assets, from the first frame to the final cut.</p></div></div>
              <div className="assets-guide-grid">
                <article><ImageIcon /><span>01 / IMAGES</span><h3>Stills & references</h3><p>Keep concept art, reference images and selected frames easy to locate.</p><Link href="/studio/image">Open Image Studio <ArrowRight /></Link></article>
                <article><Video /><span>02 / VIDEO</span><h3>Motion & scenes</h3><p>Make space for rendered sequences, timing references and motion studies.</p><Link href="/studio/video">Open Video Studio <ArrowRight /></Link></article>
                <article><Folder /><span>03 / COLLECTIONS</span><h3>Organize by project</h3><p>A future-ready place for project folders and media groups.</p><button type="button" onClick={() => setView("collections")}>View collections <ArrowRight /></button></article>
                <article><LockKeyhole /><span>04 / PRIVACY</span><h3>Keep private assets private</h3><p>This redesign does not modify access policies, storage or existing files.</p><span className="assets-guide-soon">No data changes</span></article>
              </div>
            </div>
          )}

          <footer className="assets-workspace-footer">
            <span><Info /> No assets were uploaded, edited or deleted by this page. The new gallery is a UI-only preview.</span>
            <Link href="/studio/spaces">Go to Studio <ArrowRight /></Link>
          </footer>
        </div>
      </div>
    </section>
  );
}
