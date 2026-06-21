const links = [
  ["Tools", "/admin6996/tools"],
  ["Main", "/admin6996"],
  ["Inbox", "/admin6996#messages"],
  ["Chat", "/admin6996/chat"],
  ["Analytics", "/admin6996/analytics"],
  ["Ops", "/admin6996/ops"],
  ["Content", "/admin6996/content"],
  ["Backup", "/admin6996/backup"],
  ["Portfolio", "/portfolio"],
];

export default function Admin6996Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-[#be9537]/25 bg-[#fff9f0]/95 px-4 py-3 text-[#1a0b0e] shadow-xl backdrop-blur dark:bg-[#100708]/95 dark:text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2">
          <a href="/admin6996/tools" className="mr-2 rounded-full bg-[#be9537] px-4 py-2 text-sm font-black text-[#100708] shadow-sm">Admin Tools</a>
          {links.map(([label, href]) => (
            <a key={href} href={href} className="rounded-full border border-[#be9537]/35 bg-white/60 px-3 py-2 text-xs font-bold text-[#911923] transition hover:bg-[#fff3e3] hover:text-[#1a0b0e] dark:border-white/10 dark:bg-white/5 dark:text-white/85 dark:hover:bg-white/10 dark:hover:text-white">{label}</a>
          ))}
          <a href="/" className="ml-auto rounded-full border border-[#be9537]/35 bg-white/60 px-3 py-2 text-xs font-bold text-[#911923] transition hover:bg-[#fff3e3] hover:text-[#1a0b0e] dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white">View Site</a>
        </div>
      </nav>
      {children}
    </>
  );
}
