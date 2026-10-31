"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Aperture, ArrowRight, BookOpen, Camera, Check, ChevronDown, Clapperboard,
  Clock3, Copy, Film, Focus, Grid2X2, Heart, Info, Layers3, LayoutList,
  Lightbulb, ListFilter, Minus, Plus, Search, Settings2,
  SlidersHorizontal, Sparkles, Trash2, WandSparkles, X,
} from "lucide-react";
import "./director-studio.css";

type ShotDraft = {
  scene: string;
  subject: string;
  shot: string;
  movement: string;
  lens: string;
  lighting: string;
  mood: string;
  duration: number;
  aspect: string;
  direction: string;
};
type Shot = ShotDraft & { id: string; index: number; favorite: boolean };
type DirectorTab = "storyboard" | "library" | "guide";

const initialDraft: ShotDraft = {
  scene: "Scene 01 · Opening",
  subject: "",
  shot: "Medium shot",
  movement: "Slow push-in",
  lens: "50mm",
  lighting: "Natural soft light",
  mood: "Cinematic realism",
  duration: 5,
  aspect: "16:9",
  direction: "",
};

const shotPresets: { title: string; eyebrow: string; shot: string; lens: string; movement: string; lighting: string; mood: string; description: string }[] = [
  { title: "Establishing scene", eyebrow: "01 · INTRODUCTION", shot: "Wide establishing", lens: "24mm", movement: "Slow dolly forward", lighting: "Natural soft light", mood: "Cinematic realism", description: "Reveal location, atmosphere and spatial context before entering the action." },
  { title: "Character emotion", eyebrow: "02 · PERFORMANCE", shot: "Close-up", lens: "85mm", movement: "Slow push-in", lighting: "Soft side light", mood: "Quiet tension", description: "Focus on nuanced expressions, eye movement and restrained body language." },
  { title: "Action coverage", eyebrow: "03 · MOVEMENT", shot: "Tracking shot", lens: "35mm", movement: "Smooth tracking", lighting: "Practical motivated light", mood: "Dynamic energy", description: "Keep character movement and screen direction consistent across the scene." },
];

function formatTime(total: number) {
  const minutes = Math.floor(total / 60);
  return String(minutes).padStart(2, "0") + ":" + String(total % 60).padStart(2, "0");
}

function directionText(item: ShotDraft, number?: number) {
  const lines = [
    number === undefined ? "AI Director — Scene direction" : "SHOT " + String(number).padStart(2, "0") + " — " + item.scene,
    "Scene: " + item.scene,
    "Subject: " + (item.subject.trim() || "Not specified"),
    "Framing: " + item.shot + " · Lens: " + item.lens,
    "Camera: " + item.movement,
    "Lighting: " + item.lighting + " · Mood: " + item.mood,
    "Duration: " + item.duration + "s · Aspect ratio: " + item.aspect,
  ];
  if (item.direction.trim()) lines.push("Direction: " + item.direction.trim());
  return lines.join("\n");
}

export default function DirectorStudio() {
  const [draft, setDraft] = useState<ShotDraft>(initialDraft);
  const [shots, setShots] = useState<Shot[]>([]);
  const [tab, setTab] = useState<DirectorTab>("storyboard");
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [compact, setCompact] = useState(false);
  const [filter, setFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [message, setMessage] = useState("UI-only directing board · Not connected to AI generation or persistent storage.");
  const directionRef = useRef<HTMLTextAreaElement>(null);

  function update<K extends keyof ShotDraft>(key: K, value: ShotDraft[K]) {
    setDraft(current => ({ ...current, [key]: value }));
  }

  const visible = useMemo(() => shots.filter(item =>
    (!favoritesOnly || item.favorite) &&
    (filter === "all" || item.aspect === filter) &&
    [item.scene, item.subject, item.shot, item.movement, item.direction].join(" ").toLowerCase().includes(query.toLowerCase().trim())
  ), [shots, favoritesOnly, filter, query]);

  const selectedShot = shots.find(item => item.id === selected);
  const editing = !!selectedShot;

  const saveShot = () => {
    if (!draft.scene.trim()) {
      setMessage("Enter a scene name before adding a shot.");
      return;
    }
    const next: ShotDraft = { ...draft, scene: draft.scene.trim(), subject: draft.subject.trim(), direction: draft.direction.trim() };
    if (selectedShot) {
      setShots(items => items.map(item => item.id === selectedShot.id ? { ...item, ...next } : item));
      setMessage("Shot updated in this tab. This UI draft is not saved to a server.");
    } else {
      setShots(items => [...items, { ...next, id: crypto.randomUUID(), index: items.length + 1, favorite: false }]);
      setMessage("Shot added to your directing board. Copy the shot plan to retain it.");
    }
    setSelected(null);
    setTab("storyboard");
  };
  const editShot = (item: Shot) => {
    setDraft({
      scene: item.scene, subject: item.subject, shot: item.shot, movement: item.movement,
      lens: item.lens, lighting: item.lighting, mood: item.mood, duration: item.duration,
      aspect: item.aspect, direction: item.direction,
    });
    setSelected(item.id);
    setTab("storyboard");
    directionRef.current?.focus();
  };
  const resetEditor = () => {
    setDraft(initialDraft);
    setSelected(null);
    setMessage("Editor reset. Existing shots in this tab remain unchanged.");
  };
  const choosePreset = (preset: typeof shotPresets[number]) => {
    setSelected(null);
    setDraft(current => ({
      ...current, shot: preset.shot, lens: preset.lens, movement: preset.movement,
      lighting: preset.lighting, mood: preset.mood, direction: preset.description,
    }));
    setTab("storyboard");
    setMessage(preset.title + " preset loaded in the editor. Add shot to put it on the board.");
    directionRef.current?.focus();
  };
  const copy = async (text: string, success: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setMessage(success);
    } catch { setMessage("Clipboard access was blocked. Select and copy your direction manually."); }
  };
  const copyBoard = () => {
    if (!shots.length) { setMessage("Add at least one shot before copying the board."); return; }
    void copy(shots.map(item => directionText(item, item.index)).join("\n\n---\n\n"), "Storyboard copied to clipboard.");
  };

  return (
    <section className="director-studio" aria-labelledby="director-studio-title">
      <aside className="director-controls">
        <header className="director-heading">
          <div>
            <span>PERSONAL PROJECT <ArrowRight aria-hidden="true" /> AI DIRECTOR</span>
            <h1 id="director-studio-title">AI Director</h1>
            <p>Visual scene planning · Cinematic direction</p>
          </div>
          <button type="button" aria-label="Director information" aria-expanded={detailsOpen} title="Director information" onClick={() => setDetailsOpen(v => !v)}><Settings2 /></button>
        </header>
        {detailsOpen && <p className="director-disclosure"><Info /> This is a visual planning tool only. No AI, video, image, paid generation, database writes or production workflow execution occurs here.</p>}
        <div className="director-scroll">
          <div className="director-block director-project">
            <div className="director-field"><label htmlFor="director-scene">SCENE</label><input id="director-scene" value={draft.scene} maxLength={110} onChange={event => update("scene", event.target.value)} placeholder="Scene name" /></div>
            <div className="director-field"><label htmlFor="director-subject">SUBJECT / ACTION</label><input id="director-subject" value={draft.subject} maxLength={180} onChange={event => update("subject", event.target.value)} placeholder="Character, subject or action" /></div>
          </div>
          <div className="director-block">
            <div className="director-block-label"><span>SHOT COMPOSITION</span><span>CAMERA LANGUAGE</span></div>
            <div className="director-dual">
              <div className="director-field"><label htmlFor="director-shot">Shot type</label><div className="director-select"><Focus /><select id="director-shot" value={draft.shot} onChange={event => update("shot", event.target.value)}><option>Wide establishing</option><option>Full shot</option><option>Medium shot</option><option>Cowboy shot</option><option>Close-up</option><option>Extreme close-up</option><option>Over-the-shoulder</option><option>Tracking shot</option><option>Low-angle hero</option><option>Drone aerial</option></select><ChevronDown /></div></div>
              <div className="director-field"><label htmlFor="director-lens">Lens</label><div className="director-select"><Aperture /><select id="director-lens" value={draft.lens} onChange={event => update("lens", event.target.value)}><option>24mm</option><option>35mm</option><option>50mm</option><option>85mm</option><option>135mm</option></select><ChevronDown /></div></div>
            </div>
          </div>
          <div className="director-block">
            <div className="director-block-label"><span>CAMERA & MOTION</span></div>
            <div className="director-field"><label htmlFor="director-movement" className="sr-only">Camera movement</label><div className="director-select"><Camera /><select id="director-movement" value={draft.movement} onChange={event => update("movement", event.target.value)}><option>Slow push-in</option><option>Static locked-off</option><option>Smooth tracking</option><option>Slow dolly forward</option><option>Slow orbit</option><option>Handheld realism</option><option>Crane reveal</option><option>Drone flyover</option><option>Pan left to right</option><option>Rack focus</option></select><ChevronDown /></div></div>
          </div>
          <div className="director-block">
            <div className="director-block-label"><span>LOOK & ATMOSPHERE</span></div>
            <div className="director-dual">
              <div className="director-field"><label htmlFor="director-light">Lighting</label><div className="director-select"><Lightbulb /><select id="director-light" value={draft.lighting} onChange={event => update("lighting", event.target.value)}><option>Natural soft light</option><option>Soft side light</option><option>Practical motivated light</option><option>Overcast daylight</option><option>Late afternoon</option><option>Hard directional light</option><option>Low-key contrast</option></select><ChevronDown /></div></div>
              <div className="director-field"><label htmlFor="director-mood">Mood</label><div className="director-select"><Sparkles /><select id="director-mood" value={draft.mood} onChange={event => update("mood", event.target.value)}><option>Cinematic realism</option><option>Quiet tension</option><option>Dynamic energy</option><option>Intimate drama</option><option>Suspense</option><option>Hopeful</option><option>Atmospheric mystery</option></select><ChevronDown /></div></div>
            </div>
          </div>
          <div className="director-block director-prompt">
            <div className="director-block-label"><label htmlFor="director-direction">DIRECTOR'S NOTES</label><span>{draft.direction.length}/2000</span></div>
            <textarea id="director-direction" ref={directionRef} value={draft.direction} onChange={event => update("direction", event.target.value)} maxLength={2000} placeholder="Describe performance, blocking, camera movement, timing, transitions, composition and scene continuity…" />
            <p><WandSparkles /> Define what changes in the shot and what must stay consistent.</p>
          </div>
        </div>
        <footer className="director-footer">
          <div className="director-quick-settings" aria-label="Shot output planning settings">
            <div className="director-duration">
              <span>SECONDS</span>
              <div><button type="button" aria-label="Decrease shot duration" disabled={draft.duration <= 3} onClick={() => update("duration", Math.max(3, draft.duration - 1))}><Minus /></button><b>{draft.duration}s</b><button type="button" aria-label="Increase shot duration" disabled={draft.duration >= 20} onClick={() => update("duration", Math.min(20, draft.duration + 1))}><Plus /></button></div>
            </div>
            <label>FRAME <select aria-label="Shot aspect ratio" value={draft.aspect} onChange={event => update("aspect", event.target.value)}><option>16:9</option><option>9:16</option><option>1:1</option><option>4:5</option></select></label>
            <button type="button" className="director-reset" onClick={resetEditor} title="Reset shot editor"><X /> Reset</button>
          </div>
          <button type="button" className="director-add-shot" onClick={saveShot}><WandSparkles /> {editing ? "Save shot changes" : "Add shot to storyboard"} <ArrowRight /></button>
          <p role="status" className="director-status">{message}</p>
          <div className="director-safety"><Check /> Design preview · No AI generated · Not saved to server</div>
        </footer>
      </aside>
      <div className="director-board">
        <header className="director-board-toolbar">
          <nav aria-label="Director workspace views">
            <button type="button" className={tab === "storyboard" ? "active" : ""} onClick={() => setTab("storyboard")}><Clapperboard /> Storyboard</button>
            <button type="button" className={tab === "library" ? "active" : ""} onClick={() => setTab("library")}><Grid2X2 /> Shot library</button>
            <button type="button" className={tab === "guide" ? "active" : ""} onClick={() => setTab("guide")}><BookOpen /> Director guide</button>
          </nav>
          <div className="director-toolbar-actions">
            <button type="button" aria-label="Show favorite shots" aria-pressed={favoritesOnly} className={favoritesOnly ? "active" : ""} onClick={() => setFavoritesOnly(v => !v)} title="Show favorites"><Heart /></button>
            <button type="button" aria-label="Change storyboard layout" onClick={() => setCompact(v => !v)} title="Change layout">{compact ? <Grid2X2 /> : <LayoutList />}<span>Layout</span></button>
            <div className="director-filter-wrap">
              <button type="button" aria-label="Filter shots" aria-expanded={filterOpen} className={filterOpen || filter !== "all" ? "active" : ""} onClick={() => setFilterOpen(v => !v)}><ListFilter /><span>Filters</span></button>
              {filterOpen && <div className="director-filter-panel"><label htmlFor="director-ratio-filter">Aspect ratio</label><select id="director-ratio-filter" value={filter} onChange={event => setFilter(event.target.value)}><option value="all">All ratios</option><option>16:9</option><option>9:16</option><option>1:1</option><option>4:5</option></select><button type="button" onClick={() => { setFilter("all"); setFilterOpen(false); }}>Clear filters</button></div>}
            </div>
            <label className="director-search"><Search /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search…" aria-label="Search storyboard shots" /></label>
          </div>
        </header>
        <div className="director-board-scroll">
          <div className="director-board-heading">
            <div><span>BURMA AI STUDIO / CINEMATIC DIRECTION</span><h2>{tab === "storyboard" ? "Scene storyboard" : tab === "library" ? "Shot inspiration" : "Director's field guide"}</h2><p>{tab === "storyboard" ? "Compose shot language and organize visual storytelling." : tab === "library" ? "Curated shot starting points for faster creative direction." : "A practical checklist for consistent cinematic scenes."}</p></div>
            <div className="director-board-summary"><Clapperboard /><strong>{shots.length}</strong><span>Shots</span><i /> <Clock3 /><strong>{formatTime(shots.reduce((sum, shot) => sum + shot.duration, 0))}</strong></div>
          </div>

          {tab === "storyboard" && (visible.length ?
            <div className={"director-shot-list" + (compact ? " compact" : "")}>
              {visible.map((item) => <article key={item.id} className="director-shot-card">
                <div className="director-shot-preview"><div className="director-shot-art"><div className="director-art-rings" /><div className="director-art-center"><Aperture /><span>FRAME {String(item.index).padStart(2, "0")}</span></div></div><span className="director-preview-tag">{item.shot}</span><span className="director-preview-duration">{item.duration}s</span></div>
                <div className="director-shot-info"><div className="director-shot-title"><div><span>SHOT {String(item.index).padStart(2, "0")}</span><h3>{item.scene}</h3></div><span className="director-shot-badge">{item.aspect}</span></div>
                  <p>{item.subject || item.direction || "Add subject and performance notes for this scene."}</p>
                  <div className="director-shot-meta"><span><Camera /> {item.movement}</span><span><Aperture /> {item.lens}</span><span><Lightbulb /> {item.lighting}</span></div>
                  <div className="director-shot-actions">
                    <button type="button" onClick={() => editShot(item)}><SlidersHorizontal /> Edit shot</button>
                    <button type="button" aria-label={"Copy shot " + item.index} onClick={() => void copy(directionText(item, item.index), "Shot direction copied to clipboard.")}><Copy /></button>
                    <button type="button" aria-label={"Favorite shot " + item.index} aria-pressed={item.favorite} className={item.favorite ? "active" : ""} onClick={() => setShots(items => items.map(shot => shot.id === item.id ? { ...shot, favorite: !shot.favorite } : shot))}><Heart /></button>
                    <button type="button" aria-label={"Delete shot " + item.index} onClick={() => { setShots(items => items.filter(shot => shot.id !== item.id)); if (selected === item.id) setSelected(null); }}><Trash2 /></button>
                  </div>
                </div>
              </article>)}
            </div> : <div className="director-empty"><div className="director-empty-symbol"><WandSparkles /></div><span>VISUAL STORYTELLING</span><h3>{shots.length ? "No shots match your view" : "Every scene starts with a vision"}</h3><p>{shots.length ? "Try clearing your filters or searching for another shot." : "Build a professional shot plan with framing, lenses, camera moves and lighting. Your director board is a UI-only draft."}</p><button type="button" onClick={() => { if (shots.length) { setFilter("all"); setQuery(""); setFavoritesOnly(false); } else directionRef.current?.focus(); }}><Plus /> {shots.length ? "Clear filters" : "Direct your first shot"}</button></div>
          )}
          {tab === "library" && <div className="director-library"><p className="director-library-intro">SELECT A SHOT DIRECTION PRESET TO START — NO GENERATION WILL OCCUR.</p><div className="director-library-grid">{shotPresets.map((preset, index) => <article key={preset.title}><div className={"director-preset-art director-preset-art-" + index}><Camera /><span>SHOT / 0{index + 1}</span></div><div><span>{preset.eyebrow}</span><h3>{preset.title}</h3><p>{preset.description}</p><div><small>{preset.shot}</small><small>{preset.lens}</small></div><button type="button" onClick={() => choosePreset(preset)}><Plus /> Use direction</button></div></article>)}</div></div>}
          {tab === "guide" && <div className="director-guide">
            <div className="director-guide-lead"><Layers3 /><div><span>DIRECTING FRAMEWORK</span><h3>Story, camera, continuity.</h3><p>Build shots with a consistent sense of space, performance and emotional intention.</p></div></div>
            <div className="director-guide-grid">
              <article><span>01 / FRAMING</span><h3>Establish the shot</h3><p>Define the camera angle, focal length and who is inside the frame.</p></article>
              <article><span>02 / PERFORMANCE</span><h3>Direct the character</h3><p>Describe gesture, expression, attention and blocking, not only dialogue.</p></article>
              <article><span>03 / LIGHT</span><h3>Motivate the lighting</h3><p>Keep practical light sources and exposure consistent across coverage.</p></article>
              <article><span>04 / CONTINUITY</span><h3>Protect the scene</h3><p>Preserve wardrobe, geography, eyelines and screen direction between shots.</p></article>
            </div>
          </div>}
          <footer className="director-board-footer">
            <div><Info /> Director Studio is a visual UI prototype. Shots exist only in this browser tab until copied.</div>
            <div><button type="button" onClick={copyBoard} disabled={!shots.length}><Copy /> Copy storyboard</button><Link href="/studio/spaces">Open Studio Canvas <ArrowRight /></Link></div>
          </footer>
        </div>
      </div>
    </section>
  );
}
