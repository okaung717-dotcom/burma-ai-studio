// Contact Page Code
import { Video, Mail, MapPin, Phone } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#f9fafb] text-gray-900 font-sans selection:bg-[#00C2FF] selection:text-white">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center py-6 px-6 md:px-12 lg:px-24 gap-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2 font-bold text-xl tracking-wide whitespace-nowrap shrink-0">
          <Video className="text-[#00C2FF] w-6 h-6" />
          Burma AI Studio
        </div>
        <div className="hidden md:flex gap-6 lg:gap-10 text-[13px] font-bold text-gray-500 uppercase tracking-wider">
          <a href="/" className="hover:text-gray-900 transition-colors whitespace-nowrap">Home</a>
          <a href="/services" className="hover:text-gray-900 transition-colors whitespace-nowrap">Services</a>
          <a href="/portfolio" className="hover:text-gray-900 transition-colors whitespace-nowrap">Portfolio</a>
          <a href="/contact" className="text-gray-900 border-b-2 border-[#00C2FF] pb-1 whitespace-nowrap">Contact</a>
        </div>
        <button className="bg-[#00C2FF] text-white px-6 py-2.5 rounded-full font-semibold hover:bg-[#00a8e0] transition-colors shadow-md shadow-cyan-500/30 whitespace-nowrap shrink-0 ml-2 md:ml-4">
          Message Us
        </button>
      </nav>

      {/* Contact Section */}
      <main className="py-20 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto flex flex-col md:flex-row gap-16">
        
        {/* Left: Contact Info */}
        <div className="md:w-1/2 space-y-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#111827] tracking-tight">
            Let's <span className="text-[#00C2FF]">Create</span> <br/>Something Amazing
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            Ready to elevate your brand with next-gen AI video production? Drop us a message, and our creative team will get back to you within 24 hours.
          </p>
          
          <div className="space-y-6 pt-4">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center"><Mail className="w-5 h-5 text-[#00C2FF]" /></div>
                <div>
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Email Us</p>
                    <p className="font-bold text-[#111827]">hello@burmaaistudio.com</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center"><Phone className="w-5 h-5 text-[#00C2FF]" /></div>
                <div>
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Call Us</p>
                    <p className="font-bold text-[#111827]">+95 9 123 456 789</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center"><MapPin className="w-5 h-5 text-[#00C2FF]" /></div>
                <div>
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Location</p>
                    <p className="font-bold text-[#111827]">Yangon, Myanmar</p>
                </div>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="md:w-1/2 bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">First Name</label>
                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00C2FF]/50 transition-all" placeholder="John" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Last Name</label>
                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00C2FF]/50 transition-all" placeholder="Doe" />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Email Address</label>
                <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00C2FF]/50 transition-all" placeholder="john@company.com" />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Project Details</label>
                <textarea rows={4} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00C2FF]/50 transition-all resize-none" placeholder="Tell us about your video needs..."></textarea>
            </div>
            <button type="button" className="w-full bg-[#111827] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#00C2FF] transition-colors shadow-lg">
                Send Message
            </button>
          </form>
        </div>

      </main>
    </div>
  );
}