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
        <a href="/contact" className="inline-flex items-center justify-center bg-[#00C2FF] text-white px-6 py-2.5 rounded-full font-semibold hover:bg-[#00a8e0] transition-colors shadow-md shadow-cyan-500/30 whitespace-nowrap shrink-0 ml-2 md:ml-4">
          Message Us
        </a>
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
          
          {/* Item 1 - YouTube Video */}
          <div className="group cursor-pointer">
            <div className="relative w-full aspect-video overflow-hidden rounded-2xl shadow-lg border border-gray-100">
              <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/DVM3o2Wqcys" 
                title="Portfolio Video" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold text-[#111827]">Cinematic Trailers Ai video</h3>
              <p className="text-gray-500">TikTok,Youtube,Facebook-Ai videos</p>
            </div>
          </div>

          {/* Item 2 - YouTube Video */}
          <div className="group cursor-pointer">
            <div className="relative w-full aspect-video overflow-hidden rounded-2xl shadow-lg border border-gray-100">
              <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/IrukbYGHhQs" 
                title="Portfolio Video 2" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold text-[#111827]">AI Cinematic Creation</h3>
              <p className="text-gray-500">Advanced AI Video Production</p>
            </div>
          </div>
          {/* Item 3 - YouTube Video */}
          <div className="group cursor-pointer">
            <div className="relative w-full aspect-video overflow-hidden rounded-2xl shadow-lg border border-gray-100">
              <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/T9p2lqcETCE" 
                title="Cinematic Commercial Ai Video" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold text-[#111827]">Cinematic Commercial</h3>
              <p className="text-gray-500">High-End AI Promotional Video</p>
            </div>
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