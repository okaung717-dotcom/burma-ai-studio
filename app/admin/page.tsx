export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#fff9f0] px-6 py-16 text-[#1a0b0e] dark:bg-[#100708] dark:text-[#fff7eb]">
      <section className="mx-auto max-w-5xl rounded-[2rem] border border-[#be9537]/25 bg-white p-8 shadow-xl dark:bg-[#1a0b0e]">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#911923] dark:text-[#e3bc61]">Burma AI Studio</p>
        <h1 className="mt-4 text-4xl font-black">Admin Panel</h1>
        <p className="mt-4 max-w-2xl text-gray-600 dark:text-[#d8c4a3]">This page is reserved for project messages, lead management, client follow-up, and website operations.</p>
      </section>
    </main>
  );
}
