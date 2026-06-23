import ChatInboxRead from "./ChatInboxRead";

export default function Admin6996ChatPage() {
  return (
    <main className="space-y-6">
      <section className="rounded-[2rem] border border-[#be9537]/20 bg-[#100708] p-6 text-white shadow-xl">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#e3bc61]">Chat Inbox</p>
        <h2 className="mt-3 text-4xl font-black">AI Assistant Conversations</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/65">Visitor chatbot messages load automatically from real website data. No ADMIN_CONTROL code needed.</p>
      </section>
      <section className="overflow-hidden rounded-[2rem] border border-[#be9537]/20 bg-white shadow-sm dark:bg-[#1a0b0e]">
        <ChatInboxRead />
      </section>
    </main>
  );
}
