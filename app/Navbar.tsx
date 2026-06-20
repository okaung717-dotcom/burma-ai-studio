"use client";
import { useState } from "react";
import { Video, Menu } from "lucide-react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="relative py-6 px-4 md:px-12 lg:px-24 bg-white z-50">
      <div className="flex justify-between items-center">
        
        <div className="flex items-center gap-2 font-bold text-xl tracking-wide whitespace-nowrap">
          <Video className="text-[#00C2FF] w-6 h-6" />
          Burma AI Studio
        </div>

        <div className="hidden md:flex gap-6 lg:gap-10 text-[13px] font-bold text-gray-500 uppercase tracking-widest">
          <a href="/" className="hover:text-gray-900 transition-colors whitespace-nowrap">Home</a>
          <a href="/services" className="hover:text-gray-900 transition-colors whitespace-nowrap">Services</a>
          <a href="/portfolio" className="hover:text-gray-900 transition-colors whitespace-nowrap">Portfolio</a>
          <a href="/contact" className="hover:text-gray-900 transition-colors whitespace-nowrap">Contact</a>
        </div>

        <div className="flex items-center gap-4">
          <a href="/contact" className="inline-flex items-center justify-center bg-[#00C2FF] text-white px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap hover:bg-blue-600 transition-colors">
            Message Us
          </a>
          
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="block md:hidden text-[#111827] focus:outline-none"
          >
            <Menu className="w-8 h-8" />
          </button>
        </div>

      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 md:hidden flex flex-col gap-6 px-6 py-6 z-50">
          <a href="/" className="text-gray-900 font-bold text-lg border-b border-gray-50 pb-2">Home</a>
          <a href="/services" className="text-gray-500 font-bold text-lg border-b border-gray-50 pb-2">Services</a>
          <a href="/portfolio" className="text-gray-500 font-bold text-lg border-b border-gray-50 pb-2">Portfolio</a>
          <a href="/contact" className="text-gray-500 font-bold text-lg pb-2">Contact</a>
        </div>
      )}
    </nav>
  );
}