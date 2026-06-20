import { Video, Mail, Phone, Globe, Send } from "lucide-react";

export default function Contact() {
  return (
    // ၁။ ဒီမှာ bg နဲ့ text ကို dark mode အတွက် ချိန်ပေးလိုက်ပါပြီ
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans selection:bg-[#00C2FF] selection:text-white transition-colors duration-300">
      
      {/* Contact Section */}
      <main className="py-20 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto flex flex-col md:flex-row gap-16">
        
        {/* Left: Contact Info */}
        <div className="md:w-1/2 space-y-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Let's <span className="text-[#00C2FF]">Create</span> <br/>Something Amazing
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
            Ready to elevate your brand with next-gen AI video production? Reach out directly via any of the channels below, and we will get back to you immediately.
          </p>
          
          <div className="space-y-6 pt-4">
            
            {/* Email Link */}
            <a href="mailto:okaung717@gmail.com" className="flex items-center gap-4 group cursor-pointer w-fit">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center group-hover:bg-[#00C2FF]/10 transition-colors"><Mail className="w-5 h-5 text-[#00C2FF]" /></div>
                <div>
                    <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider group-hover:text-[#00C2FF] transition-colors">Email Us</p>
                    <p className="font-bold text-gray-900 dark:text-white">okaung717@gmail.com</p>
                </div>
            </a>

            {/* Phone Link */}
            <a href="tel:09671010011" className="flex items-center gap-4 group cursor-pointer w-fit">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center group-hover:bg-[#00C2FF]/10 transition-colors"><Phone className="w-5 h-5 text-[#00C2FF]" /></div>
                <div>
                    <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider group-hover:text-[#00C2FF] transition-colors">Call Us</p>
                    <p className="font-bold text-gray-900 dark:text-white">09671010011</p>
                </div>
            </a>

            {/* Telegram & Facebook links... (တခြား link တွေလည်း ဒီအတိုင်း bg-gray-900 နဲ့ text-white ထည့်ပါ) */}
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="md:w-1/2 bg-white dark:bg-gray-900 p-8 md:p-12 rounded-3xl shadow-xl shadow-gray-200/20 dark:shadow-none border border-gray-100 dark:border-gray-800">
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">First Name</label>
                    <input type="text" className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00C2FF]/50 transition-all text-gray-900 dark:text-white" placeholder="John" />
                </div>
                {/* တခြား Input တွေလည်း ဒီအတိုင်း dark:bg-gray-950 ထည့်ပါ */}
            </div>
            {/* အောက်က Button လည်း dark မှာ အရောင်ပြောင်းအောင် လုပ်ပေးပါ */}
            <button type="button" className="w-full bg-[#111827] dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-[#00C2FF] transition-colors shadow-lg">
                Send Message
            </button>
          </form>
        </div>

      </main>
    </div>
  );
}