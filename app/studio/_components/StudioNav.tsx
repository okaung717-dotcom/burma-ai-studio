"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Boxes, Clapperboard, ImageIcon, Library, LogOut, Settings, WandSparkles } from "lucide-react";

const items = [
  { href: "/studio/spaces", label: "Studio", icon: Boxes },
  { href: "/studio/image", label: "Image Studio", icon: ImageIcon },
  { href: "/studio/video", label: "Video Studio", icon: Clapperboard },
  { href: "/studio/director", label: "AI Director", icon: WandSparkles },
  { href: "/studio/assets", label: "Assets Library", icon: Library },
  { href: "/studio/settings", label: "Settings", icon: Settings },
] as const;

export default function StudioNav() {
  const pathname = usePathname();
  const router = useRouter();
  async function signOut() {
    await fetch("/api/account/sign-out", { method: "POST" });
    router.replace("/login"); router.refresh();
  }
  return <nav className="studio-primary-nav" aria-label="Studio navigation">
    <div className="studio-nav-brand"><span>BA</span><div><strong>Burma AI Studio</strong><small>PRIVATE WORKSPACE</small></div></div>
    <div className="studio-nav-links">{items.map(({ href, label, icon: Icon }) => <Link aria-label={label} title={label} key={href} href={href} className={pathname === href || (href === "/studio/spaces" && pathname.startsWith("/studio/spaces/")) ? "active" : ""}><Icon/><span>{label}</span></Link>)}</div>
    <button aria-label="Sign out" title="Sign out" onClick={signOut}><LogOut/><span>Sign out</span></button>
  </nav>;
}
