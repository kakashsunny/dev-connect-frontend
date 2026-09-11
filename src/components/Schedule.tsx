import React from 'react';
import { ConferenceDay, Session, TimeSlot, ScheduleFilterState, TrackId } from '../types';
import { SessionCard } from './SessionCard';
import { TRACKS } from '../data/conferenceData';
import { Clock, Search, Sparkles, Filter, AlertCircle, RefreshCw, Cpu, Layers, Bot } from 'lucide-react';

interface ScheduleProps {
  currentDay: ConferenceDay;
  timeSlots: TimeSlot[];
  sessions: Session[];
  filterState: ScheduleFilterState;
  bookmarkedSessionIds: Set<string>;
  onSelectSession: (session: Session, triggerElement: HTMLElement) => void;
  onToggleBookmark: (sessionId: string) => void;
  onResetFilters: () => void;
}

export const Schedule: React.FC<ScheduleProps> = ({
  currentDay,
  timeSlots,
  sessions,
  filterState,
  bookmarkedSessionIds,
  onSelectSession,
  onToggleBookmark,
  onResetFilters,
}) => {
  // Filter sessions matching active day & filter parameters
  const filterSession = (session: Session) => {
    if (session.day !== currentDay) return false;

    // Filter by bookmarks
    if (filterState.bookmarkedOnly && !bookmarkedSessionIds.has(session.id)) {
      return false;
    }

    // Filter by Track
    if (filterState.selectedTrack !== 'all' && !session.isKeynote && !session.isBreak) {
      if (session.track !== filterState.selectedTrack) return false;
    }

    // Filter by Level
    if (filterState.selectedLevel !== 'all' && session.level !== filterState.selectedLevel) {
      return false;
    }

    // Search query matching
    if (filterState.searchQuery.trim()) {
      const q = filterState.searchQuery.toLowerCase();
      const matchTitle = session.title.toLowerCase().includes(q);
      const matchSpeaker = session.speaker.name.toLowerCase().includes(q);
      const matchRoom = session.room.toLowerCase().includes(q);
      const matchSummary = session.summary.toLowerCase().includes(q);
      const matchTags = session.tags.some((t) => t.toLowerCase().includes(q));

      if (!matchTitle && !matchSpeaker && !matchRoom && !matchSummary && !matchTags) {
        return false;
      }
    }

    return true;
  };

  const filteredSessions = sessions.filter(filterSession);

  // Group filtered sessions by timeSlotId
  const initialMap: Record<string, Session[]> = {};
  const sessionsBySlot = timeSlots.reduce((acc, slot) => {
    acc[slot.id] = filteredSessions.filter((s) => s.timeSlotId === slot.id);
    return acc;
  }, initialMap);

  // Identify non-empty slots to render
  const visibleSlots = timeSlots.filter((slot) => {
    const slotSessions = sessionsBySlot[slot.id] || [];
    return slotSessions.length > 0;
  });

  // Empty State
  if (visibleSlots.length === 0) {
    return (
      <div
        id="schedule-tabpanel"
        role="tabpanel"
        aria-labelledby={`day-tab-${currentDay}`}
        className="w-full bg-[#10151F] border border-white/10 rounded-2xl p-8 sm:p-12 text-center space-y-4 max-w-2xl mx-auto shadow-xl"
      >
        <div className="w-14 h-14 mx-auto rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
          <Search className="w-7 h-7" aria-hidden="true" />
        </div>
        <div className="space-y-1.5">
          <h3 className="font-hero text-xl sm:text-2xl font-bold text-white uppercase">
            NO SESSIONS FOUND
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Try another search term or clear your active track and bookmark filters.
          </p>
        </div>
        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-600/30 transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          <span>Clear All Filters</span>
        </button>
      </div>
    );
  }

  return (
    <div
      id="schedule-tabpanel"
      role="tabpanel"
      aria-labelledby={`day-tab-${currentDay}`}
      tabIndex={0}
      className="w-full space-y-6 focus:outline-hidden"
    >
      {/* =========================================================================
          DESKTOP VIEW: 3-Column Parallel Grid (> 700px)
          ========================================================================= */}
      <div className="hidden min-[701px]:block w-full space-y-4">
        {/* Sticky Desktop Track Header Bar */}
        <div className="sticky top-16 z-30 bg-[#080B12]/95 backdrop-blur-md border border-white/10 rounded-2xl p-3 shadow-xl grid grid-cols-[140px_1fr_1fr_1fr] lg:grid-cols-[160px_1fr_1fr_1fr] gap-3 items-center">
          <div className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
            TIME / SCHEDULE
          </div>

          {/* Track A Header */}
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0">
              <Cpu className="w-4 h-4" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-mono uppercase font-bold text-blue-400">TRACK A</div>
              <div className="text-xs font-bold text-white truncate">AI Futures</div>
            </div>
          </div>

          {/* Track B Header */}
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-mono uppercase font-bold text-purple-400">TRACK B</div>
              <div className="text-xs font-bold text-white truncate">Web3 & Cloud</div>
            </div>
          </div>

          {/* Track C Header */}
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-mono uppercase font-bold text-cyan-400">TRACK C</div>
              <div className="text-xs font-bold text-white truncate">Robotics & UX</div>
            </div>
          </div>
        </div>

        {/* Time Slots Grid Rows */}
        <div className="space-y-4">
          {visibleSlots.map((slot) => {
            const slotSessions = sessionsBySlot[slot.id] || [];
            const isPlenary = slot.isGlobal || slotSessions.some((s) => s.isKeynote || s.isBreak);

            return (
              <div
                key={slot.id}
                className="grid grid-cols-[140px_1fr_1fr_1fr] lg:grid-cols-[160px_1fr_1fr_1fr] gap-3 items-stretch p-3 rounded-2xl bg-[#10151F]/40 border border-white/5"
              >
                {/* Time Indicator Column */}
                <div className="flex flex-col justify-center p-3 rounded-xl bg-[#10151F] border border-white/10 text-slate-300">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-blue-400">
                    <Clock className="w-3.5 h-3.5 shrink-0 text-blue-400" aria-hidden="true" />
                    <span>{slot.startTime}</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                    to {slot.endTime}
                  </div>
                  <div className="text-[11px] font-medium text-slate-400 mt-2 line-clamp-2 leading-tight">
                    {slot.label}
                  </div>
                </div>

                {/* If Plenary / Keynote / Break: Spans all 3 columns */}
                {isPlenary ? (
                  <div className="col-span-3">
                    {slotSessions.map((session) => (
                      <SessionCard
                        key={session.id}
                        session={session}
                        isBookmarked={bookmarkedSessionIds.has(session.id)}
                        onSelect={onSelectSession}
                        onToggleBookmark={onToggleBookmark}
                      />
                    ))}
                  </div>
                ) : (
                  /* 3 Parallel Track Slots */
                  <>
                    {/* Track A Column Slot */}
                    <div className="flex flex-col justify-stretch">
                      {slotSessions
                        .filter((s) => s.track === 'Track A')
                        .map((session) => (
                          <SessionCard
                            key={session.id}
                            session={session}
                            isBookmarked={bookmarkedSessionIds.has(session.id)}
                            onSelect={onSelectSession}
                            onToggleBookmark={onToggleBookmark}
                          />
                        ))}
                    </div>

                    {/* Track B Column Slot */}
                    <div className="flex flex-col justify-stretch">
                      {slotSessions
                        .filter((s) => s.track === 'Track B')
                        .map((session) => (
                          <SessionCard
                            key={session.id}
                            session={session}
                            isBookmarked={bookmarkedSessionIds.has(session.id)}
                            onSelect={onSelectSession}
                            onToggleBookmark={onToggleBookmark}
                          />
                        ))}
                    </div>

                    {/* Track C Column Slot */}
                    <div className="flex flex-col justify-stretch">
                      {slotSessions
                        .filter((s) => s.track === 'Track C')
                        .map((session) => (
                          <SessionCard
                            key={session.id}
                            session={session}
                            isBookmarked={bookmarkedSessionIds.has(session.id)}
                            onSelect={onSelectSession}
                            onToggleBookmark={onToggleBookmark}
                          />
                        ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          MOBILE VIEW (≤ 700px & 320px viewport):
          Vertically Stacked Chronological Sequence — NO Horizontal Scrolling
          ========================================================================= */}
      <div className="block min-[701px]:hidden w-full space-y-6">
        {visibleSlots.map((slot) => {
          const slotSessions = sessionsBySlot[slot.id] || [];

          return (
            <section
              key={slot.id}
              aria-labelledby={`mobile-slot-heading-${slot.id}`}
              className="space-y-3 w-full max-w-full"
            >
              {/* Time Slot Header Banner */}
              <div className="sticky top-16 z-20 bg-[#10151F] border border-blue-500/30 rounded-xl px-3.5 py-2.5 shadow-md flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" aria-hidden="true" />
                  <h3
                    id={`mobile-slot-heading-${slot.id}`}
                    className="font-mono text-xs sm:text-sm font-bold text-white truncate"
                  >
                    {slot.time}
                  </h3>
                </div>
                <span className="text-[11px] font-medium text-blue-300 truncate shrink-0">
                  {slot.label}
                </span>
              </div>

              {/* Sessions Stacked Vertically */}
              <div className="space-y-3 w-full max-w-full">
                {slotSessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    isBookmarked={bookmarkedSessionIds.has(session.id)}
                    onSelect={onSelectSession}
                    onToggleBookmark={onToggleBookmark}
                    layoutMode="mobile-stacked"
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
