export const metadata = {
  title: "Install Burma AI Studio App",
  description: "Install Burma AI Studio on Android with APK or on iOS with Mobile Config.",
};

const mobileInstallOptions = [
  {
    title: "Android Native App",
    label: "Android APK",
    description:
      "For Android phones. Download the APK, open the downloaded file, allow install if Android asks, then tap Install.",
    href: "/downloads/burma-ai-studio.apk",
    cta: "Download APK",
    icon: "🤖",
    steps: [
      "Tap Download APK.",
      "Open the downloaded APK file.",
      "Allow install from browser if Android asks.",
      "Tap Install, then Open.",
    ],
  },
  {
    title: "iOS Mobile Config",
    label: "iPhone / iPad Safari Only",
    description:
      "For iOS users. Open this page in Safari, download the Mobile Config profile, install it from Settings, then open Burma AI Studio from the Home Screen icon.",
    href: "/downloads/burma-ai-studio-ios.mobileconfig",
    cta: "Install iOS Config",
    icon: "📱",
    steps: [
      "Open this install page in Safari, not Chrome, Facebook, Telegram, or Messenger browser.",
      "Tap Install iOS Config and allow the profile download.",
      "Open iPhone Settings and tap Profile Downloaded. If you do not see it, go to General > VPN & Device Management.",
      "Tap Burma AI Studio iOS Config > Install > enter passcode > Install.",
      "Open the Burma AI Studio icon from the Home Screen.",
    ],
  },
];

const browserInstallSteps = [
  {
    title: "Android Browser Shortcut",
    label: "Chrome / Browser",
    detail: "Open burmaaistudio.com in Chrome, tap the three-dot menu, then choose Add to Home screen or Install app.",
  },
  {
    title: "iPhone Safari Shortcut",
    label: "Safari Backup",
    detail: "If Mobile Config does not install on a specific iPhone, open burmaaistudio.com in Safari, tap Share, then choose Add to Home Screen.",
  },
  {
    title: "Desktop Shortcut",
    label: "Chrome / Edge",
    detail: "Open burmaaistudio.com, click the install icon in the address bar, then confirm Install.",
  },
];

export default function InstallPage() {
  return (
    <main className="min-h-screen bg-[#fff9f0] px-5 py-10 text-[#1a0b0e] dark:bg-[#100708] dark:text-[#fff7eb] md:py-20">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-[2rem] border border-[#be9537]/25 bg-[#100708] p-6 text-[#fff7eb] shadow-2xl shadow-[#100708]/10 md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#e3bc61]">Mobile App Install</p>
          <h1 className="mt-3 text-3xl font-black md:text-5xl">Install Burma AI Studio on Your Phone</h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#f3dfc1]">
            Android users can install the native APK. iPhone and iPad users must open this page in Safari to install the iOS Mobile Config profile.
          </p>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {mobileInstallOptions.map((option) => (
              <article key={option.title} className="rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-5 md:p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#e3bc61]">{option.label}</p>
                <h2 className="mt-3 text-2xl font-black text-white">{option.icon} {option.title}</h2>
                <p className="mt-3 min-h-20 text-sm leading-relaxed text-[#f3dfc1]">{option.description}</p>
                <a
                  href={option.href}
                  className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-4 text-sm font-black text-[#100708] shadow-xl shadow-black/20 transition hover:scale-[1.01]"
                >
                  {option.cta}
                </a>

                <ol className="mt-5 space-y-2">
                  {option.steps.map((step, index) => (
                    <li key={step} className="flex gap-3 text-xs font-bold leading-relaxed text-[#f3dfc1]">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#911923] text-[10px] font-black text-white">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#be9537]/25 bg-white p-6 shadow-2xl shadow-[#100708]/10 dark:bg-[#1a0b0e] md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#911923] dark:text-[#e3bc61]">Backup Option</p>
          <h2 className="mt-3 text-2xl font-black md:text-4xl">Browser Shortcut Install</h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#6b7280] dark:text-[#d8c4a3] md:text-base">
            This is the browser shortcut method. Use the Android APK or iOS Mobile Config above for the main phone install flow.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {browserInstallSteps.map((step) => (
              <article key={step.title} className="rounded-[1.5rem] border border-[#be9537]/20 bg-[#fff9f0] p-5 dark:bg-[#100708]">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#be9537]">{step.label}</p>
                <h3 className="mt-2 text-lg font-black text-[#911923] dark:text-[#e3bc61]">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#4b5563] dark:text-[#d8c4a3]">{step.detail}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-[#be9537]/25 bg-white p-5 text-sm leading-relaxed text-[#6b7280] dark:bg-[#1a0b0e] dark:text-[#d8c4a3]">
          <h2 className="font-black text-[#911923] dark:text-[#e3bc61]">Important Note</h2>
          <p className="mt-2">
            iOS Mobile Config can only be installed properly from Safari. If the profile installs successfully, it adds a Burma AI Studio Home Screen icon and opens the site in full-screen app mode. If a phone blocks profiles, use the Safari Backup option.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a href="/" className="rounded-full bg-[#911923] px-6 py-3 text-sm font-black text-white">Back to Website</a>
          <a href="/portfolio" className="rounded-full border border-[#be9537]/30 px-6 py-3 text-sm font-black text-[#911923] dark:text-[#e3bc61]">Watch Examples</a>
        </div>
      </section>
    </main>
  );
}
