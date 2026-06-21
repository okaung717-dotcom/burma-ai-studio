const links = [
  ["Main Control", "/admin6996"],
  ["Chat Inbox", "/admin6996/chat"],
  ["Analytics", "/admin6996/analytics"],
  ["Operations", "/admin6996/ops"],
  ["Content Control", "/admin6996/content"],
  ["Portfolio", "/portfolio"],
];

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-[#fff9f0] px-5 py-10 text-[#1a0b0e] dark:bg-[#100708] dark:text-[#fff7eb]">
      <section className="mx-auto max-w-3xl rounded-[2rem] border border-[#be9537]/25 bg-white p-6 shadow-xl dark:bg-[#1a0b0e]">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#911923] dark:text-[#e3bc61]">Burma AI Studio</p>
        <h1 className="mt-3 text-3xl font-black">Admin Tools</h1>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="rounded-2xl border border-[#be9537]/25 bg-[#fff9f0] p-5 font-black text-[#911923] transition hover:-translate-y-1 dark:bg-[#100708] dark:text-[#e3bc61]">{label}</a>
          ))}
        </div>
      </section>
    </main>
  );
}
