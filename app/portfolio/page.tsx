"use client";
import { Video } from "lucide-react";

export default function Portfolio() {
  const items = [
    { src: "DVM3o2Wqcys", title: "Cinematic Trailers Ai video", desc: "TikTok, Youtube, Facebook-Ai videos" },
    { src: "IrukbYGHhQs", title: "Architecture ai videos", desc: "Advanced AI Video Production" },
    { src: "T9p2lqcETCE", title: "Cinematic Commercial", desc: "High-End AI Promotional Video" },
    { src: "wJjyMQ3bjt4", title: "Virtual Presenter Campaign", desc: "Advanced AI Virtual Presenter Production" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      
      {/* Header Section */}
      <header className="py-20 px-6 md:px-16 lg:px-24 bg-gray-50 dark:bg-gray-900 text-center border-b border-gray-100 dark:border-gray-800">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
          Our <span className="text-[#00C2FF]">Masterpieces</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Explore our gallery of high-fidelity AI generated videos, showcasing our expertise in cinematic storytelling and virtual presenter campaigns.
        </p>
      </header>

      {/* Portfolio Grid */}
      <main className="py-16 px-4 md:px-16 lg:px-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Portfolio Items */}
          {items.map((item, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative w-full aspect-video overflow-hidden rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 bg-gray-100 dark:bg-gray-900">
                <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${item.src}`} allowFullScreen></iframe>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}

        </div>
      </main>

      {/* Footer Section */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-16 px-6 border-t border-gray-200 dark:border-gray-800">
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-white">
              <Video className="text-[#00C2FF] w-6 h-6" />
              Burma AI Studio
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">© 2026 Burma AI Studio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}