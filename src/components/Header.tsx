import React from 'react';
import { Calendar, Bookmark, HelpCircle, Sparkles, Search } from 'lucide-react';
import { ConferenceDay } from '../types';

interface HeaderProps {
  currentDay: ConferenceDay;
  onSelectDay: (day: ConferenceDay) => void;
  bookmarkedCount: number;
  showBookmarkedOnly: boolean;
  onToggleBookmarkedOnly: () => void;
  onOpenShortcuts: () => void;
  onFocusSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDay,
  onSelectDay,
  bookmarkedCount,
  showBookmarkedOnly,
  onToggleBookmarkedOnly,
  onOpenShortcuts,
  onFocusSearch,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#080B12]/90 backdrop-blur-md border-b border-white/10 transition-colors">
      {/* Skip to Main Content Link for Keyboard / Screen Readers */}
      <a href="#main-schedule" className="skip-link">
        Skip to conference schedule (Press Enter)
      </a>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: CONVERGE 2026 Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#"
            className="flex items-center gap-2.5 text-white group focus:outline-hidden rounded-lg p-1"
            aria-label="CONVERGE 2026 Conference Homepage"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              C
            </div>
            <div className="flex flex-col">
              <span className="font-hero text-base sm:text-lg font-extrabold tracking-tight leading-none text-white">
                CONVERGE
              </span>
              <span className="text-[10px] font-mono tracking-widest text-blue-400 font-semibold uppercase leading-tight">
                2026 • BENGALURU
              </span>
            </div>
          </a>

          {/* Small Status Indicator */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot" aria-hidden="true" />
            <span>LIVE PROGRAM</span>
          </div>
        </div>

        {/* Center / Right: Day Switcher Navigation Links */}
        <nav aria-label="Conference Days Navigation" className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => onSelectDay(1)}
            aria-current={currentDay === 1 ? 'page' : undefined}
            className={`px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              currentDay === 1
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="hidden xs:inline">Day 1 • </span>Oct 14
          </button>

          <button
            type="button"
            onClick={() => onSelectDay(2)}
            aria-current={currentDay === 2 ? 'page' : undefined}
            className={`px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              currentDay === 2
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="hidden xs:inline">Day 2 • </span>Oct 15
          </button>
        </nav>

        {/* Right Actions: Search, Bookmarks, Accessibility */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Search Trigger */}
          <button
            type="button"
            onClick={onFocusSearch}
            aria-label="Focus schedule search input"
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 transition-colors"
            title="Search sessions"
          >
            <Search className="w-4 h-4" aria-hidden="true" />
          </button>

          {/* Saved Sessions Bookmark Filter Toggle */}
          <button
            type="button"
            onClick={onToggleBookmarkedOnly}
            aria-label={`Saved sessions filter. ${bookmarkedCount} sessions saved. ${showBookmarkedOnly ? 'Showing saved only' : 'Showing all sessions'}`}
            aria-pressed={showBookmarkedOnly}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              showBookmarkedOnly
                ? 'bg-amber-500 text-white border-amber-400 shadow-sm shadow-amber-500/30'
                : 'bg-white/5 text-slate-300 border-white/10 hover:text-white hover:bg-white/10'
            }`}
            title="Toggle saved sessions filter"
          >
            <Bookmark className={`w-3.5 h-3.5 ${showBookmarkedOnly ? 'fill-current' : ''}`} aria-hidden="true" />
            <span className="hidden sm:inline">Saved</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              showBookmarkedOnly ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-300'
            }`}>
              {bookmarkedCount}
            </span>
          </button>

          {/* Accessibility & Shortcuts Dialog Button */}
          <button
            type="button"
            onClick={onOpenShortcuts}
            aria-label="Open keyboard shortcuts and accessibility guide (Shortcut: Question mark)"
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 transition-colors"
            title="Accessibility & Keyboard shortcuts (?)"
          >
            <HelpCircle className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
};
