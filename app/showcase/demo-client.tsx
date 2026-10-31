"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import Link from "next/link";
import {
 ArrowRight, BookOpen, Boxes, Check, Clapperboard, Film, Folder,
 Grid2X2, Heart, ImageIcon, Layers3, Library, LockKeyhole, Plus,
 Search, Settings, ShieldCheck, SlidersHorizontal, Sparkles, Trash2,
 UserRound, WandSparkles, Workflow
} from "lucide-react";

export type ShowcaseView = "studio" | "image" | "video" | "director" | "assets" | "settings";
type DemoProject = { id:string; name:string; type:"image"|"video"|"director"; favorite:boolean };
type DemoRecord = { id:string; prompt:string; kind:"image"|"video"; aspect:string; date:string };
const initialProjects:DemoProject[]=[
 {id:"sample-storyboard",name:"Cinematic Storyboard",type:"video",favorite:false},
 {id:"sample-characters",name:"Character Concepts",type:"image",favorite:true},
 {id:"sample-director",name:"Director's Canvas",type:"director",favorite:false},
];
const KEY="bas-public-showcase-data-v2";
const iconFor=(kind:DemoProject["type"])=>kind==="image"?<ImageIcon/>:kind==="video"?<Clapperboard/>:<WandSparkles/>;

export default function PublicShowcaseContent({view}:{view:ShowcaseView}) {
 const [ready,setReady]=useState(false);
 const [projects,setProjects]=useState<DemoProject[]>(initialProjects);
 const [records,setRecords]=useState<DemoRecord[]>([]);
 const [projectFilter,setProjectFilter]=useState<"all"|"favorites"|"recent">("all");
 const [prompt,setPrompt]=useState("");
 const [aspect,setAspect]=useState("16:9");
 const [duration,setDuration]=useState("5");
 const [quantity,setQuantity]=useState("1");
 const [kindStatus,setKindStatus]=useState("");
 const [frameName,setFrameName]=useState("");
 const [assetCategory,setAssetCategory]=useState<"all"|"images"|"videos"|"collections">("all");
 const [assetQuery,setAssetQuery]=useState("");
 const [selectedAsset,setSelectedAsset]=useState("");
 const [directorShot,setDirectorShot]=useState("Establishing shot");
 const [directorCamera,setDirectorCamera]=useState("Cinematic push-in");
 const [savedDirector,setSavedDirector]=useState(false);
 const [settingsPanel,setSettingsPanel]=useState("");
 const [quality,setQuality]=useState("High");
 const [notifications,setNotifications]=useState(false);
 const [msg,setMsg]=useState("");
 useEffect(()=>{
  try {
   const raw=localStorage.getItem(KEY);
   if(raw){
    const parsed=JSON.parse(raw);
    if(Array.isArray(parsed.projects))setProjects(parsed.projects.filter((x:DemoProject)=>typeof x?.name==="string").slice(0,25));
    if(Array.isArray(parsed.records))setRecords(parsed.records.filter((x:DemoRecord)=>typeof x?.prompt==="string").slice(0,25));
   }
  }catch{}
  setReady(true);
 },[]);
 useEffect(()=>{
  if(!ready)return;
  try{localStorage.setItem(KEY,JSON.stringify({projects:projects.slice(0,25),records:records.slice(0,25)}));}catch{}
 },[ready,projects,records]);

 const filteredProjects=useMemo(()=>projectFilter==="favorites"?projects.filter(p=>p.favorite):projectFilter==="recent"?[...projects].reverse():projects,[projects,projectFilter]);
 const assets=[{name:"Image references",kind:"images"},{name:"Motion frames",kind:"videos"},{name:"Scene collection",kind:"collections"},{name:"Character concepts",kind:"images"},{name:"Storyboard cards",kind:"videos"},{name:"Creative library",kind:"collections"}];
 const visibleAssets=assets.filter(item=>(assetCategory==="all"||item.kind===assetCategory)&&item.name.toLowerCase().includes(assetQuery.trim().toLowerCase()));

 function newProject(){
  const name=window.prompt("New demo studio name","Untitled Studio")?.trim().slice(0,80);
  if(!name)return;
  setProjects(xs=>[{id:crypto.randomUUID(),name,type:"director",favorite:false},...xs].slice(0,25));
  setMsg("Demo studio created in this browser only. Your private workspace is unchanged.");
 }
 function createRecord(kind:"image"|"video"){
  if(prompt.trim().length<3){setKindStatus("Enter at least three characters in the prompt first.");return;}
  setRecords(xs=>[{id:crypto.randomUUID(),prompt:prompt.trim().slice(0,200),kind,aspect,date:new Date().toLocaleDateString()},...xs].slice(0,25));
  setKindStatus("Demo workflow saved locally. No AI image or video was generated; no paid API was contacted.");
 }
 function frameSelected(e:ChangeEvent<HTMLInputElement>){
  const file=e.target.files?.[0];if(!file)return;
  if(!file.type.startsWith("image/")||file.size>5_000_000){setKindStatus("Please select an image under 5 MB.");return;}
  setFrameName(file.name.slice(0,80));setKindStatus("Demo reference selected locally; nothing uploaded.");
 }
 if(view==="studio")return <section className="public-content">
  <div className="public-breadcrumb">WORKSPACE / PROJECTS</div>
  <div className="public-heading"><div><h2>My Studios</h2><p>Explore example projects or create your own browser-only demo studio.</p></div><button className="public-faux-button" onClick={newProject}><Plus size={16}/> New Demo Studio</button></div>
  <div className="public-mini-tabs">
   {(["all","recent","favorites"] as const).map(key=><button key={key} className={projectFilter===key?"active":""} onClick={()=>setProjectFilter(key)}>{key==="all"?"All Studios":key==="recent"?"Recent":"Favorites"}</button>)}
  </div>
  {msg&&<p className="public-live-note" role="status">{msg}</p>}
  <div className="public-card-grid">
   {filteredProjects.map((item,i)=><article className="public-project-card" key={item.id}>
    <Link href={`/showcase?view=${item.type}`} className={`public-project-art public-art-${i%3}`}><span className="public-art-pill">INTERACTIVE DEMO</span><div className="public-art-mark">{iconFor(item.type)}</div></Link>
    <div className="public-project-info public-project-actions"><Link href={`/showcase?view=${item.type}`}><b>{item.name}</b><p>Open {item.type} demo</p></Link><button aria-label={`${item.favorite?"Unfavorite":"Favorite"} ${item.name}`} onClick={()=>setProjects(xs=>xs.map(p=>p.id===item.id?{...p,favorite:!p.favorite}:p))}><Heart size={17} fill={item.favorite?"currentColor":"none"}/></button>
    {!item.id.startsWith("sample-")&&<button aria-label={`Delete demo ${item.name}`} onClick={()=>setProjects(xs=>xs.filter(p=>p.id!==item.id))}><Trash2 size={16}/></button>}</div>
   </article>)}
  </div>
  {!filteredProjects.length&&<p className="public-live-note">No demo studios here yet. Choose All Studios or create a new one.</p>}
  <div className="public-workflow-panel"><b>Connected production workflow</b><p>Click a node to explore its demo controls.</p>
   <div className="public-flow">{(["image","director","video"] as const).map((kind,i)=><div key={kind} className="public-flow-link"><Link href={`/showcase?view=${kind}`} className="public-node"><span className="public-node-icon">{iconFor(kind)}</span><small>STEP {i+1}</small><b>{kind==="image"?"Reference image":kind==="director"?"Creative direction":"Video preview"}</b><i>Open demo</i></Link>{i<2&&<div className="public-connector"/>}</div>)}</div>
  </div>
 </section>;
 if(view==="image"||view==="video"){
  const isVideo=view==="video";
  const mine=records.filter(r=>r.kind===view);
  return <section className="public-generator">
   <aside className="public-generator-controls">
    <div className="public-control-top"><small>TOOLS / {isVideo?"VIDEO":"IMAGE"}</small><h2>{isVideo?"Video Generator":"Image Generator"}</h2></div>
    <label htmlFor="demo-model">MODEL</label><select className="public-field public-input" id="demo-model" defaultValue="Demo Model"><option>Demo Model</option></select>
    <label htmlFor="demo-frame">{isVideo?"FIRST FRAME · LOCAL ONLY":"REFERENCE · LOCAL ONLY"}</label>
    <label className="public-file-picker" htmlFor="demo-frame"><ImageIcon size={18}/>{frameName||"Select a reference image"}<input id="demo-frame" type="file" accept="image/png,image/jpeg,image/webp" onChange={frameSelected}/></label>
    <label htmlFor="demo-prompt">PROMPT</label><textarea className="public-prompt public-input" id="demo-prompt" value={prompt} onChange={e=>setPrompt(e.target.value)} maxLength={2000} placeholder={`Describe your ${isVideo?"camera movement, cinematic shot and transitions":"image, lighting and scene composition"}...`}/>
    <label htmlFor="demo-aspect">SETTINGS</label><div className="public-select-row"><select id="demo-aspect" className="public-input" value={aspect} onChange={e=>setAspect(e.target.value)}><option>16:9</option><option>9:16</option><option>1:1</option><option>4:5</option></select>
    <select className="public-input" value={isVideo?duration:quantity} aria-label={isVideo?"Duration":"Quantity"} onChange={e=>isVideo?setDuration(e.target.value):setQuantity(e.target.value)}>{(isVideo?["5","8","10"]:["1","2","3","4"]).map(x=><option key={x} value={x}>{isVideo?`${x} seconds`:`${x} output${x==="1"?"":"s"}`}</option>)}</select></div>
    <button className="public-demo-action" onClick={()=>createRecord(view)}><Sparkles size={17}/> Save Demo Workflow</button>
    <small className="public-safe-note"><ShieldCheck size={14}/> This generates a local demo record, not paid AI content.</small>
    {kindStatus&&<p className="public-live-note" role="status">{kindStatus}</p>}
   </aside>
   <div className="public-generator-feed"><div className="public-feed-top"><b>{isVideo?"Video":"Image"} Creations · Demo</b><span><Grid2X2 size={15}/> {mine.length} records</span></div>
    {mine.length?<div className="public-demo-records">{mine.map(r=><div className="public-demo-record" key={r.id}><div><Film size={19}/><b>{r.prompt}</b><small>{r.aspect} · {r.date} · Demo only</small></div><button onClick={()=>setRecords(xs=>xs.filter(x=>x.id!==r.id))} aria-label="Delete demo record"><Trash2 size={16}/></button></div>)}</div>:
    <div className="public-preview-large"><div className="public-preview-symbol">{isVideo?<Clapperboard/>:<ImageIcon/>}</div><strong>{isVideo?"Cinematic motion workflow":"Image production workflow"}</strong><small>WRITE A PROMPT TO CREATE A LOCAL DEMO RECORD</small></div>}
   </div>
  </section>;
 }
 if(view==="director")return <section className="public-content">
  <div className="public-breadcrumb">CREATIVE TOOLS / AI DIRECTOR</div><div className="public-heading"><div><h2>AI Director</h2><p>Explore an editable sample shot plan without affecting private projects.</p></div></div>
  <div className="public-director-main"><div className="public-director-head"><span><Workflow size={17}/> Interactive Scene Plan</span><span><SlidersHorizontal size={17}/> Demo canvas</span></div>
   <div className="public-director-options">{["Establishing shot","Character detail","Motion transition"].map(shot=><button key={shot} className={shot===directorShot?"selected":""} onClick={()=>{setDirectorShot(shot);setSavedDirector(false);}}>{shot}</button>)}</div>
   <div className="public-director-editor"><label htmlFor="demo-camera">Camera movement</label><select className="public-input" id="demo-camera" value={directorCamera} onChange={e=>{setDirectorCamera(e.target.value);setSavedDirector(false);}}><option>Cinematic push-in</option><option>Slow dolly-out</option><option>Tracking shot</option><option>Locked-off wide</option></select><div className="public-scene-preview"><WandSparkles size={35}/><b>{directorShot}</b><span>{directorCamera}</span></div></div>
   <button className="public-demo-action" onClick={()=>setSavedDirector(true)}><Check size={17}/> Save Demo Shot Plan</button>{savedDirector&&<p className="public-live-note">Shot plan preview saved for this visit. Your private storyboard is unchanged.</p>}
  </div>
 </section>;
 if(view==="assets")return <section className="public-content">
  <div className="public-breadcrumb">WORKSPACE / ASSETS LIBRARY</div><div className="public-heading"><div><h2>Assets Library</h2><p>Explore sample categories. No private uploads or assets are visible here.</p></div></div>
  <div className="public-asset-layout"><aside><b>LIBRARY</b>{(["all","images","videos","collections"] as const).map(cat=><button className={assetCategory===cat?"chosen":""} key={cat} onClick={()=>{setAssetCategory(cat);setSelectedAsset("");}}>{cat==="images"?<ImageIcon size={16}/>:cat==="videos"?<Clapperboard size={16}/>:cat==="collections"?<Folder size={16}/>:<Grid2X2 size={16}/>} {cat==="all"?"All Assets":cat[0].toUpperCase()+cat.slice(1)}</button>)}</aside>
  <div><div className="public-assets-toolbar"><label><Search size={16}/><input aria-label="Search sample assets" placeholder="Search sample assets..." value={assetQuery} onChange={e=>setAssetQuery(e.target.value)}/></label><span>{visibleAssets.length} samples</span></div>
   <div className="public-assets-grid">{visibleAssets.map((item,i)=><button className="public-asset-card" key={item.name} onClick={()=>setSelectedAsset(item.name)}><div className={`public-asset-art public-art-${i%3}`}>{item.kind==="videos"?<Clapperboard/>:<ImageIcon/>}</div><b>{item.name}</b><small>{item.kind} · Sample only</small></button>)}</div>
   {!visibleAssets.length&&<p className="public-live-note">No sample assets match this search.</p>}
   {selectedAsset&&<div className="public-asset-selection"><b>{selectedAsset}</b><p>This is a demonstration category, not a private asset. Sign in to access your own projects and media.</p><Link href="/login">Sign in to your Studio <ArrowRight size={15}/></Link></div>}
  </div></div>
 </section>;
 return <section className="public-content">
  <div className="public-breadcrumb">WORKSPACE / SETTINGS</div><div className="public-heading"><div><h2>Settings</h2><p>Try demo preferences. Owner account settings remain protected.</p></div></div>
  <div className="public-settings-grid"><div className="public-settings-profile"><div className="public-avatar"><UserRound size={25}/></div><div><h3>Account Overview</h3><p>Private account details are not exposed in public demo.</p><Link href="/login" className="public-tag"><LockKeyhole size={13}/> Sign in to manage your real account</Link></div></div>
   {[{key:"profile",icon:UserRound,name:"Personal information",description:"Requires the owner account."},{key:"preferences",icon:SlidersHorizontal,name:"Demo Preferences",description:"Adjust sample quality and notifications."},{key:"security",icon:ShieldCheck,name:"Security & privacy",description:"Private data is never exposed to guests."},{key:"collections",icon:Layers3,name:"Asset collections",description:"See the sample library."}].map(({key,icon:Icon,name,description})=><div className="public-settings-wrapper" key={key}>
    <button className="public-settings-item" onClick={()=>setSettingsPanel(x=>x===key?"":key)}><Icon/><div><b>{name}</b><span>{description}</span></div><ArrowRight/></button>
    {settingsPanel===key&&<div className="public-settings-expanded">{key==="preferences"?<><label>Demo quality <select className="public-input" value={quality} onChange={e=>setQuality(e.target.value)}><option>High</option><option>Standard</option></select></label><label className="public-checkbox"><input type="checkbox" checked={notifications} onChange={e=>setNotifications(e.target.checked)}/> Sample notifications on</label><p>Changes affect this demo view only.</p></>:key==="collections"?<Link href="/showcase?view=assets">Open demo Assets Library <ArrowRight size={15}/></Link>:<><p>This area is protected. Guests cannot access real account data or security settings.</p><Link href="/login">Sign in securely <ArrowRight size={15}/></Link></>}</div>}
   </div>)}
  </div>
 </section>;
}
