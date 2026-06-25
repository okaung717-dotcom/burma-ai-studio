export default function AppHeader() {
  return (
    <header className="sticky top-0 z-[9999] border-b border-[#ead9bd] bg-[#fffdf8]/95 px-4 py-3 shadow-sm backdrop-blur-xl md:px-12 lg:px-24">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <a href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#100708] text-xl font-black tracking-[-0.12em] text-[#be9537] ring-1 ring-[#be9537]/40">BA</span>
          <span className="leading-none"><span className="block text-base font-black text-[#1a0b0e]">Burma AI</span><span className="mt-1 block text-[10px] font-black uppercase tracking-[0.22em] text-[#be9537]">Studio</span></span>
        </a>
        <a href="/contact" className="rounded-full bg-[#911923] px-4 py-2.5 text-sm font-black text-white">Message</a>
      </div>
    </header>
  );
}
