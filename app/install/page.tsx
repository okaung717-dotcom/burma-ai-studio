export const metadata = {
  title: "Install Burma AI Studio App",
  description: "Download and install the Burma AI Studio Android app or get iOS TestFlight access.",
};

const nativeInstallOptions = [
  {
    title: "Android Native App",
    label: "APK Download",
    description:
      "Download the Burma AI Studio Android APK directly. After download, open the APK and tap Install. Some Android phones may show a security scan before installing.",
    href: "/downloads/burma-ai-studio.apk",
    cta: "Download APK",
    enabled: true,
    icon: "🤖",
  },
  {
    title: "iOS Native App",
    label: "TestFlight",
    description:
      "iPhone installation requires an Xcode build uploaded to App Store Connect. The TestFlight link will be added here after Apple setup is completed.",
    href: "#ios-testflight-coming-soon",
    cta: "iOS TestFlight Coming Soon",
    enabled: false,
    icon: "📱",
  },
];

const browserInstallSteps = [
  {
    title: "Android Browser Shortcut",
    label: "Chrome / Browser",
    detail: "Open burmaaistudio.com in Chrome, tap the three-dot menu, then choose Add to Home screen or Install app.",
  },
  {
    title: "iPhone Browser Shortcut",
    label: "Safari",
    detail: "Open burmaaistudio.com in Safari, tap Share, then choose Add to Home Screen.",
  },
  {
    title: "Desktop Shortcut",
    label: "Chrome / Edge",
    detail: "Open burmaaistudio.com, click the install icon in the address bar, then confirm Install.",
  },
];

const developerInstallSteps = [
  {
    title: "Android Studio Project",
    badge: "Android Developer",
    steps: [
      "Open the Burma AI Studio Android project in Android Studio.",
      "Wait until Gradle sync finishes without errors.",
      "Connect an Android phone with USB debugging enabled, or choose an Android Emulator.",
      "Click Run ▶ and select the target device.",
      "Use Build → Build Bundle(s) / APK(s) → Build APK(s) to generate a new APK.",
      "Upload the new APK to public/downloads/burma-ai-studio.apk when you want to update the download file.",
    ],
    note: "The current Android APK is already connected to the Download APK button above.",
  },
  {
    title: "Xcode / TestFlight Project",
    badge: "iOS Developer",
    steps: [
      "Open the iOS project in Xcode after creating/syncing the iOS native project.",
      "Choose your Apple Developer Team under Signing & Capabilities.",
      "Connect an iPhone or choose an iOS Simulator for testing.",
      "Archive the build and upload it to App Store Connect.",
      "Enable TestFlight and copy the public tester link.",
      "Replace the iOS button link on this page with the TestFlight URL.",
    ],
    note: "iOS direct APK-style install is not available. iPhone users need TestFlight or App Store distribution.",
  },
];

export default function InstallPage() {
  return (
    <main className="min-h-screen bg-[#fff9f0] px-5 py-10 text-[#1a0b0e] dark:bg-[#100708] dark:text-[#fff7eb] md:py-20">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-[2rem] border border-[#be9537]/25 bg-[#100708] p-6 text-[#fff7eb] shadow-2xl shadow-[#100708]/10 md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#e3bc61]">Native Mobile App</p>
          <h1 className="mt-3 text-3xl font-black md:text-5xl">Access the Burma AI Studio Mobile App</h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#f3dfc1]">
            Android users can download and install the APK directly. iOS users will use TestFlight after the Xcode/App Store Connect setup is completed.
          </p>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {nativeInstallOptions.map((option) => (
              <article key={option.title} className="rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-5 md:p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#e3bc61]">{option.label}</p>
                <h2 className="mt-3 text-2xl font-black text-white">{option.icon} {option.title}</h2>
                <p className="mt-3 min-h-20 text-sm leading-relaxed text-[#f3dfc1]">{option.description}</p>
                <a
                  href={option.href}
                  download={option.enabled ? true : undefined}
                  aria-disabled={!option.enabled}
                  className={
                    option.enabled
                      ? "mt-6 inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-4 text-sm font-black text-[#100708] shadow-xl shadow-black/20 transition hover:scale-[1.01]"
                      : "mt-6 inline-flex w-full cursor-not-allowed items-center justify-center rounded-full border border-white/10 bg-white/10 px-6 py-4 text-sm font-black text-white/55"
                  }
                >
                  {option.cta}
                </a>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#be9537]/25 bg-white p-6 shadow-2xl shadow-[#100708]/10 dark:bg-[#1a0b0e] md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#911923] dark:text-[#e3bc61]">Browser Shortcut Option</p>
          <h2 className="mt-3 text-2xl font-black md:text-4xl">Install as Home Screen Shortcut</h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#6b7280] dark:text-[#d8c4a3] md:text-base">
            This is the browser shortcut method. It is different from the native Android APK download above.
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

        <div className="rounded-[2rem] border border-[#be9537]/25 bg-[#100708] p-6 text-[#fff7eb] shadow-2xl shadow-[#100708]/10 md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#e3bc61]">Developer Build Guide</p>
          <h2 className="mt-3 text-2xl font-black md:text-4xl">Android Studio & Xcode Installation</h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#f3dfc1] md:text-base">
            This section is for developer/testing installation and app updates.
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
            The Android APK button downloads the current test APK. For a production public release, create a signed release APK or publish through Google Play. iOS distribution requires TestFlight or the App Store.
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
