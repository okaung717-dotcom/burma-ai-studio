"use client";
/* eslint-disable @next/next/no-img-element -- private reference previews are served by our authenticated media endpoint */

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight, BookOpen, Check, ChevronDown, Clapperboard, Clock3, Copy, Film, Grid2X2,
  Heart, ImagePlus, Info, LayoutList, ListFilter, Minus, Plus, Play, Search, Settings2, SlidersHorizontal,
  Sparkles, Trash2, Video, Volume2, VolumeX, WandSparkles, X
} from "lucide-react";
import "./video-studio.css";

type FrameSlot = "first" | "last";
type Frame = { assetId?: string; url: string; name: string; transient?: boolean };
type VideoRecord = {
  id: string; prompt: string; model: string; aspect: string; duration: number; fps: string;
  movement: string; createdAt: string; firstFrame?: string; lastFrame?: string;
  resolution?: string; audio?: boolean; quantity?: number; generationMode?: string;
  favorite?: boolean; status: "demo";
};
type Draft = { prompt: string; aspect: string; duration: number; fps: string; movement: string; resolution: string; audio: boolean; quantity: number; generationMode: string };

const STORAGE_KEY = "bas-video-studio-demo-v1";
const DEFAULT_MESSAGE = "Demo Mode is active. Submitting a workflow does not render a video or contact a paid provider.";

function validRecord(value: unknown): value is VideoRecord {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<VideoRecord>;
  return typeof item.id === "string" && typeof item.prompt === "string" && typeof item.createdAt === "string" && item.status === "demo";
}

function displayDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Demo history" : date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function VideoStudio() {
  const [model] = useState("Burma Video · Demo");
  const [prompt, setPrompt] = useState("");
  const [aspect, setAspect] = useState("16:9");
  const [duration, setDuration] = useState(5);
  const [fps, setFps] = useState("24");
  const [movement, setMovement] = useState("Cinematic push-in");
  const [resolution, setResolution] = useState("720p");
  const [generationMode, setGenerationMode] = useState("Standard");
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [firstFrame, setFirstFrame] = useState<Frame | null>(null);
  const [lastFrame, setLastFrame] = useState<Frame | null>(null);
  const [creations, setCreations] = useState<VideoRecord[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState<"creations" | "templates" | "guide">("creations");
  const [query, setQuery] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [compact, setCompact] = useState(false);
  const [filter, setFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [uploading, setUploading] = useState<FrameSlot | null>(null);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const frameInput = useRef<HTMLInputElement>(null);
  const uploadSlot = useRef<FrameSlot>("first");
  const promptRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") as { creations?: unknown[]; draft?: Partial<Draft>; frames?: { first?: Frame | null; last?: Frame | null } } | null;
      if (saved?.creations && Array.isArray(saved.creations)) setCreations(saved.creations.filter(validRecord).slice(0, 80));
      const draft = saved?.draft;
      if (draft) {
        if (typeof draft.prompt === "string") setPrompt(draft.prompt.slice(0, 4000));
        if (["16:9", "9:16", "1:1", "4:5"].includes(draft.aspect || "")) setAspect(draft.aspect!);
        if ([5, 8, 10].includes(draft.duration || 0)) setDuration(draft.duration!);
        if (["24", "30"].includes(draft.fps || "")) setFps(draft.fps!);
        if (typeof draft.movement === "string") setMovement(draft.movement);
        if (["720p", "1080p"].includes(draft.resolution || "")) setResolution(draft.resolution!);
        if (["Standard", "Creative"].includes(draft.generationMode || "")) setGenerationMode(draft.generationMode!);
        if (typeof draft.audio === "boolean") setAudioEnabled(draft.audio);
        if (typeof draft.quantity === "number" && draft.quantity >= 1 && draft.quantity <= 4) setQuantity(draft.quantity);
      }
      if (saved?.frames?.first && !saved.frames.first.transient) setFirstFrame(saved.frames.first);
      if (saved?.frames?.last && !saved.frames.last.transient) setLastFrame(saved.frames.last);
    } catch { /* Storage can be restricted in private browsing. */ }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        creations: creations.slice(0, 80),
        draft: { prompt, aspect, duration, fps, movement, resolution, audio: audioEnabled, quantity, generationMode },
        frames: { first: firstFrame?.transient ? null : firstFrame, last: lastFrame?.transient ? null : lastFrame }
      }));
    } catch { setMessage("Browser storage is full or unavailable. Your current draft is still open."); }
  }, [loaded, creations, prompt, aspect, duration, fps, movement, resolution, audioEnabled, quantity, generationMode, firstFrame, lastFrame]);

  const visible = useMemo(() => creations.filter(item =>
    (!favoritesOnly || item.favorite) &&
    (filter === "all" || item.aspect === filter) &&
    [item.prompt, item.movement, item.aspect].join(" ").toLowerCase().includes(query.trim().toLowerCase())
  ), [creations, favoritesOnly, filter, query]);

  const chooseFrame = (slot: FrameSlot) => { uploadSlot.current = slot; frameInput.current?.click(); };

  const onFrameSelected = async (file?: File) => {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 15_000_000 || !file.size) {
      setMessage("Please choose a JPEG, PNG or WebP image under 15 MB."); return;
    }
    const slot = uploadSlot.current;
    setUploading(slot);
    try {
      const form = new FormData();
      form.set("file", file);
      const response = await fetch("/api/studio/media", { method: "POST", body: form });
      const result = await response.json();
      if (!response.ok || typeof result.id !== "string" || typeof result.url !== "string") throw new Error(result.error || "Private upload failed");
      const frame: Frame = { assetId: result.id, url: result.url, name: file.name.slice(0, 120) };
      if (slot === "first") setFirstFrame(frame); else setLastFrame(frame);
      setMessage("Reference frame uploaded to private storage. Video generation is still in Demo Mode.");
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        const frame: Frame = { url: String(reader.result), name: file.name.slice(0, 120), transient: true };
        if (slot === "first") setFirstFrame(frame); else setLastFrame(frame);
      };
      reader.readAsDataURL(file);
      setMessage("Private media storage unavailable. Frame preview is browser-only and will not survive refresh.");
    } finally {
      setUploading(null);
      if (frameInput.current) frameInput.current.value = "";
    }
  };

  const generate = async () => {
    const clean = prompt.trim();
    if (clean.length < 3) { setMessage("Write a motion prompt of at least 3 characters."); promptRef.current?.focus(); return; }
    if (lastFrame && !firstFrame) { setMessage("Add a first frame before using a last frame."); return; }
    setRunning(true);
    setMessage("Recording your video workflow in Demo Mode…");
    try {
      const response = await fetch("/api/studio/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "video", prompt: clean, requestId: crypto.randomUUID() })
      });
      const result = await response.json();
      if (!response.ok || !result.demo) throw new Error(result.error || "The demo request was not completed.");
      const record: VideoRecord = {
        id: crypto.randomUUID(), prompt: clean, model, aspect, duration, fps, movement,
        resolution, audio: audioEnabled, quantity, generationMode,
        createdAt: typeof result.createdAt === "string" ? result.createdAt : new Date().toISOString(),
        firstFrame: firstFrame?.transient ? undefined : firstFrame?.url,
        lastFrame: lastFrame?.transient ? undefined : lastFrame?.url,
        status: "demo"
      };
      setCreations(items => [record, ...items].slice(0, 80));
      setTab("creations");
      setQuery("");
      setFavoritesOnly(false);
      setFilter("all");
      setMessage("Demo workflow saved in this browser. No actual video was generated or billed.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The demo request failed.");
    } finally {
      setRunning(false);
    }
  };

  const addShot = () => { setPrompt(value => value.trimEnd() + (value.trim() ? "\n\n" : "") + "Shot " + Math.max(2, (value.match(/\bShot\s+\d+/gi) || []).length + 1) + ": "); promptRef.current?.focus(); };

  const reuse = (item: VideoRecord) => {
    setPrompt(item.prompt);
    setAspect(item.aspect);
    setDuration(item.duration);
    setFps(item.fps);
    setMovement(item.movement);
    if (item.resolution) setResolution(item.resolution);
    if (typeof item.audio === "boolean") setAudioEnabled(item.audio);
    if (item.quantity) setQuantity(item.quantity);
    if (item.generationMode) setGenerationMode(item.generationMode);
    setMessage("Settings copied into the editor. The reference frames must be selected again.");
    promptRef.current?.focus();
  };

  return <section className="video-studio" aria-labelledby="video-studio-title">
    <aside className="video-controls">
      <header className="video-tool-heading">
        <div><span>PERSONAL PROJECT <ArrowRight aria-hidden="true"/> VIDEO STUDIO</span><h1 id="video-studio-title">Video Generator</h1><p>Image-to-video · Cinematic motion workflows</p></div>
        <button type="button" aria-label="Video settings" aria-expanded={settingsOpen} title="Video settings" onClick={() => setSettingsOpen(open => !open)}><Settings2/></button>
      </header>
      {settingsOpen && <div className="video-settings-note" role="note"><Info/> This private beta offers video workflow planning only. Actual generation, motion transfer, audio rendering and downloads are not enabled.</div>}
      <div className="video-control-scroll">
        <div className="video-control-block video-compact-model">
          <div className="video-model-grid">
            <label htmlFor="video-model">MODEL<div className="video-model-select"><Sparkles/><select id="video-model" value={model} onChange={() => {}}><option value="Burma Video · Demo">Burma Video · Demo</option><option disabled>Seedance · Not connected</option><option disabled>Veo · Not connected</option><option disabled>Kling · Not connected</option></select><ChevronDown/></div></label>
            <label htmlFor="video-generation-mode">MODE<div className="video-model-select video-mode-select"><select id="video-generation-mode" value={generationMode} onChange={event => setGenerationMode(event.target.value)}><option>Standard</option><option>Creative</option></select><ChevronDown/></div></label>
          </div>
          <span className="video-inline-disclaimer"><Info/> Demo only · Provider execution is disabled</span>
        </div>
        <div className="video-control-block video-reference-block">
          <div className="video-control-label"><label>REFERENCES</label><span>{Number(!!firstFrame) + Number(!!lastFrame)}/2</span></div>
          <div className="video-keyframes video-reference-grid">
            {([["first", firstFrame, "Start image"], ["last", lastFrame, "End image"]] as const).map(([slot, frame, label]) =>
              <div key={slot} className={`video-frame-slot ${frame ? "has-frame" : ""}`}>
                {frame ? <>
                  <img src={frame.url} alt={`${label} preview`}/>
                  <div className="video-frame-overlays"><span>{label}</span><button type="button" aria-label={`Remove ${slot} frame`} onClick={() => slot === "first" ? setFirstFrame(null) : setLastFrame(null)}><X/></button></div>
                </> : <button type="button" onClick={() => chooseFrame(slot)} disabled={uploading !== null} aria-label={`Add ${slot} frame`}><ImagePlus/><b>{uploading === slot ? "Uploading…" : label}</b><small>Choose image</small></button>}
              </div>
            )}
            <div className="video-frame-slot video-motion-transfer">
              <div className="video-motion-transfer-inner"><Film/><b>Motion transfer</b><small>Coming soon</small></div>
            </div>
          </div>
          <div className="video-add-media">
            <div className="video-add-media-icons"><ImagePlus/><Film/><Video/><Sparkles/></div>
            <button type="button" onClick={() => chooseFrame(!firstFrame ? "first" : "last")} disabled={uploading !== null}><Plus/> Add media <span>Image</span></button>
          </div>
          <input ref={frameInput} type="file" hidden accept="image/jpeg,image/png,image/webp" onChange={event => void onFrameSelected(event.target.files?.[0])}/>
        </div>
        <div className="video-control-block video-prompt-block">
          <div className="video-control-label video-shot-heading"><label htmlFor="video-prompt">SHOT <button type="button" aria-label="Add another shot" title="Insert shot prompt" onClick={addShot}><Plus/></button></label><span>Manual <ChevronDown/></span></div>
          <textarea ref={promptRef} id="video-prompt" aria-label="Motion prompt" placeholder="Describe your video — add camera motion, characters, timing and references…" value={prompt} onChange={event => setPrompt(event.target.value)} maxLength={4000}/>
          <div className="video-prompt-tips"><WandSparkles/><span>{prompt.length}/4000 · Tip: describe motion and camera direction.</span></div>
        </div>
        <div className="video-control-block video-camera-block">
          <label htmlFor="video-camera">CAMERA MOVEMENT</label>
          <div className="video-model-select video-movement"><Film/><select id="video-camera" value={movement} onChange={event => setMovement(event.target.value)}><option>Cinematic push-in</option><option>Static tripod</option><option>Smooth tracking shot</option><option>Slow orbit</option><option>Handheld realism</option><option>Drone reveal</option></select><ChevronDown/></div>
        </div>
      </div>
      <footer className="video-generate-footer">
        <div className="video-quick-settings" aria-label="Video output settings">
          <div className="video-quantity-control"><button type="button" aria-label="Decrease video quantity" disabled={quantity<=1} onClick={() => setQuantity(q => Math.max(1,q-1))}><Minus/></button><strong>{quantity}</strong><button type="button" aria-label="Increase video quantity" disabled={quantity>=4} onClick={() => setQuantity(q => Math.min(4,q+1))}><Plus/></button></div>
          <label><span className="sr-only">Video resolution</span><select aria-label="Video resolution" value={resolution} onChange={event=>setResolution(event.target.value)}><option>720p</option><option>1080p</option></select></label>
          <label><span className="sr-only">Video duration</span><select aria-label="Video duration" value={duration} onChange={event=>setDuration(Number(event.target.value))}><option value={5}>5s</option><option value={8}>8s</option><option value={10}>10s</option></select></label>
          <label><span className="sr-only">Video aspect ratio</span><select aria-label="Video aspect ratio" value={aspect} onChange={event=>setAspect(event.target.value)}><option>16:9</option><option>9:16</option><option>1:1</option><option>4:5</option></select></label>
        </div>
        <div className="video-secondary-settings">
          <button type="button" className={audioEnabled ? "audio-on" : ""} aria-label="Toggle audio preference" aria-pressed={audioEnabled} onClick={()=>setAudioEnabled(v=>!v)}>{audioEnabled?<Volume2/>:<VolumeX/>}<span>Audio {audioEnabled?"ON":"OFF"}</span></button>
          <label htmlFor="video-fps">FPS <select id="video-fps" aria-label="Video frame rate" value={fps} onChange={event=>setFps(event.target.value)}><option value="24">24</option><option value="30">30</option></select></label>
          <span className="video-mode-chip">DEMO ONLY</span>
        </div>
        <button type="button" className="video-generate-button" onClick={() => void generate()} disabled={running}><Sparkles/>{running ? "Preparing demo…" : "Create demo workflow"}<ArrowRight/></button>
        <p className="video-generation-message" role="status">{message}</p>
        <div className="video-provider-status"><Check/><span>No paid generation · No video rendered</span></div>
      </footer>
    </aside>

    <div className="video-creations">
      <header className="video-feed-toolbar">
        <nav aria-label="Video Studio views">
          <button type="button" className={tab === "creations" ? "active" : ""} onClick={() => setTab("creations")}><Clapperboard/>Creations</button>
          <button type="button" className={tab === "templates" ? "active" : ""} onClick={() => setTab("templates")}><Grid2X2/>My templates</button>
          <button type="button" className={tab === "guide" ? "active" : ""} onClick={() => setTab("guide")}><BookOpen/>Guide</button>
        </nav>
        <div className="video-feed-tools">
          <button type="button" className={favoritesOnly ? "active" : ""} aria-label="Show favorite videos" aria-pressed={favoritesOnly} title="Favorites" onClick={() => setFavoritesOnly(active => !active)}><Heart/></button>
          <button type="button" aria-label="Change video layout" title="Switch layout" onClick={() => setCompact(active => !active)}>{compact ? <Grid2X2/> : <LayoutList/>}<span>Layout</span></button>
          <div className="video-filter-wrap"><button type="button" className={filterOpen || filter !== "all" ? "active" : ""} aria-label="Filter videos" aria-expanded={filterOpen} onClick={() => setFilterOpen(active => !active)}><ListFilter/><span>Filters</span></button>{filterOpen && <div className="video-filter-panel"><label htmlFor="video-filter-aspect">Aspect ratio</label><select id="video-filter-aspect" value={filter} onChange={event => setFilter(event.target.value)}><option value="all">All ratios</option><option>16:9</option><option>9:16</option><option>1:1</option><option>4:5</option></select><button onClick={() => {setFilter("all");setFilterOpen(false);}}>Done</button></div>}</div>
          <label className="video-search"><Search/><input aria-label="Search video creations" placeholder="Search…" value={query} onChange={event => setQuery(event.target.value)}/></label>
        </div>
      </header>

      {tab === "creations" ? <>
        <div className="video-gallery-heading"><div><span>YOUR WORKSPACE</span><h2>Creative history</h2><p>Draft and review your motion ideas in one place.</p></div><div className="video-history-count"><Video/><strong>{creations.length}</strong><span>Demo {creations.length === 1 ? "record" : "records"}</span></div></div>
        {visible.length ? <div className={`video-feed ${compact ? "compact" : ""}`}>
          {visible.map((item) => <article className="video-creation-card" key={item.id}>
            <div className="video-card-header"><p title={item.prompt}>{item.prompt}</p><div className="video-card-badges"><span>{item.aspect}</span><span>{item.duration}s</span><time dateTime={item.createdAt}>{displayDate(item.createdAt)}</time></div></div>
            <div className="video-card-media">
              {item.firstFrame ? <img src={item.firstFrame} alt="Private uploaded first frame for demo workflow"/> : <div className="video-demo-art"><span className="video-art-orb"/><Film/><b>YOUR NEXT SCENE</b></div>}
              <div className="video-preview-badge"><Clapperboard/> Workflow preview</div>
              <span className="video-play-disabled" title="No video is available in Demo Mode"><Play/></span>
              <span className="video-demo-watermark">DEMO · NO VIDEO RENDERED</span>
            </div>
            <div className="video-card-info"><span><Clock3/>{item.duration}s · {item.fps} FPS</span><span><SlidersHorizontal/>{item.movement}</span></div>
            <footer className="video-card-footer"><span><i/> Demo completed · Local history</span><div><button type="button" aria-label="Reuse video settings" title="Reuse settings" onClick={() => reuse(item)}><Copy/></button><button type="button" className={item.favorite ? "active" : ""} aria-label={item.favorite ? "Remove video favorite" : "Favorite video"} onClick={() => setCreations(items => items.map(record => record.id === item.id ? {...record, favorite: !record.favorite} : record))}><Heart/></button><button type="button" aria-label="Delete demo record" title="Delete demo record" onClick={() => { if (window.confirm("Delete this local demo record?")) setCreations(items => items.filter(record => record.id !== item.id)); }}><Trash2/></button></div></footer>
          </article>)}
        </div> : <div className="video-empty-state"><div className="video-empty-icon"><Clapperboard/></div><span>VIDEO CREATION SPACE</span><h3>{creations.length ? "No results match your filters" : "Turn your next idea into motion"}</h3><p>{creations.length ? "Try another search, filter or favorites view." : "Choose your frames, describe the movement, and create your first demo workflow. Actual video generation is not yet enabled."}</p><button type="button" onClick={() => {setTab("creations");setFilter("all");setQuery("");setFavoritesOnly(false);promptRef.current?.focus();}}><Sparkles/>{creations.length ? "Clear filters" : "Start with a prompt"}</button></div>}
      </> : <div className="video-empty-state"><div className="video-empty-icon">{tab === "templates" ? <Grid2X2/> : <BookOpen/>}</div><span>PRIVATE BETA</span><h3>{tab === "templates" ? "Your video templates are coming" : "Video direction guide"}</h3><p>{tab === "templates" ? "Reusable motion presets will arrive when provider integrations are enabled." : "For realistic results describe who moves, how the camera moves, and what stays consistent between the first and last frame."}</p><button type="button" onClick={() => setTab("creations")}>Back to creations</button></div>}
      <div className="video-gallery-footnote"><Info/> Preview history stays on this browser. Your existing Studio Canvas and uploaded private assets are separate.</div>
    </div>
  </section>;
}
