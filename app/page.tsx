import { Play, TrendingUp, Palette, Video, Menu } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#00C2FF] selection:text-white">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center py-6 px-6 md:px-16 lg:px-24">
  
  <div className="flex items-center gap-2 font-bold text-xl tracking-wide">
    <Video className="text-[#00C2FF] w-6 h-6" />
    Burma AI Studio
  </div>

  <div className="hidden md:flex gap-10 text-[13px] font-bold text-gray-500 uppercase">
    <a href="/" className="text-gray-900 border-b-2 border-[#00C2FF] pb-1">Home</a>
    <a href="/services" className="hover:text-gray-900 transition-colors">Services</a>
    <a href="/portfolio" className="hover:text-gray-900 transition-colors">Portfolio</a>
    <a href="/contact" className="hover:text-gray-900 transition-colors">Contact</a>
  </div>

  <div className="flex items-center gap-4">
    <a href="/contact" className="inline-flex items-center justify-center bg-[#00C2FF] text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-blue-600 transition-colors">
      Message Us
    </a>
    
    <button className="md:hidden text-gray-900 p-1">
      <Menu className="w-7 h-7" />
    </button>
  </div>

</nav>

      {/* Hero Section */}
      <main className="flex flex-col lg:flex-row items-center justify-between py-12 md:py-20 px-6 md:px-16 lg:px-24 gap-12 lg:gap-8">
        {/* Left Content */}
        <div className="lg:w-[50%] space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200 bg-gray-50 text-[11px] font-bold tracking-widest text-gray-500">
            <div className="w-2 h-2 rounded-full bg-[#00C2FF]"></div>
            NEXT-GEN VIDEO PRODUCTION
          </div>
          <h1 className="text-5xl md:text-[64px] font-extrabold leading-[1.1] tracking-tight text-[#111827]">
            AI Videos That <br /> Make Your <br /> Brand <span className="text-[#00C2FF]">Stand Out</span>
          </h1>
          <p className="text-gray-500 text-lg md:text-xl max-w-lg leading-relaxed">
            High-quality, affordable promotional videos powered by advanced AI. We craft cinematic narratives that captivate your audience and elevate your brand identity without the traditional studio costs.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
           <a href="/contact" className="inline-flex items-center justify-center bg-[#00C2FF] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#00a8e0] transition-all shadow-lg shadow-[#00C2FF]/30">
            Get Started
          </a>
          <a href="/portfolio" className="inline-flex items-center justify-center bg-[#111827] text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-all gap-2">
            <Play className="w-5 h-5" /> Watch Examples
          </a>
          
          </div>
          <div className="flex -space-x-3"></div>
          <div className="flex items-center gap-4 pt-6 border-t border-gray-100 max-w-sm">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden"><img src="https://i.pravatar.cc/100?img=1" alt="User 1" /></div>
              <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white shadow-sm overflow-hidden"><img src="https://i.pravatar.cc/100?img=2" alt="User 2" /></div>
              <div className="w-10 h-10 rounded-full bg-gray-400 border-2 border-white shadow-sm overflow-hidden"><img src="https://i.pravatar.cc/100?img=3" alt="User 3" /></div>
            </div>
            <p className="text-sm text-gray-500">Trusted by <strong className="text-gray-900 font-bold">50+</strong> businesses</p>
          </div>
        </div>

        {/* Right Visual (Abstract 3D Video Graphic) */}
        <div className="lg:w-[45%] w-full h-[450px] md:h-[600px] relative">
          <div className="w-full h-full rounded-[2.5rem] bg-[#111827] overflow-hidden relative shadow-2xl flex items-center justify-center">
            {/* Cinematic Lighting Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#00C2FF]/20 via-transparent to-transparent blur-2xl"></div>
            
            {/* Background pattern suggestion */}
            <div className="absolute inset-0 opacity-40 flex items-center justify-center flex-col gap-8 transform rotate-12 scale-150">
              <div className="w-64 h-16 border-4 border-[#00C2FF]/30 rounded-xl"></div>
              <div className="w-80 h-16 border-4 border-[#00C2FF]/20 rounded-xl"></div>
              <div className="w-72 h-16 border-4 border-[#00C2FF]/10 rounded-xl"></div>
            </div>

            {/* Central Play Button */}
            <div className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(0,194,255,0.4)] z-10 cursor-pointer hover:scale-110 transition-transform duration-300">
              <Play className="text-[#00C2FF] w-8 h-8 ml-1" fill="currentColor" />
            </div>

            {/* Floating Image Elements */}
            <div className="absolute left-6 md:left-10 top-1/4 w-28 h-36 bg-gray-800 rounded-xl border-4 border-white shadow-xl transform -rotate-12 hidden md:block overflow-hidden">
               <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover opacity-80" alt="Video frame 1" />
            </div>
            <div className="absolute right-6 md:right-10 bottom-1/4 w-36 h-24 bg-gray-800 rounded-xl border-4 border-white shadow-xl transform rotate-6 hidden md:block overflow-hidden flex items-center justify-center">
               <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-80" alt="Video frame 2" />
               <div className="w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center z-10"><Play className="w-3 h-3 text-gray-900 ml-0.5" fill="currentColor"/></div>
            </div>
          </div>
        </div>
      </main>

      {/* Stats Section */}
      <section className="bg-[#f9fafb] border-t border-b border-gray-100 py-16 px-6 md:px-16 lg:px-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-4 text-center md:divide-x divide-gray-200">
          <div className="flex flex-col items-center justify-center space-y-2">
            <h3 className="text-[40px] font-extrabold text-[#111827] leading-none">100+</h3>
            <p className="text-[11px] font-bold tracking-widest text-gray-500 uppercase">Videos Created</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2">
            <h3 className="text-[40px] font-extrabold text-[#111827] leading-none flex items-baseline">
              48<span className="text-[#00C2FF] text-2xl ml-1 font-bold">hr</span>
            </h3>
            <p className="text-[11px] font-bold tracking-widest text-gray-500 uppercase">Fast Delivery</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-3">
            <TrendingUp className="text-[#00C2FF] w-8 h-8" />
            <p className="text-[11px] font-bold tracking-widest text-gray-500 uppercase">Business-Focused</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-3">
            <Palette className="text-[#00C2FF] w-8 h-8" />
            <p className="text-[11px] font-bold tracking-widest text-gray-500 uppercase">Custom Style</p>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-[#e5e7eb] py-16 px-6 md:px-16 lg:px-24">
  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
    
    <div className="col-span-2 space-y-4">
      <div className="flex items-center gap-2 font-bold text-xl text-[#111827]">
        <Video className="text-[#00C2FF] w-6 h-6" />
        Burma AI Studio
      </div>
      <p className="text-sm text-gray-500">
        © 2024 Burma AI Studio. All rights reserved.
      </p>
    </div>

    <div className="col-span-1 flex flex-col space-y-4">
      <a href="/" className="text-sm text-gray-600 hover:text-[#111827] transition-colors">Home</a>
      <a href="/services" className="text-sm text-gray-600 hover:text-[#111827] transition-colors">Services</a>
      <a href="/portfolio" className="text-sm text-gray-600 hover:text-[#111827] transition-colors">Portfolio</a>
    </div>

    <div className="col-span-1 flex flex-col space-y-4">
      <a href="/contact" className="text-sm text-gray-600 hover:text-[#111827] transition-colors">Contact</a>
      <a href="#" className="text-sm text-gray-600 hover:text-[#111827] transition-colors">Privacy Policy</a>
      <a href="#" className="text-sm text-gray-600 hover:text-[#111827] transition-colors">Terms of Service</a>
    </div>

  </div>
</footer>
    </div>
  );
}