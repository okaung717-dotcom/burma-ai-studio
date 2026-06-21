const links = [
  ["Tools", "/admin6996/tools"],
  ["Main", "/admin6996"],
  ["Inbox", "/admin6996#messages"],
  ["Chat", "/admin6996/chat"],
  ["Analytics", "/admin6996/analytics"],
  ["Ops", "/admin6996/ops"],
  ["Content", "/admin6996/content"],
  ["Backup", "/admin6996/backup"],
  ["Portfolio", "/admin6996/portfolio"],
];

export default function Admin6996Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        body:has(.bas-admin-area) > div nav:not(.bas-admin-menu),
        body:has(.bas-admin-area) nav:not(.bas-admin-menu):has(a[href="/"]) {
          display: none !important;
        }
      `}</style>
      <div className="bas-admin-area">
        <nav className="bas-admin-menu relative z-10 border-b border-[#be9537]/25 bg-[#fff9f0] px-4 py-3 shadow-sm dark:bg-[#100708]">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2">
            <a href="/admin6996/tools" className="mr-2 rounded-full bg-[#be9537] px-4 py-2 text-sm font-black text-[#100708]">Admin Tools</a>
            {links.map(([label, href]) => (
              <a key={href} href={href} className="rounded-full border border-[#be9537]/35 bg-white/60 px-3 py-2 text-xs font-bold text-[#911923] hover:bg-[#fff3e3] dark:border-white/10 dark:bg-white/5 dark:text-white/85 dark:hover:bg-white/10">{label}</a>
            ))}
            <a href="/" className="ml-auto rounded-full border border-[#be9537]/35 bg-white/60 px-3 py-2 text-xs font-bold text-[#911923] hover:bg-[#fff3e3] dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10">View Site</a>
          </div>
        </nav>
        {children}
      </div>
    </>
  );
}
