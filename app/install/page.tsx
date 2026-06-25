export const metadata = {
  title: "Install Burma AI Studio App",
  description: "Install Burma AI Studio on Android, iPhone, iPad or desktop for free.",
};

const steps = [
  {
    title: "Android Chrome",
    detail: "Open burmaaistudio.com in Chrome, tap the three-dot menu, then choose Add to Home screen or Install app.",
  },
  {
    title: "iPhone / iPad Safari",
    detail: "Open burmaaistudio.com in Safari, tap Share, then choose Add to Home Screen.",
  },
  {
    title: "Desktop Chrome / Edge",
    detail: "Open burmaaistudio.com, click the install icon in the address bar, then confirm Install.",
  },
];

export default function InstallPage() {
  return (
    <main className="min-h-screen bg-[#fff9f0] px-5 py-20 text-[#1a0b0e] dark:bg-[#100708] dark:text-[#fff7eb]">
      <section className="mx-auto max-w-4xl rounded-[2rem] border border-[#be9537]/25 bg-white p-6 shadow-2xl shadow-[#100708]/10 dark:bg-[#1a0b0e] md:p-10">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#911923] dark:text-[#e3bc61]">Free App Version</p>
        <h1 className="mt-3 text-3xl font-black md:text-5xl">Install Burma AI Studio as an App</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#6b7280] dark:text-[#d8c4a3]">
          You can install Burma AI Studio on your phone for free as a web app. It opens like an app from your home screen and uses the live website.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <article key={step.title} className="rounded-[1.5rem] border border-[#be9537]/20 bg-[#fff9f0] p-5 dark:bg-[#100708]">
              <h2 className="text-lg font-black text-[#911923] dark:text-[#e3bc61]">{step.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#4b5563] dark:text-[#d8c4a3]">{step.detail}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 rounded-[1.5rem] border border-[#be9537]/25 bg-[#100708] p-5 text-[#fff7eb]">
          <h2 className="font-black text-[#e3bc61]">Note</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#f3dfc1]">
            This free version does not require Play Store or App Store publishing. Store publishing needs developer accounts and review approval.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="/" className="rounded-full bg-[#911923] px-6 py-3 text-sm font-black text-white">Back to Website</a>
          <a href="/portfolio" className="rounded-full border border-[#be9537]/30 px-6 py-3 text-sm font-black text-[#911923] dark:text-[#e3bc61]">Watch Examples</a>
        </div>
      </section>
    </main>
  );
}
