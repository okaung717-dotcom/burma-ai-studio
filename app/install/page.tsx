export const metadata = {
  title: "Install Burma AI Studio App",
  description: "Install Burma AI Studio on Android, iPhone, iPad or desktop for free.",
};

const userInstallSteps = [
  {
    title: "Android Phone",
    label: "Chrome / Browser install",
    detail: "Open burmaaistudio.com in Chrome, tap the three-dot menu, then choose Add to Home screen or Install app.",
  },
  {
    title: "iPhone / iPad",
    label: "Safari install",
    detail: "Open burmaaistudio.com in Safari, tap Share, then choose Add to Home Screen.",
  },
  {
    title: "Desktop",
    label: "Chrome / Edge install",
    detail: "Open burmaaistudio.com, click the install icon in the address bar, then confirm Install.",
  },
];

const developerInstallSteps = [
  {
    title: "Android Studio Install",
    badge: "Android Developer",
    steps: [
      "Download or clone the Burma AI Studio app project source from the developer.",
      "Open Android Studio and choose Open Project.",
      "Wait until Gradle sync finishes without errors.",
      "Connect an Android phone with USB debugging enabled, or choose an Android Emulator.",
      "Click Run ▶ and select the target device.",
      "After installation finishes, open Burma AI Studio from the phone app drawer.",
    ],
    note: "For normal visitors, use the Chrome install method. Android Studio install is for developer build/testing only.",
  },
  {
    title: "Xcode Install",
    badge: "iOS Developer",
    steps: [
      "Download or clone the Burma AI Studio iOS project source from the developer.",
      "Open the .xcodeproj or .xcworkspace file in Xcode on a Mac.",
      "Choose your Team under Signing & Capabilities.",
      "Connect an iPhone or choose an iOS Simulator.",
      "Click Run ▶ and wait for Xcode to build and install the app.",
      "On a real iPhone, trust the developer profile if iOS asks for confirmation.",
    ],
    note: "For normal iPhone users, use Safari Add to Home Screen. Xcode install needs a Mac, Apple Developer setup, and the iOS project source.",
  },
];

export default function InstallPage() {
  return (
    <main className="min-h-screen bg-[#fff9f0] px-5 py-10 text-[#1a0b0e] dark:bg-[#100708] dark:text-[#fff7eb] md:py-20">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-[2rem] border border-[#be9537]/25 bg-white p-6 shadow-2xl shadow-[#100708]/10 dark:bg-[#1a0b0e] md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#911923] dark:text-[#e3bc61]">Free App Version</p>
          <h1 className="mt-3 text-3xl font-black md:text-5xl">Install Burma AI Studio as an App</h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#6b7280] dark:text-[#d8c4a3]">
            Burma AI Studio can be installed on phones like an app. Normal users can install it from the browser home screen, while developers can build and install native versions through Android Studio or Xcode.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {userInstallSteps.map((step) => (
              <article key={step.title} className="rounded-[1.5rem] border border-[#be9537]/20 bg-[#fff9f0] p-5 dark:bg-[#100708]">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#be9537]">{step.label}</p>
                <h2 className="mt-2 text-lg font-black text-[#911923] dark:text-[#e3bc61]">{step.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[#4b5563] dark:text-[#d8c4a3]">{step.detail}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#be9537]/25 bg-[#100708] p-6 text-[#fff7eb] shadow-2xl shadow-[#100708]/10 md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#e3bc61]">Developer Install Guide</p>
          <h2 className="mt-3 text-2xl font-black md:text-4xl">Android Studio & Xcode Installation</h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#f3dfc1] md:text-base">
            This section is for developer/testing installation. It matches the app-download style where Android users can be guided by Android Studio flow and iOS users can be guided by Xcode flow.
          </p>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {developerInstallSteps.map((item) => (
              <article key={item.title} className="rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-5 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-xl font-black text-[#e3bc61]">{item.title}</h3>
                  <span className="rounded-full border border-[#e3bc61]/30 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#f3dfc1]">
                    {item.badge}
                  </span>
                </div>

                <ol className="mt-5 space-y-3">
                  {item.steps.map((step, index) => (
                    <li key={step} className="flex gap-3 text-sm leading-relaxed text-[#f3dfc1]">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#911923] text-xs font-black text-white">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>

                <p className="mt-5 rounded-2xl border border-[#e3bc61]/20 bg-black/20 p-4 text-xs font-bold leading-relaxed text-[#e9d3ad]">
                  {item.note}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-[#be9537]/25 bg-white p-5 text-sm leading-relaxed text-[#6b7280] dark:bg-[#1a0b0e] dark:text-[#d8c4a3]">
          <h2 className="font-black text-[#911923] dark:text-[#e3bc61]">Important Note</h2>
          <p className="mt-2">
            The browser install is available immediately. Android Studio and Xcode installation need the native app source project, developer setup, and device build permission. Play Store or App Store publishing still requires developer accounts and review approval.
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
