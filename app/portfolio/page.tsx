// Portfolio Page Code
import { Video, Play } from "lucide-react";

export default function Portfolio() {
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
          <a href="/portfolio" className="text-gray-900 border-b-2 border-[#00C2FF] pb-1 whitespace-nowrap">Portfolio</a>
          <a href="/contact" className="hover:text-gray-900 transition-colors whitespace-nowrap">Contact</a>
        </div>
        <button className="bg-[#00C2FF] text-white px-6 py-2.5 rounded-full font-semibold hover:bg-[#00a8e0] transition-colors shadow-md shadow-cyan-500/30 whitespace-nowrap shrink-0 ml-2 md:ml-4">
          Message Us
        </button>
      </nav>

      {/* Header Section */}
      <header className="py-20 px-6 md:px-16 lg:px-24 bg-white text-center border-b border-gray-100">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#111827] mb-6 tracking-tight">
          Our <span className="text-[#00C2FF]">Masterpieces</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
          Explore our gallery of high-fidelity AI generated videos, showcasing our expertise in cinematic storytelling and virtual presenter campaigns.
        </p>
      </header>

      {/* Portfolio Grid */}
      <main className="py-16 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Item 1 */}
          <div className="group cursor-pointer">
            <div className="relative w-full h-64 bg-gray-200 rounded-2xl overflow-hidden mb-4 shadow-sm border border-gray-100">
              <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Cinematic Commercial" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center"><Play className="text-[#00C2FF] w-5 h-5 ml-1" fill="currentColor"/></div>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00C2FF]/10 text-[10px] font-bold tracking-widest text-[#00C2FF] mb-2 uppercase">Commercial</div>
            <h3 className="text-xl font-bold text-[#111827]">Tech Brand Anthem</h3>
          </div>

          {/* Item 2 */}
          <div className="group cursor-pointer">
            <div className="relative w-full h-64 bg-gray-200 rounded-2xl overflow-hidden mb-4 shadow-sm border border-gray-100">
              <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Virtual Presenter" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center"><Play className="text-[#00C2FF] w-5 h-5 ml-1" fill="currentColor"/></div>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-[10px] font-bold tracking-widest text-purple-600 mb-2 uppercase">AI Presenter</div>
            <h3 className="text-xl font-bold text-[#111827]">Local News Campaign</h3>
          </div>

          {/* Item 3 */}
          <div className="group cursor-pointer">
            <div className="relative w-full h-64 bg-gray-200 rounded-2xl overflow-hidden mb-4 shadow-sm border border-gray-100">
              <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Architecture" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center"><Play className="text-[#00C2FF] w-5 h-5 ml-1" fill="currentColor"/></div>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-[10px] font-bold tracking-widest text-green-600 mb-2 uppercase">Architecture</div>
            <h3 className="text-xl font-bold text-[#111827]">Luxury Condo Flythrough</h3>
          </div>

        </div>
      </main>

      {/* Footer Section */}
      <footer className="bg-[#e5e7eb] py-16 px-6 md:px-16 lg:px-24 border-t border-gray-200">
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center gap-2 font-bold text-xl text-[#111827]">
              <Video className="text-[#00C2FF] w-6 h-6" />
              Burma AI Studio
            </div>
            <p className="text-sm text-gray-500">© 2024 Burma AI Studio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}