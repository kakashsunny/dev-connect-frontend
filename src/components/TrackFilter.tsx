import React from 'react';
import { Search, X, Filter, Bookmark, Check, Layers, Cpu, Bot } from 'lucide-react';
import { ScheduleFilterState, TrackId } from '../types';

interface TrackFilterProps {
  filterState: ScheduleFilterState;
  onUpdateFilter: (updates: Partial<ScheduleFilterState>) => void;
  onResetFilters: () => void;
  totalFilteredCount: number;
  totalDayCount: number;
  searchInputRef?: React.RefObject<HTMLInputElement>;
}

export const TrackFilter: React.FC<TrackFilterProps> = ({
  filterState,
  onUpdateFilter,
  onResetFilters,
  totalFilteredCount,
  totalDayCount,
  searchInputRef,
}) => {
  const isFiltered =
    Boolean(filterState.searchQuery.trim()) ||
    filterState.selectedTrack !== 'all' ||
    filterState.selectedLevel !== 'all' ||
    filterState.bookmarkedOnly;

  return (
    <section aria-labelledby="program-heading" className="w-full space-y-4">
      {/* Program Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-white/10 pb-4">
        <div className="space-y-1">
          <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-blue-400">
            PROGRAM SCHEDULE
          </div>
          <h2 id="program-heading" className="font-hero text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            TODAY’S PROGRAM
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Three tracks. One place to see everything happening across the conference.
          </p>
        </div>

        {/* Live Filter Metric */}
        <div className="flex items-center gap-2 self-start md:self-auto text-xs text-slate-400 bg-[#10151F] px-3 py-1.5 rounded-lg border border-white/10">
          <span>Showing</span>
          <span className="font-bold text-blue-400">{totalFilteredCount}</span>
          <span>of {totalDayCount} sessions</span>
          {isFiltered && (
            <button
              type="button"
              onClick={onResetFilters}
              className="ml-2 text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-2 focus:outline-hidden"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar Controls */}
      <div className="bg-[#10151F] border border-white/10 p-3 sm:p-4 rounded-2xl shadow-lg space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <label htmlFor="schedule-search" className="sr-only">
              Search sessions by title, speaker, room, or topic
            </label>
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
            <input
              ref={searchInputRef}
              id="schedule-search"
              type="search"
              value={filterState.searchQuery}
              onChange={(e) => onUpdateFilter({ searchQuery: e.target.value })}
              placeholder="Search sessions, speakers, topics, or halls..."
              className="w-full bg-[#080B12] text-white placeholder-slate-500 pl-10 pr-9 py-2.5 rounded-xl border border-white/10 text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
            {filterState.searchQuery && (
              <button
                type="button"
                onClick={() => onUpdateFilter({ searchQuery: '' })}
                aria-label="Clear search query"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white rounded-md"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Track Dropdown Selector (Accessible for Mobile & Desktop) */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <label htmlFor="track-select" className="sr-only">
              Filter by track
            </label>
            <select
              id="track-select"
              value={filterState.selectedTrack}
              onChange={(e) => onUpdateFilter({ selectedTrack: e.target.value as TrackId | 'all' })}
              className="bg-[#080B12] text-slate-200 border border-white/10 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer w-full sm:w-auto"
            >
              <option value="all">All Tracks (A, B, C)</option>
              <option value="Track A">Track A: AI Futures</option>
              <option value="Track B">Track B: Web3 & Cloud</option>
              <option value="Track C">Track C: Robotics & UX</option>
            </select>

            {/* Level Selector */}
            <label htmlFor="level-select" className="sr-only">
              Filter by experience level
            </label>
            <select
              id="level-select"
              value={filterState.selectedLevel}
              onChange={(e) => onUpdateFilter({ selectedLevel: e.target.value as any })}
              className="bg-[#080B12] text-slate-200 border border-white/10 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer w-full sm:w-auto"
            >
              <option value="all">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            {/* Bookmarked Filter Pill */}
            <button
              type="button"
              onClick={() => onUpdateFilter({ bookmarkedOnly: !filterState.bookmarkedOnly })}
              aria-pressed={filterState.bookmarkedOnly}
              className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer whitespace-nowrap w-full sm:w-auto shrink-0 ${
                filterState.bookmarkedOnly
                  ? 'bg-amber-500 text-white border-amber-400 shadow-sm shadow-amber-500/20'
                  : 'bg-[#080B12] text-slate-300 border-white/10 hover:border-white/20 hover:text-white'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${filterState.bookmarkedOnly ? 'fill-current' : ''}`} aria-hidden="true" />
              <span>Saved Only</span>
            </button>
          </div>
        </div>

        {/* Track Pills for Quick Visual Filtering on Larger Screens */}
        <div className="hidden sm:flex items-center gap-2 pt-1 border-t border-white/5 overflow-x-auto text-xs">
          <span className="text-slate-400 text-xs font-semibold mr-1">Quick Track:</span>
          <button
            type="button"
            onClick={() => onUpdateFilter({ selectedTrack: 'all' })}
            className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              filterState.selectedTrack === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            All Tracks
          </button>
          <button
            type="button"
            onClick={() => onUpdateFilter({ selectedTrack: 'Track A' })}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              filterState.selectedTrack === 'Track A'
                ? 'bg-blue-600 text-white'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            Track A (AI)
          </button>
          <button
            type="button"
            onClick={() => onUpdateFilter({ selectedTrack: 'Track B' })}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              filterState.selectedTrack === 'Track B'
                ? 'bg-purple-600 text-white'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            Track B (Web3 & Cloud)
          </button>
          <button
            type="button"
            onClick={() => onUpdateFilter({ selectedTrack: 'Track C' })}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              filterState.selectedTrack === 'Track C'
                ? 'bg-cyan-600 text-white'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            Track C (Robotics & UX)
          </button>
        </div>
      </div>
    </section>
  );
};
