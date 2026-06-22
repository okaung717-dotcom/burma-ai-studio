const kpis = [
  ["Total Leads", "128", "+18%"],
  ["Chat Threads", "64", "+12%"],
  ["Portfolio Views", "2.4k", "+31%"],
  ["Active Modules", "9", "Live"],
];

const modules = [
  ["Main Control", "Core command center", "/admin6996", "Ready"],
  ["Chat Inbox", "Visitor chat replies", "/admin6996/chat", "Live"],
  ["Analytics", "Traffic intelligence", "/admin6996/analytics", "Tracking"],
  ["Operations", "Lead & chat status", "/admin6996/ops", "Ops"],
  ["Content CMS", "Website text control", "/admin6996/content", "CMS"],
  ["Backup", "Data snapshots", "/admin6996/backup", "Safe"],
  ["Portfolio", "Video manager", "/admin6996/portfolio", "Video"],
  ["Public Preview", "Visitor view", "/portfolio?adminPreview=1", "Preview"],
];

const rows = [
  ["New restaurant video", "Lead", "Hot", "2 min ago"],
  ["AI presenter question", "Chat", "Unread", "8 min ago"],
  ["Portfolio update", "CMS", "Saved", "18 min ago"],
  ["Traffic from Facebook", "Analytics", "Rising", "32 min ago"],
  ["Backup snapshot", "System", "Ready", "Today"],
];

const bars = [70, 54, 86, 42, 76, 61, 93];

export default function ToolsPage() {
  return (
    <main className="space-y-5">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map(([label, value, change]) => (
          <div key={label} className="rounded-[1.5rem] border border-[#be9537]/20 bg-white p-5 shadow-sm dark:bg-[#1a0b0e]">
            <div className="flex items-start justify-between">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-gray-500 dark:text-[#d8c4a3]">{label}</p>
              <span className="rounded-full bg-[#fff3e3] px-3 py-1 text-xs font-black text-[#911923] dark:bg-[#100708] dark:text-[#e3bc61]">{change}</span>
            </div>
            <p className="mt-4 text-4xl font-black text-[#1a0b0e] dark:text-white">{value}</p>
            <div className="mt-4 h-2 rounded-full bg-[#f0dfbd] dark:bg-white/10"><div className="h-full w-3/4 rounded-full bg-[#be9537]" /></div>
          </div>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-[2rem] border border-[#be9537]/20 bg-white p-6 shadow-sm dark:bg-[#1a0b0e]">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#911923] dark:text-[#e3bc61]">Revenue / Activity Overview</p>
              <h2 className="mt-2 text-3xl font-black">Backend Performance</h2>
            </div>
            <a href="/admin6996/analytics" className="rounded-full bg-[#be9537] px-4 py-2 text-xs font-black text-[#100708]">View Analytics</a>
          </div>
          <div className="mt-8 h-72 rounded-[1.5rem] bg-[#fff9f0] p-5 dark:bg-[#100708]">
            <div className="flex h-full items-end gap-3">
              {bars.map((bar, index) => (
                <div key={index} className="flex flex-1 flex-col items-center gap-3">
                  <div className="flex h-52 w-full items-end rounded-full bg-white shadow-inner dark:bg-white/5">
                    <div className="w-full rounded-full bg-gradient-to-t from-[#911923] to-[#be9537]" style={{ height: `${bar}%` }} />
                  </div>
                  <span className="text-xs font-black text-gray-400">D{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#be9537]/20 bg-[#100708] p-6 text-white shadow-xl">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#e3bc61]">Task Flow</p>
          <h2 className="mt-2 text-3xl font-black">System Status</h2>
          <div className="mx-auto mt-7 flex h-52 w-52 items-center justify-center rounded-full border-[18px] border-[#be9537] bg-white/5 shadow-2xl">
            <div className="text-center">
              <p className="text-5xl font-black">87%</p>
              <p className="mt-1 text-xs font-black uppercase tracking-[0.2em] text-[#e3bc61]">Healthy</p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {["Redis backend", "Admin session", "Portfolio CMS", "Analytics"].map((item) => <div key={item} className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3"><span className="text-sm font-bold text-white/75">{item}</span><span className="text-xs font-black text-[#e3bc61]">Ready</span></div>)}
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-[#be9537]/20 bg-white p-6 shadow-sm dark:bg-[#1a0b0e]">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#911923] dark:text-[#e3bc61]">Quick Modules</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {modules.map(([title, desc, href, badge]) => (
              <a key={href} href={href} className="rounded-[1.25rem] border border-[#be9537]/20 bg-[#fff9f0] p-4 transition hover:-translate-y-1 hover:shadow-lg dark:bg-[#100708]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-black text-[#911923] dark:text-[#e3bc61]">{title}</p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-[#d8c4a3]">{desc}</p>
                  </div>
                  <span className="rounded-full bg-white px-2 py-1 text-[10px] font-black text-[#911923] dark:bg-[#1a0b0e] dark:text-[#e3bc61]">{badge}</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#be9537]/20 bg-white p-6 shadow-sm dark:bg-[#1a0b0e]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#911923] dark:text-[#e3bc61]">Recent Operations</p>
              <h2 className="mt-2 text-2xl font-black">Activity Table</h2>
            </div>
            <a href="/admin6996/backup" className="rounded-full border border-[#be9537]/30 px-4 py-2 text-xs font-black text-[#911923] dark:text-[#e3bc61]">Backup</a>
          </div>
          <div className="mt-5 overflow-hidden rounded-2xl border border-[#be9537]/15">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#fff3e3] text-xs uppercase tracking-[0.16em] text-[#911923] dark:bg-[#100708] dark:text-[#e3bc61]"><tr><th className="px-4 py-3">Item</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Time</th></tr></thead>
              <tbody className="divide-y divide-[#be9537]/15">
                {rows.map(([item, type, status, time]) => (
                  <tr key={item} className="text-gray-600 dark:text-[#d8c4a3]"><td className="px-4 py-3 font-bold text-[#1a0b0e] dark:text-white">{item}</td><td className="px-4 py-3">{type}</td><td className="px-4 py-3"><span className="rounded-full bg-[#fff3e3] px-3 py-1 text-xs font-black text-[#911923] dark:bg-[#100708] dark:text-[#e3bc61]">{status}</span></td><td className="px-4 py-3">{time}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
