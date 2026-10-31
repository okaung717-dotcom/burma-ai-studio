import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Clapperboard, ImageIcon, Library, Settings, ShieldCheck, Sparkles, WandSparkles } from "lucide-react";
import { getSpacesUser } from "../../lib/spaces-auth";
import StudioNav from "../_components/StudioNav";
import ImageStudio from "../image-studio";
import VideoStudio from "../video-studio";
import DirectorStudio from "../director-studio";
import "../spaces/spaces.css";
import "../studio-system.css";

const sections = {
  image: { title: "Image Studio", eyebrow: "STILL IMAGE WORKFLOWS", description: "Build prompt, reference and enhancement chains with Image Generator nodes.", icon: ImageIcon, action: "Create image workflow" },
  video: { title: "Video Studio", eyebrow: "MOTION WORKFLOWS", description: "Connect frames, direction and motion prompts into controlled video generation flows.", icon: Clapperboard, action: "Create video workflow" },
  director: { title: "AI Director", eyebrow: "CINEMATIC DIRECTION", description: "Develop scenes, camera language, light, continuity and motion prompts before generation.", icon: WandSparkles, action: "Open directing canvas" },
  assets: { title: "Assets Library", eyebrow: "PRIVATE MEDIA", description: "Review local demo outputs now. Private Supabase media becomes available after the approved migration.", icon: Library, action: "Open Studio" },
  settings: { title: "Settings", eyebrow: "PRIVATE BETA CONTROL", description: "Your account uses the existing secure Supabase session. Paid providers remain disabled.", icon: Settings, action: "Back to Studio" },
} as const;

export default async function StudioSection({ params }: { params: Promise<{ section: string }> }) {
  const user = await getSpacesUser();
  if (!user) redirect("/login");
  const { section } = await params;
  const config = sections[section as keyof typeof sections];
  if (!config) notFound();
  const Icon = config.icon;
  return <main className="studio-section-shell"><StudioNav/>{section === "image" ? <ImageStudio/> : section === "video" ? <VideoStudio/> : section === "director" ? <DirectorStudio/> : <section className="studio-section"><header><p>{config.eyebrow}</p><h1>{config.title}</h1><span>{config.description}</span></header><div className="studio-section-stage"><div className="section-glow"><Icon/></div><article><Sparkles/><h2>{section === "settings" ? `Signed in as ${user.displayName}` : `${config.title} is canvas-powered`}</h2><p>{section === "settings" ? user.email : "Start from Studio and add the specialized nodes you need. Demo Mode never contacts a paid provider."}</p><Link href="/studio/spaces">{config.action}</Link></article>{section === "settings" && <aside><ShieldCheck/><div><b>Security status</b><span>Invite-only · Server sessions · Paid generation off</span></div></aside>}</div></section>}</main>;
}
