const modules = [
  ["Messages", "Review contact form leads", "/admin6996#messages"],
  ["Chat Inbox", "Reply to visitor AI chat threads", "/admin6996/chat"],
  ["Portfolio", "Manage public video portfolio", "/admin6996/portfolio"],
  ["Analytics", "Track visitors and content views", "/admin6996/analytics"],
];

export default function MainControlPage() {
  return (
    <main className="space-y-6">
      <section className="rounded-[2rem] border border-[#be9537]/20 bg-[#100708] p-6 text-white shadow-xl">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#e3bc61]">Main Control</p>
        <h2 className="mt-3 text-4xl font-black">Business Command Center</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/65">A focused overview for your production backend. Jump into leads, chat, analytics, portfolio, content CMS and backup tools.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {[["Live", "Website"], ["Redis", "Backend"], ["Admin", "Protected"], ["CMS", "Ready"]].map(([a, b]) => <div key={a} className="rounded-[1.5rem] border border-[#be9537]/20 bg-white p-5 shadow-sm dark:bg-[#1a0b0e]"><p className="text-2xl font-black text-[#911923] dark:text-[#e3bc61]">{a}</p><p className="text-xs font-bold text-gray-500">{b}</p></div>)}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {modules.map(([title, desc, href]) => (
          <a key={href} href={href} className="rounded-[1.5rem] border border-[#be9537]/20 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:bg-[#1a0b0e]">
            <p className="text-xl font-black text-[#911923] dark:text-[#e3bc61]">{title}</p>
            <p className="mt-2 text-sm text-gray-500 dark:text-[#d8c4a3]">{desc}</p>
            <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-[#911923] dark:text-[#e3bc61]">Open →</p>
          </a>
        ))}
      </section>
    </main>
  );
}
