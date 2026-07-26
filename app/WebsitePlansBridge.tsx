"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WebsitePlansBridge() {
  const router = useRouter();

  useEffect(() => {
    const onClickCapture = (event: MouseEvent) => {
      if (document.body.classList.contains("bas-app-mode")) return;

      const target = event.target instanceof Element ? event.target : null;
      const button = target?.closest<HTMLButtonElement>("#bas-profile-menu button");
      if (!button) return;

      const text = (button.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
      const isUpgradeEntry = text.includes("upgrade plan") || text.includes("plan မြှင့်ရန်");
      if (!isUpgradeEntry) return;

      event.preventDefault();
      event.stopPropagation();
      router.push("/plans");
    };

    document.addEventListener("click", onClickCapture, true);
    return () => document.removeEventListener("click", onClickCapture, true);
  }, [router]);

  return null;
}
