import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Boxes, Clapperboard, ImageIcon, Library, LockKeyhole, MonitorPlay, Settings, ShieldCheck, Sparkles, WandSparkles } from "lucide-react";
import PublicShowcaseContent, {type ShowcaseView} from "./demo-client";
import "./showcase.css";

export const metadata: Metadata = {
 title:"Explore the Studio",
 description:"Interactive public demo of Burma AI Studio. Private account data and paid AI tools are protected.",
};

const pages=[
 {slug:"studio",title:"Studio",icon:Boxes,subtitle:"Your creative workspace"},
 {slug:"image",title:"Image Studio",icon:ImageIcon,subtitle:"Still-image production"},
 {slug:"video",title:"Video Studio",icon:Clapperboard,subtitle:"Cinematic motion workflows"},
 {slug:"director",title:"AI Director",icon:WandSparkles,subtitle:"Scene direction and planning"},
 {slug:"assets",title:"Assets Library",icon:Library,subtitle:"Organize creative resources"},
 {slug:"settings",title:"Settings",icon:Settings,subtitle:"Workspace preferences"},
] as const;

export default async function Showcase({searchParams}:{searchParams:Promise<{view?:string}>}){
 const requested=(await searchParams).view;
 const view:ShowcaseView=pages.find(p=>p.slug===requested)?.slug??"studio";
 const current=pages.find(p=>p.slug===view)!;
 return <main className="public-shell">
  <aside className="public-sidebar">
   <div className="public-brand"><div className="public-brand-mark">BA</div><div><b>Burma AI Studio</b><small>CINEMATIC AI PRODUCTION</small></div></div>
   <div className="public-sidebar-label">EXPLORE THE PLATFORM</div>
   <nav aria-label="Public demo sections">{pages.map(({slug,title,icon:Icon})=><Link key={slug} href={slug==="studio"?"/showcase":`/showcase?view=${slug}`} aria-current={view===slug?"page":undefined} className={view===slug?"selected":""}><Icon size={18}/><span>{title}</span></Link>)}</nav>
   <div className="public-sidebar-bottom"><span><ShieldCheck size={17}/> GUEST DEMO · LOCAL DATA</span><p>The demo is interactive, but it cannot access personal projects, saved media or paid AI providers.</p><Link href="/login">Owner sign in <ArrowRight size={15}/></Link></div>
  </aside>
  <div className="public-main">
   <header className="public-topbar"><div className="public-topcrumb"><span>BURMA AI STUDIO</span><ArrowRight size={14}/><b>{current.title}</b></div>
    <div className="public-top-actions"><span className="public-view-label"><MonitorPlay size={15}/> Interactive Demo</span><Link href="/login"><LockKeyhole size={15}/> My Studio / Sign In</Link></div>
   </header>
   <section className="public-main-banner"><div><span><Sparkles size={14}/> EXPLORE THE EXPERIENCE</span><h1>{current.title}</h1><p>{current.subtitle}. Explore safely using demo content, without a private account.</p></div><div className="public-banner-ornament"><Sparkles/><i/><i/></div></section>
   <div className="public-stage"><PublicShowcaseContent view={view}/></div>
   <footer className="public-footer"><span>© Burma AI Studio · Interactive Guest Demo</span><span>Personal Studio requires sign in · Private data is protected</span></footer>
  </div>
 </main>;
}
