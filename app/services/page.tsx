"use client";
import { Video, Clapperboard, Mic, Building, ArrowRight } from "lucide-react";

export default function Services() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      
      {/* Header Section */}
      <header className="py-20 px-6 md:px-16 lg:px-24 bg-gray-50 dark:bg-gray-900 text-center border-b border-gray-100 dark:border-gray-800">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
          Next-Gen <span className="text-[#00C2FF]">AI Video</span> Solutions
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Elevate your brand with cutting-edge AI technology. From commercial campaigns to cinematic character performances, we deliver studio-quality results at unprecedented speed.
        </p>
      </header>

      {/* Services Grid */}
      <main className="py-16 px-4 md:px-16 lg:px-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {[
            { Icon: Clapperboard, title: "Cinematic Commercials", desc: "High-end promotional videos with advanced visual storytelling. We act as your cinematic prompt directors to generate breathtaking visuals that command attention." },
            { Icon: Mic, title: "Virtual Presenter Campaigns", desc: "Engage your local audience with hyper-realistic AI avatars. We create customized presenter campaigns delivering localized scripts with authentic character performance." },
            { Icon: Building, title: "Architectural Animations", desc: "Transform blueprints into stunning reality. Our AI-driven architectural process animations showcase real estate and construction projects in fluid, dynamic motion." },
            { Icon: Video, title: "Social Media Content", desc: "Fast-paced, highly engaging short-form content tailored for TikTok, Reels, and Shorts. Optimized to boost viewer retention and maximize organic reach." },
          ].map((service, index) => (
            <div key={index} className="bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:shadow-[#00C2FF]/10 transition-all group">
              <div className="w-14 h-14 bg-gray-50 dark:bg-gray-950 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#00C2FF]/10 transition-colors">
                <service.Icon className="text-[#00C2FF] w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{service.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                {service.desc}
              </p>
              <a href="/portfolio" className="inline-flex items-center gap-2 text-[13px] font-bold text-gray-900 dark:text-white uppercase tracking-wider group-hover:text-[#00C2FF] transition-colors">
                Learn more <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </main>

      {/* Call to Action */}
      <section className="py-20 px-6 text-center bg-gray-900 dark:bg-gray-900 text-white mt-8">
        <h2 className="text-3xl font-bold mb-6">Ready to transform your content?</h2>
        <button className="bg-[#00C2FF] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#00a8e0] transition-all shadow-lg shadow-cyan-500/30">
          Start Your Project Today
        </button>
      </section>
    </div>
  );
}