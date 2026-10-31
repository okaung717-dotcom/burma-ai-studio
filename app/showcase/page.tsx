import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight, Boxes, Clapperboard, Film, Folder, Grid2X2, ImageIcon, Layers3,
  Library, LockKeyhole, MonitorPlay, Play, Search, Settings, ShieldCheck,
  SlidersHorizontal, Sparkles, UserRound, WandSparkles, Workflow
} from "lucide-react";
import "./showcase.css";

export const metadata: Metadata = {
  title: "Explore the Studio",
  description: "Public read-only tour of the Burma AI Studio creative workspace. No account or private media required.",
};

const pages = [
  { slug: "studio", title: "Studio", icon: Boxes, subtitle: "Your creative workspace" },
  { slug: "image", title: "Image Studio", icon: ImageIcon, subtitle: "Still-image production" },
  { slug: "video", title: "Video Studio", icon: Clapperboard, subtitle: "Cinematic motion workflows" },
  { slug: "director", title: "AI Director", icon: WandSparkles, subtitle: "Scene direction and planning" },
  { slug: "assets", title: "Assets Library", icon: Library, subtitle: "Organize creative resources" },
  { slug: "settings", title: "Settings", icon: Settings, subtitle: "Workspace preferences" },
] as const;
type Tab = (typeof pages)[number]["slug"];

function FlowSample() {
  return <div className="public-flow" aria-label="Sample node-based creative workflow">
    <div className="public-node"><span className="public-node-icon"><ImageIcon size={17}/></span><small>INPUT</small><b>Reference image</b><i>First frame</i></div>
    <div className="public-connector"/><div className="public-node public-node-violet"><span className="public-node-icon"><WandSparkles size={17}/></span><small>PROCESS</small><b>Creative prompt</b><i>Visual direction</i></div>
    <div className="public-connector"/><div className="public-node public-node-teal"><span className="public-node-icon"><Film size={17}/></span><small>OUTPUT</small><b>Video preview</b><i>Storyboard result</i></div>
  </div>;
}

function StudioContent() {
  return <div className="public-content">
    <div className="public-breadcrumb">WORKSPACE / PROJECTS</div>
    <div className="public-heading"><div><h2>My Studios</h2><p>One connected workspace for creative production.</p></div><span className="public-faux-button"><Boxes size={16}/> New Studio</span></div>
    <div className="public-mini-tabs"><span className="active">All Studios</span><span>Recent</span><span>Favorites</span></div>
    <div className="public-card-grid">
      {[
        {name:"Cinematic Storyboard",label:"Motion workflow",kind:"motion"},
        {name:"Character Concepts",label:"Image workflow",kind:"image"},
        {name:"Director's Canvas",label:"Scene planning",kind:"director"},
      ].map((item,i)=><article className="public-project-card" key={item.name}>
        <div className={`public-project-art public-art-${i}`}><span className="public-art-pill">SAMPLE WORKSPACE</span><div className="public-art-mark">{i===0?<Clapperboard/>:i===1?<ImageIcon/>:<WandSparkles/>}</div></div>
        <div className="public-project-info"><b>{item.name}</b><p>{item.label} · Public preview</p></div>
      </article>)}
    </div>
    <div className="public-workflow-panel"><div><b>Connected production workflow</b><p>Visual direction, image concepts, and motion in one creative studio.</p></div><FlowSample/></div>
  </div>;
}

function GeneratorContent({ kind }: {kind:"image"|"video"}) {
  const isVideo=kind==="video";
  return <div className="public-generator">
    <aside className="public-generator-controls">
      <div className="public-control-top"><small>TOOLS / {isVideo?"VIDEO":"IMAGE"}</small><h2>{isVideo?"Video Generator":"Image Generator"}</h2></div>
      <label>MODEL</label><div className="public-field"><Sparkles size={17}/><span>Burma {isVideo?"Video":"Image"} · Demo</span></div>
      {isVideo?<><label>FRAMES</label><div className="public-frame-row"><div><ImageIcon/><span>First frame</span></div><div><ImageIcon/><span>End frame</span></div></div></>:<><label>REFERENCES</label><div className="public-frame-row"><div><ImageIcon/><span>Style</span></div><div><UserRound/><span>Character</span></div></div></>}
      <label>PROMPT</label><div className="public-prompt">Describe your {isVideo?"cinematic movement, shot composition and transitions":"image, composition, lighting and atmosphere"}...</div>
      <label>SETTINGS</label><div className="public-chip-row"><span>16:9</span><span>{isVideo?"5 sec":"2K · High"}</span><span>{isVideo?"24 fps":"1 output"}</span></div>
      <div className="public-disabled-action"><Sparkles size={17}/> Generate · Preview Only</div>
      <small className="public-safe-note"><ShieldCheck size={14}/> No AI requests or payments in public preview.</small>
    </aside>
    <section className="public-generator-feed">
      <div className="public-feed-top"><b>{isVideo?"Video Creations":"Image Creations"}</b><span><Grid2X2 size={15}/> Gallery</span></div>
      <div className="public-preview-gallery">
        <div className="public-preview-large"><div className="public-preview-symbol">{isVideo?<Play size={29}/>:<ImageIcon size={30}/>}</div><strong>{isVideo?"Cinematic motion workflow":"Image creation workflow"}</strong><small>VISUAL EXAMPLE · NO PRIVATE CONTENT</small></div>
        <div className="public-preview-small"><Layers3 size={26}/><b>Reference collection</b><span>Sample layout</span></div>
        <div className="public-preview-small public-preview-third"><Sparkles size={26}/><b>Creative ideas</b><span>Sample layout</span></div>
      </div>
    </section>
  </div>;
}

function DirectorContent() {
  return <div className="public-content">
    <div className="public-breadcrumb">CREATIVE TOOLS / AI DIRECTOR</div><div className="public-heading"><div><h2>AI Director</h2><p>Plan camera movement, scene continuity and visual storytelling.</p></div><span className="public-faux-button">Scene canvas</span></div>
    <div className="public-director-main"><div className="public-director-head"><span><Workflow size={17}/> Storyboard flow</span><span><SlidersHorizontal size={17}/> Visual planning</span></div><FlowSample/><div className="public-director-footer"><div><b>01 · Establishing shot</b><span>Wide · Atmospheric composition</span></div><div><b>02 · Character detail</b><span>Close-up · Emotional tension</span></div><div><b>03 · Motion transition</b><span>Push-in · Cinematic continuity</span></div></div></div>
  </div>;
}

function AssetsContent() {
  return <div className="public-content">
    <div className="public-breadcrumb">WORKSPACE / ASSETS LIBRARY</div><div className="public-heading"><div><h2>Assets Library</h2><p>Every reference and production asset, organized in one place.</p></div><span className="public-faux-button"><Folder size={16}/> Collections</span></div>
    <div className="public-asset-layout"><aside><b>LIBRARY</b><span className="chosen"><Grid2X2 size={16}/> All Assets</span><span><ImageIcon size={16}/> Images</span><span><Clapperboard size={16}/> Videos</span><span><Folder size={16}/> Collections</span></aside><div><div className="public-assets-toolbar"><span><Search size={16}/> Search assets</span><span>Recently added</span></div><div className="public-assets-grid">{["Image references","Motion frames","Scene collection","Character concepts","Storyboard cards","Creative library"].map((name,i)=><article key={name}><div className={`public-asset-art public-art-${i%3}`}>{i%2?<Clapperboard/>:<ImageIcon/>}</div><b>{name}</b><small>Sample category</small></article>)}</div></div></div>
  </div>;
}

function SettingsContent() {
  return <div className="public-content">
    <div className="public-breadcrumb">WORKSPACE / SETTINGS</div><div className="public-heading"><div><h2>Settings</h2><p>A clear, premium control center for your creative workspace.</p></div></div>
    <div className="public-settings-grid"><div className="public-settings-profile"><div className="public-avatar"><UserRound size={25}/></div><div><h3>Account Overview</h3><p>Private profile information is hidden in this public preview.</p><span className="public-tag"><LockKeyhole size={13}/> Private account</span></div></div>
      <div className="public-settings-item"><UserRound/><div><b>Personal information</b><span>Manage your own profile and identity.</span></div><ArrowRight/></div>
      <div className="public-settings-item"><SlidersHorizontal/><div><b>Preferences</b><span>Theme, quality and production defaults.</span></div><ArrowRight/></div>
      <div className="public-settings-item"><ShieldCheck/><div><b>Security & privacy</b><span>Protected sessions and private projects.</span></div><ArrowRight/></div>
      <div className="public-settings-item"><Layers3/><div><b>Asset collections</b><span>Keep your media organized.</span></div><ArrowRight/></div>
    </div>
  </div>;
}

export default async function Showcase({searchParams}:{searchParams:Promise<{view?:string}>}) {
  const requested=(await searchParams).view;
  const view:Tab=pages.find(p=>p.slug===requested)?.slug??"studio";
  const current=pages.find(p=>p.slug===view)!;
  return <main className="public-shell">
    <aside className="public-sidebar"><div className="public-brand"><div className="public-brand-mark">BA</div><div><b>Burma AI Studio</b><small>CINEMATIC AI PRODUCTION</small></div></div>
      <div className="public-sidebar-label">EXPLORE THE PLATFORM</div>
      <nav aria-label="Public preview sections">{pages.map(({slug,title,icon:Icon})=><Link key={slug} href={slug==="studio"?"/showcase":`/showcase?view=${slug}`} aria-current={view===slug?"page":undefined} className={view===slug?"selected":""}><Icon size={18}/><span>{title}</span></Link>)}</nav>
      <div className="public-sidebar-bottom"><span><ShieldCheck size={17}/> PUBLIC VIEW · READ ONLY</span><p>See the interface without exposing accounts, saved projects or media.</p><Link href="/login">Owner sign in <ArrowRight size={15}/></Link></div>
    </aside>
    <div className="public-main"><header className="public-topbar"><div className="public-topcrumb"><span>BURMA AI STUDIO</span><ArrowRight size={14}/><b>{current.title}</b></div><div className="public-top-actions"><span className="public-view-label"><MonitorPlay size={15}/> Public Preview</span><Link href="/login"><LockKeyhole size={15}/> Sign In</Link></div></header>
      <section className="public-main-banner"><div><span><Sparkles size={14}/> EXPLORE THE EXPERIENCE</span><h1>{current.title}</h1><p>{current.subtitle}. This is a read-only sample of the production interface.</p></div><div className="public-banner-ornament"><Sparkles/><i/><i/></div></section>
      <div className="public-stage">{view==="studio"?<StudioContent/>:view==="image"||view==="video"?<GeneratorContent kind={view}/>:view==="director"?<DirectorContent/>:view==="assets"?<AssetsContent/>:<SettingsContent/>}</div>
      <footer className="public-footer"><span>© Burma AI Studio · Public UI Preview</span><span>No login required to explore · Original Studio remains private</span></footer>
    </div>
  </main>;
}
