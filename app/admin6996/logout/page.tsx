"use client";

import { useEffect, useState } from "react";

export default function AdminLogoutPage() {
  const [status, setStatus] = useState("Logging out...");

  useEffect(() => {
    fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    })
      .then(() => {
        setStatus("Logged out. Redirecting...");
        window.location.href = "/admin6996/login";
      })
      .catch(() => setStatus("Logout failed. Please close this tab."));
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#100708] px-5 text-[#fff7eb]">
      <section className="rounded-[2rem] border border-[#be9537]/25 bg-[#1a0b0e] p-7 shadow-2xl">
        <h1 className="text-2xl font-black">{status}</h1>
      </section>
    </main>
  );
}
