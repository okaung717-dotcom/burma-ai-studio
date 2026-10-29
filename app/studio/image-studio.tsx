"use client";
/* eslint-disable @next/next/no-img-element -- local reference previews use browser data URLs */

import { useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, ChevronDown, FileImage, Grid2X2, Heart, ImageIcon, LayoutList, ListFilter, Minus, Plus, Search, Settings2, Sparkles, Star, UserRound, X } from "lucide-react";

type Reference = { id: string; name: string; role: "Style" | "Character" | "Reference"; preview: string };
type Creation = { id: string; prompt: string; aspect: string; quality: string; createdAt: string; preview?: string; favorite?: boolean };

const STORAGE_KEY = "bas-image-studio-demo-v1";

export default function ImageStudio() {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("Burma Image · Demo");
  const [quantity, setQuantity] = useState(1);
  const [aspect, setAspect] = useState("16:9");
  const [quality, setQuality] = useState("2K · High");
  const [references, setReferences] = useState<Reference[]>([]);
  const [creations, setCreations] = useState<Creation[]>([]);
  const [tab, setTab] = useState<"creations" | "templates" | "academy">("creations");
  const [query, setQuery] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [compact, setCompact] = useState(false);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState("Demo Mode creates workflow records only. No paid provider is contacted.");
  const uploadRole = useRef<Reference["role"]>("Reference");
  const uploadRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") as { creations?: Creation[]; references?: Reference[] } | null;
      queueMicrotask(() => { setCreations(stored?.creations || []); setReferences(stored?.references || []); });
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ creations, references }));
  }, [creations, references]);

  const visible = useMemo(() => creations.filter(item => (!favoritesOnly || item.favorite) && item.prompt.toLowerCase().includes(query.toLowerCase())), [creations, favoritesOnly, query]);
  const chooseReference = (role: Reference["role"]) => { uploadRole.current = role; uploadRef.current?.click(); };
  const addReference = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 15_000_000) { setMessage("Choose an image smaller than 15 MB."); return; }
    const reader = new FileReader();
    reader.onload = () => setReferences(items => [...items, { id: crypto.randomUUID(), name: file.name, role: uploadRole.current, preview: String(reader.result) }].slice(-14));
    reader.readAsDataURL(file);
  };
  const generate = async () => {
    const clean = prompt.trim();
    if (clean.length < 3) { setMessage("Write at least three characters before generating."); return; }
    setRunning(true); setMessage("Preparing a safe Demo Mode record…");
    try {
      const response = await fetch("/api/studio/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "image", prompt: clean, requestId: crypto.randomUUID() }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Demo generation could not be completed.");
      const records = Array.from({ length: quantity }, () => ({ id: crypto.randomUUID(), prompt: clean, aspect, quality, createdAt: result.createdAt, preview: references.at(-1)?.preview }));
      setCreations(items => [...records, ...items].slice(0, 40));
      setMessage("Demo workflow completed. No provider was contacted and no paid image was generated.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Demo generation could not be completed."); }
    finally { setRunning(false); }
  };

  return <section className="image-studio" aria-labelledby="image-studio-title">
    <aside className="image-controls">
      <header><div><span>Tools / Image</span><h1 id="image-studio-title">Image Generator</h1></div><button type="button" title="Image Studio settings" aria-label="Image Studio settings"><Settings2/></button></header>
      <div className="image-control-section"><label htmlFor="image-model">MODEL</label><div className="image-select"><Sparkles/><select id="image-model" value={model} onChange={event => setModel(event.target.value)}><option>Burma Image · Demo</option><option>Gemini Image · Locked</option></select><ChevronDown/></div></div>
      <div className="image-control-section"><div className="image-section-label"><label>REFERENCES</label><span>{references.length}/14</span></div><div className="image-reference-actions"><button type="button" onClick={() => chooseReference("Style")}><Star/><span>Style</span></button><button type="button" onClick={() => chooseReference("Character")}><UserRound/><span>Character</span></button><button type="button" onClick={() => chooseReference("Reference")}><Plus/><span>Add</span></button></div><input ref={uploadRef} hidden type="file" accept="image/*" onChange={event => addReference(event.target.files?.[0])}/>{references.length > 0 && <div className="image-reference-list">{references.map(item => <figure key={item.id}><img src={item.preview} alt=""/><figcaption>{item.role}</figcaption><button type="button" aria-label={`Remove ${item.name}`} onClick={() => setReferences(items => items.filter(ref => ref.id !== item.id))}><X/></button></figure>)}</div>}</div>
      <div className="image-control-section image-prompt"><label htmlFor="image-prompt">PROMPT</label><textarea id="image-prompt" value={prompt} onChange={event => setPrompt(event.target.value)} placeholder="Describe your image, composition, lighting, lens and atmosphere…" maxLength={4000}/><span>{prompt.length}/4000</span></div>
      <div className="image-generation-controls"><div className="quantity-control" aria-label="Image quantity"><button type="button" onClick={() => setQuantity(value => Math.max(1, value - 1))} aria-label="Decrease quantity"><Minus/></button><b>{quantity}</b><button type="button" onClick={() => setQuantity(value => Math.min(4, value + 1))} aria-label="Increase quantity"><Plus/></button></div><label><span className="sr-only">Aspect ratio</span><select value={aspect} onChange={event => setAspect(event.target.value)}><option>16:9</option><option>1:1</option><option>4:5</option><option>9:16</option></select></label><label><span className="sr-only">Quality</span><select value={quality} onChange={event => setQuality(event.target.value)}><option>2K · High</option><option>1K · Standard</option></select></label></div>
      <button className="image-generate" type="button" onClick={generate} disabled={running}><Sparkles/>{running ? "Creating demo…" : "Generate in Demo Mode"}</button><p className="image-demo-message" role="status">{message}</p>
    </aside>
    <div className="image-creations">
      <header className="image-feed-toolbar"><nav aria-label="Image Studio views"><button className={tab === "creations" ? "active" : ""} onClick={() => setTab("creations")}><ImageIcon/>Creations</button><button className={tab === "templates" ? "active" : ""} onClick={() => setTab("templates")}><FileImage/>My templates</button><button className={tab === "academy" ? "active" : ""} onClick={() => setTab("academy")}><BookOpen/>Academy</button></nav><div><button className={favoritesOnly ? "active" : ""} onClick={() => setFavoritesOnly(value => !value)} aria-label="Show favorites"><Heart/></button><button onClick={() => setCompact(value => !value)} aria-label="Change layout">{compact ? <Grid2X2/> : <LayoutList/>}<span>Layout</span></button><button disabled title="Filters are limited in Demo Mode"><ListFilter/><span>Filters</span></button><label><Search/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search creations" aria-label="Search creations"/></label></div></header>
      {tab !== "creations" ? <div className="image-empty"><Sparkles/><h2>{tab === "templates" ? "Templates are coming to private beta" : "Academy lessons are being prepared"}</h2><p>This section is intentionally unavailable in Demo Mode.</p><button onClick={() => setTab("creations")}>Return to creations</button></div> : visible.length === 0 ? <div className="image-empty"><ImageIcon/><h2>{creations.length ? "No creations match this view" : "Your creation feed starts here"}</h2><p>Write a prompt and generate a clearly labeled local Demo Mode record. Paid image generation remains locked.</p><button onClick={() => document.getElementById("image-prompt")?.focus()}>Write a prompt</button></div> : <div className={`image-feed ${compact ? "compact" : ""}`}>{visible.map((item, index) => <article className="image-creation-card" key={item.id}><div className="image-creation-copy"><p>{item.prompt}</p><div><span>{item.aspect}</span><span>{item.quality}</span><span>Demo</span><time>{new Date(item.createdAt).toLocaleDateString()}</time></div></div><div className="image-preview">{item.preview ? <img src={item.preview} alt="Uploaded reference used for this demo record"/> : <div className={`demo-art demo-art-${index % 4}`}><Sparkles/><b>DEMO RECORD</b><small>No AI image generated</small></div>}<button type="button" className={item.favorite ? "active" : ""} aria-label="Favorite creation" onClick={() => setCreations(items => items.map(record => record.id === item.id ? { ...record, favorite: !record.favorite } : record))}><Heart/></button></div><footer><span><i/>Demo complete</span><small>No provider contacted</small></footer></article>)}</div>}
    </div>
  </section>;
}
