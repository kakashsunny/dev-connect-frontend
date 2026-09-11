import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { ConferenceDay, Session, ScheduleFilterState } from './types';
import {
  TIME_SLOTS_DAY_1,
  TIME_SLOTS_DAY_2,
  SESSIONS,
} from './data/conferenceData';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { DaySelector } from './components/DaySelector';
import { TrackFilter } from './components/TrackFilter';
import { Schedule } from './components/Schedule';
import { PublicRepoSearch } from './components/PublicRepoSearch';
import { SessionDialog } from './components/SessionDialog';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { Footer } from './components/Footer';

const BOOKMARKS_STORAGE_KEY = 'converge_2026_conference_bookmarks';

export default function App() {
  const [currentDay, setCurrentDay] = useState<ConferenceDay>(1);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [triggerElement, setTriggerElement] = useState<HTMLElement | null>(null);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [announcement, setAnnouncement] = useState<string>('');

  const searchInputRef = useRef<HTMLInputElement>(null);
  const scheduleSectionRef = useRef<HTMLDivElement>(null);
  const repoSearchRef = useRef<HTMLDivElement>(null);

  // Persistent Bookmark IDs in Local Storage
  const [bookmarkedSessionIds, setBookmarkedSessionIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      if (saved) {
        return new Set(JSON.parse(saved));
      }
    } catch {
      // Ignore
    }
    return new Set(['d1-keynote', 'd1-s1-a']);
  });

  const [filterState, setFilterState] = useState<ScheduleFilterState>({
    searchQuery: '',
    selectedTrack: 'all',
    bookmarkedOnly: false,
    selectedLevel: 'all',
  });

  // Save bookmarks on change
  useEffect(() => {
    try {
      localStorage.setItem(
        BOOKMARKS_STORAGE_KEY,
        JSON.stringify(Array.from(bookmarkedSessionIds))
      );
    } catch {
      // Ignore
    }
  }, [bookmarkedSessionIds]);

  // Read URL query parameter on initial load (e.g. ?session=d1-s1-a)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const sessionParam = params.get('session');
      if (sessionParam) {
        const found = SESSIONS.find((s) => s.id === sessionParam);
        if (found) {
          setCurrentDay(found.day);
          setSelectedSession(found);
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  // Global Keyboard shortcuts listener ('?')
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      if (e.key === '?' && !selectedSession) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [selectedSession]);

  const handleSelectDay = useCallback((day: ConferenceDay) => {
    setCurrentDay(day);
    setAnnouncement(`Switched to Day ${day}, ${day === 1 ? 'Wednesday October 14' : 'Thursday October 15'}`);
  }, []);

  const handleOpenSessionDialog = useCallback((session: Session, triggerEl: HTMLElement) => {
    setTriggerElement(triggerEl);
    setSelectedSession(session);
    setAnnouncement(`Opened details dialog for ${session.title}`);
  }, []);

  const handleCloseSessionDialog = useCallback(() => {
    setSelectedSession(null);
    setAnnouncement('Closed session details dialog. Focus returned to session card.');
  }, []);

  const handleToggleBookmark = useCallback((sessionId: string) => {
    const session = SESSIONS.find((s) => s.id === sessionId);
    const sessionTitle = session ? session.title : 'Session';

    setBookmarkedSessionIds((prev) => {
      const next = new Set(prev);
      if (next.has(sessionId)) {
        next.delete(sessionId);
        setAnnouncement(`Removed "${sessionTitle}" from your saved schedule`);
      } else {
        next.add(sessionId);
        setAnnouncement(`Saved "${sessionTitle}" to your schedule`);
      }
      return next;
    });
  }, []);

  const handleUpdateFilter = useCallback((updates: Partial<ScheduleFilterState>) => {
    setFilterState((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilterState({
      searchQuery: '',
      selectedTrack: 'all',
      bookmarkedOnly: false,
      selectedLevel: 'all',
    });
    setAnnouncement('Cleared all active filters');
  }, []);

  const handleFocusSearch = useCallback(() => {
    scheduleSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 200);
  }, []);

  const handleExploreClick = useCallback(() => {
    scheduleSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleNavigateToRepoSearch = useCallback(() => {
    repoSearchRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Day specific data
  const timeSlots = currentDay === 1 ? TIME_SLOTS_DAY_1 : TIME_SLOTS_DAY_2;
  const daySessions = useMemo(() => SESSIONS.filter((s) => s.day === currentDay), [currentDay]);
  const day1Sessions = useMemo(() => SESSIONS.filter((s) => s.day === 1), []);
  const day2Sessions = useMemo(() => SESSIONS.filter((s) => s.day === 2), []);

  return (
    <div className="min-h-screen flex flex-col bg-[#080B12] text-[#F5F7FA] selection:bg-blue-600 selection:text-white">
      {/* Screen Reader Live Announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {/* Premium Sticky Header */}
      <Header
        currentDay={currentDay}
        onSelectDay={handleSelectDay}
        bookmarkedCount={bookmarkedSessionIds.size}
        showBookmarkedOnly={filterState.bookmarkedOnly}
        onToggleBookmarkedOnly={() =>
          handleUpdateFilter({ bookmarkedOnly: !filterState.bookmarkedOnly })
        }
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onFocusSearch={handleFocusSearch}
        onNavigateToRepoSearch={handleNavigateToRepoSearch}
      />

      {/* Hero Section with Atmospheric Visual Background */}
      <Hero onExploreClick={handleExploreClick} />

      {/* Main Schedule Workspace */}
      <main
        id="main-schedule"
        ref={scheduleSectionRef}
        className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 sm:space-y-14"
      >
        {/* Day Selector Navigation */}
        <DaySelector
          currentDay={currentDay}
          onSelectDay={handleSelectDay}
          day1SessionCount={day1Sessions.length}
          day2SessionCount={day2Sessions.length}
        />

        {/* Schedule Header & Search/Filters */}
        <TrackFilter
          filterState={filterState}
          onUpdateFilter={handleUpdateFilter}
          onResetFilters={handleResetFilters}
          searchInputRef={searchInputRef}
          totalFilteredCount={
            daySessions.filter((s) => {
              if (filterState.bookmarkedOnly && !bookmarkedSessionIds.has(s.id)) return false;
              if (filterState.selectedTrack !== 'all' && !s.isKeynote && !s.isBreak && s.track !== filterState.selectedTrack) return false;
              if (filterState.selectedLevel !== 'all' && s.level !== filterState.selectedLevel) return false;
              if (filterState.searchQuery.trim()) {
                const q = filterState.searchQuery.toLowerCase();
                return (
                  s.title.toLowerCase().includes(q) ||
                  s.speaker.name.toLowerCase().includes(q) ||
                  s.room.toLowerCase().includes(q) ||
                  s.summary.toLowerCase().includes(q) ||
                  s.tags.some((t) => t.toLowerCase().includes(q))
                );
              }
              return true;
            }).length
          }
          totalDayCount={daySessions.length}
        />

        {/* Schedule View (Desktop 3-Parallel Column Grid vs Mobile Stacked Chronological Stream) */}
        <Schedule
          currentDay={currentDay}
          timeSlots={timeSlots}
          sessions={SESSIONS}
          filterState={filterState}
          bookmarkedSessionIds={bookmarkedSessionIds}
          onSelectSession={handleOpenSessionDialog}
          onToggleBookmark={handleToggleBookmark}
          onResetFilters={handleResetFilters}
        />

        {/* Public Repository Search Section */}
        <div ref={repoSearchRef} className="pt-6 sm:pt-8 border-t border-white/10">
          <PublicRepoSearch onNotify={(msg) => setAnnouncement(msg)} />
        </div>
      </main>

      {/* Minimal Footer */}
      <Footer onOpenShortcuts={() => setIsShortcutsOpen(true)} />

      {/* Accessible Session Details Dialog */}
      <SessionDialog
        session={selectedSession}
        isOpen={Boolean(selectedSession)}
        isBookmarked={selectedSession ? bookmarkedSessionIds.has(selectedSession.id) : false}
        onClose={handleCloseSessionDialog}
        onToggleBookmark={handleToggleBookmark}
        triggerElement={triggerElement}
      />

      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
