import { Video, Clapperboard, Mic, Building, ArrowRight } from "lucide-react";

export default function Services() {
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
          <a href="/services" className="text-gray-900 border-b-2 border-[#00C2FF] pb-1 whitespace-nowrap">Services</a>
          <a href="/portfolio" className="hover:text-gray-900 transition-colors whitespace-nowrap">Portfolio</a>
          <a href="/contact" className="hover:text-gray-900 transition-colors whitespace-nowrap">Contact</a>
        </div>
        <a href="/contact" className="inline-flex items-center justify-center bg-[#00C2FF] text-white px-6 py-2.5 rounded-full font-semibold hover:bg-[#00a8e0] transition-colors shadow-md shadow-cyan-500/30 whitespace-nowrap shrink-0 ml-2 md:ml-4">
          Message Us
        </a>
      </nav>

      {/* Header Section */}
      <header className="py-20 px-6 md:px-16 lg:px-24 bg-white text-center border-b border-gray-100">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#111827] mb-6 tracking-tight">
          Next-Gen <span className="text-[#00C2FF]">AI Video</span> Solutions
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
          Elevate your brand with cutting-edge AI technology. From commercial campaigns to cinematic character performances, we deliver studio-quality results at unprecedented speed.
        </p>
      </header>

      {/* Services Grid */}
      <main className="py-16 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Service 1 */}
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-[#00C2FF]/10 transition-all group">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#00C2FF]/10 transition-colors">
              <Clapperboard className="text-[#00C2FF] w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-[#111827] mb-4">Cinematic Commercials</h3>
            <p className="text-gray-500 mb-6 leading-relaxed">
              High-end promotional videos with advanced visual storytelling. We act as your cinematic prompt directors to generate breathtaking visuals that command attention.
            </p>
            <a href="/portfolio" className="inline-flex items-center gap-2 text-[13px] font-bold text-[#111827] uppercase tracking-wider group-hover:text-[#00C2FF] transition-colors">
            Learn more <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Service 2 */}
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-[#00C2FF]/10 transition-all group">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#00C2FF]/10 transition-colors">
              <Mic className="text-[#00C2FF] w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-[#111827] mb-4">Virtual Presenter Campaigns</h3>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Engage your local audience with hyper-realistic AI avatars. We create customized Burmese presenter campaigns delivering localized scripts with authentic character performance.
            </p>
            <a href="/portfolio" className="inline-flex items-center gap-2 text-[13px] font-bold text-[#111827] uppercase tracking-wider group-hover:text-[#00C2FF] transition-colors">
            Learn more <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Service 3 */}
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-[#00C2FF]/10 transition-all group">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#00C2FF]/10 transition-colors">
              <Building className="text-[#00C2FF] w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-[#111827] mb-4">Architectural Animations</h3>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Transform blueprints into stunning reality. Our AI-driven architectural process animations showcase real estate and construction projects in fluid, dynamic motion.
            </p>
            <a href="/portfolio" className="inline-flex items-center gap-2 text-[13px] font-bold text-[#111827] uppercase tracking-wider group-hover:text-[#00C2FF] transition-colors">
            Learn more <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Service 4 */}
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-[#00C2FF]/10 transition-all group">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#00C2FF]/10 transition-colors">
              <Video className="text-[#00C2FF] w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-[#111827] mb-4">Social Media Content</h3>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Fast-paced, highly engaging short-form content tailored for TikTok, Reels, and Shorts. Optimized to boost viewer retention and maximize organic reach.
            </p>
            <a href="/portfolio#cinematic-trailers" className="inline-flex items-center gap-2 text-[13px] font-bold text-[#00C2FF] hover:text-[#0089cc] transition-colors">
            Learn more <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </main>

      {/* Call to Action */}
      <section className="py-20 px-6 text-center bg-[#111827] text-white mt-8">
        <h2 className="text-3xl font-bold mb-6">Ready to transform your content?</h2>
        <button className="bg-[#00C2FF] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#00a8e0] transition-all shadow-lg shadow-cyan-500/30">
          Start Your Project Today
        </button>
      </section>
    </div>
  );
}