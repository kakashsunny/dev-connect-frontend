import React from 'react';
import { Calendar, MapPin, ChevronDown, Sparkles, Cpu, Layers, Bot, ArrowRight } from 'lucide-react';
import heroBgImage from '../assets/images/converge_hero_bg_1789063724613.jpg';

interface HeroProps {
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative w-full overflow-hidden border-b border-white/10 bg-[#080B12] min-h-[480px] sm:min-h-[540px] lg:min-h-[600px] flex items-center justify-center"
    >
      {/* Background Atmospheric Image Layer with Gradient Masks */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src={heroBgImage}
          alt=""
          role="presentation"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-40 filter saturate-125 contrast-110 transform scale-105"
        />
        {/* Multi-tier gradient overlay to ensure WCAG AAA contrast for text */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080B12] via-[#080B12]/80 to-[#080B12]/60" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#080B12]/60 to-[#080B12]" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 flex flex-col items-center text-center">
        {/* Live Status & Metadata Chip */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-300 text-xs sm:text-sm font-semibold mb-6 shadow-lg shadow-blue-500/10 backdrop-blur-md">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse-dot" aria-hidden="true" />
          <span className="tracking-wider uppercase font-mono">LIVE SCHEDULE</span>
          <span className="text-blue-500">•</span>
          <span className="text-slate-300">OCTOBER 14–15, 2026</span>
          <span className="text-blue-500 hidden xs:inline">•</span>
          <span className="text-slate-300 hidden xs:inline">BENGALURU · INDIA</span>
        </div>

        {/* Big Editorial Title */}
        <h1
          id="hero-title"
          className="font-hero text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-none uppercase max-w-5xl"
        >
          CONVERGE <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">2026</span>
        </h1>

        {/* Slogan */}
        <p className="mt-4 sm:mt-6 text-lg sm:text-2xl md:text-3xl text-slate-200 font-light tracking-tight max-w-3xl font-display">
          &ldquo;Where ideas become what’s next.&rdquo;
        </p>

        {/* Subtitle */}
        <p className="mt-3 text-xs sm:text-sm md:text-base text-slate-400 max-w-2xl leading-relaxed">
          The premier two-day engineering summit uniting researchers, systems architects, and creators across Artificial Intelligence, Web3 Infrastructure, and Autonomous Robotics.
        </p>

        {/* 3 Parallel Tracks Visual Teasers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-3xl mt-8 sm:mt-10 text-left">
          {/* Track A */}
          <div className="p-3.5 rounded-xl bg-[#10151F]/90 border border-blue-500/30 backdrop-blur-md flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">TRACK A</div>
              <div className="text-xs sm:text-sm font-bold text-white truncate">AI Futures</div>
            </div>
          </div>

          {/* Track B */}
          <div className="p-3.5 rounded-xl bg-[#10151F]/90 border border-purple-500/30 backdrop-blur-md flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">TRACK B</div>
              <div className="text-xs sm:text-sm font-bold text-white truncate">Web3 & Cloud</div>
            </div>
          </div>

          {/* Track C */}
          <div className="p-3.5 rounded-xl bg-[#10151F]/90 border border-cyan-500/30 backdrop-blur-md flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">TRACK C</div>
              <div className="text-xs sm:text-sm font-bold text-white truncate">Robotics & UX</div>
            </div>
          </div>
        </div>

        {/* Scroll Cue Button */}
        <button
          type="button"
          onClick={onExploreClick}
          aria-label="Scroll to view conference program schedule"
          className="mt-8 sm:mt-10 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-105 cursor-pointer"
        >
          <span>Explore Schedule</span>
          <ChevronDown className="w-4 h-4 animate-bounce" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
};
