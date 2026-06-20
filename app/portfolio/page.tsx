// Portfolio Page Code
import { Video, Play } from "lucide-react";

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-[#f9fafb] text-gray-900 font-sans selection:bg-[#00C2FF] selection:text-white">
      

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
      <main className="py-16 px-4 md:px-16 lg:px-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Item 1 */}
          <div className="group cursor-pointer">
            <div className="relative w-full aspect-video overflow-hidden rounded-2xl shadow-lg border border-gray-100">
              <iframe className="w-full h-full" src="https://www.youtube.com/embed/DVM3o2Wqcys" allowFullScreen></iframe>
            </div>
            <div className="mt-4"><h3 className="text-xl font-bold">Cinematic Trailers Ai video</h3><p className="text-gray-500">TikTok,Youtube,Facebook-Ai videos</p></div>
          </div>

          {/* Item 2 */}
          <div className="group cursor-pointer">
            <div className="relative w-full aspect-video overflow-hidden rounded-2xl shadow-lg border border-gray-100">
              <iframe className="w-full h-full" src="https://www.youtube.com/embed/IrukbYGHhQs" allowFullScreen></iframe>
            </div>
            <div className="mt-4"><h3 className="text-xl font-bold">architecture ai videos</h3><p className="text-gray-500">Advanced AI Video Production</p></div>
          </div>

          {/* Item 3 */}
          <div className="group cursor-pointer">
            <div className="relative w-full aspect-video overflow-hidden rounded-2xl shadow-lg border border-gray-100">
              <iframe className="w-full h-full" src="https://www.youtube.com/embed/T9p2lqcETCE" allowFullScreen></iframe>
            </div>
            <div className="mt-4"><h3 className="text-xl font-bold">Cinematic Commercial</h3><p className="text-gray-500">High-End AI Promotional Video</p></div>
          </div>

          {/* Item 4 */}
          <div className="group cursor-pointer">
            <div className="relative w-full aspect-video overflow-hidden rounded-2xl shadow-lg border border-gray-100">
              <iframe className="w-full h-full" src="https://www.youtube.com/embed/wJjyMQ3bjt4" allowFullScreen></iframe>
            </div>
            <div className="mt-4"><h3 className="text-xl font-bold">Virtual Presenter Campaign</h3><p className="text-gray-500">Advanced AI Virtual Presenter Production</p></div>
          </div>

        </div> {/* Grid ပိတ် */}
      </main> {/* Main ပိတ် */}

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
