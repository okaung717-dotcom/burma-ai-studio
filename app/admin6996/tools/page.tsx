const tools = [
  { title: "Main Control", desc: "Messages and portfolio quick manager", href: "/admin6996", metric: "Core" },
  { title: "Chat Inbox", desc: "AI assistant conversations and replies", href: "/admin6996/chat", metric: "Live" },
  { title: "Chat Status Panel", desc: "Open, Replied, Closed, Unread states", href: "/admin6996/chat/state", metric: "Status" },
  { title: "Analytics", desc: "Visitors, sources, devices and video views", href: "/admin6996/analytics", metric: "Data" },
  { title: "Operations", desc: "Lead and chat operational controls", href: "/admin6996/ops", metric: "Ops" },
  { title: "Content Control", desc: "Home, services and contact text CMS", href: "/admin6996/content", metric: "CMS" },
  { title: "Backup Center", desc: "Download business data snapshots", href: "/admin6996/backup", metric: "Safe" },
  { title: "Portfolio Manager", desc: "Publish YouTube portfolio projects", href: "/admin6996/portfolio", metric: "Video" },
  { title: "Public Portfolio Preview", desc: "Preview visitor-facing portfolio page", href: "/portfolio?adminPreview=1", metric: "Preview" },
];

const bars = [92, 78, 64, 86, 55, 73];

export default function ToolsPage() {
  return (
    <main className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[2rem] border border-[#be9537]/20 bg-[#fff9f0] p-6 shadow-sm dark:bg-[#100708]">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#911923] dark:text-[#e3bc61]">Welcome back</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight">Admin Tools</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-500 dark:text-[#d8c4a3]">Professional backend control center for Burma AI Studio. Manage leads, chats, analytics, content, backups, and portfolio from one dashboard workspace.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-[#1a0b0e]"><p className="text-2xl font-black">9</p><p className="text-xs font-bold text-gray-500">Tools</p></div>
            <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-[#1a0b0e]"><p className="text-2xl font-black">24h</p><p className="text-xs font-bold text-gray-500">Session</p></div>
            <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-[#1a0b0e]"><p className="text-2xl font-black">Pro</p><p className="text-xs font-bold text-gray-500">Backend</p></div>
          </div>
        </div>
        <div className="rounded-[2rem] border border-[#be9537]/20 bg-[#100708] p-6 text-white shadow-xl">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#e3bc61]">System Activity</p>
          <div className="mt-5 space-y-3">
            {bars.map((bar, index) => (
              <div key={index}>
                <div className="mb-1 flex justify-between text-xs font-bold text-white/65"><span>Module {index + 1}</span><span>{bar}%</span></div>
                <div className="h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-[#be9537]" style={{ width: `${bar}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <a key={tool.href} href={tool.href} className="group rounded-[1.5rem] border border-[#be9537]/20 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:bg-[#1a0b0e]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-black text-[#911923] dark:text-[#e3bc61]">{tool.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-[#d8c4a3]">{tool.desc}</p>
              </div>
              <span className="rounded-full bg-[#fff3e3] px-3 py-1 text-xs font-black text-[#911923] dark:bg-[#100708] dark:text-[#e3bc61]">{tool.metric}</span>
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-[#be9537]/15 pt-4 text-xs font-black uppercase tracking-[0.18em] text-[#911923] dark:text-[#e3bc61]"><span>Open module</span><span className="transition group-hover:translate-x-1">→</span></div>
          </a>
        ))}
      </section>
    </main>
  );
}
