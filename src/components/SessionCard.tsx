import React from 'react';
import { Clock, MapPin, User, Bookmark, Sparkles, ChevronRight, Cpu, Layers, Bot, Award } from 'lucide-react';
import { Session } from '../types';
import { TRACKS } from '../data/conferenceData';

interface SessionCardProps {
  session: Session;
  isBookmarked: boolean;
  onSelect: (session: Session, triggerElement: HTMLElement) => void;
  onToggleBookmark: (sessionId: string) => void;
  layoutMode?: 'desktop-column' | 'mobile-stacked';
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  isBookmarked,
  onSelect,
  onToggleBookmark,
  layoutMode = 'desktop-column',
}) => {
  const trackInfo = TRACKS[session.track];

  const handleMainTriggerClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onSelect(session, e.currentTarget);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(session, e.currentTarget);
    }
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleBookmark(session.id);
  };

  const getTrackIcon = () => {
    if (session.track === 'Track A') return <Cpu className="w-3.5 h-3.5" aria-hidden="true" />;
    if (session.track === 'Track B') return <Layers className="w-3.5 h-3.5" aria-hidden="true" />;
    return <Bot className="w-3.5 h-3.5" aria-hidden="true" />;
  };

  // Special visual treatment for Keynote / Plenary / Breaks
  if (session.isKeynote || session.isBreak) {
    const isBreak = session.isBreak;
    return (
      <article
        aria-label={`${session.title} (${session.trackLabel})`}
        className={`w-full max-w-full rounded-2xl border transition-all relative group flex flex-col justify-between overflow-hidden shadow-lg ${
          isBreak
            ? 'bg-[#10151F]/80 border-amber-500/30 hover:border-amber-500/60 text-slate-200'
            : 'bg-gradient-to-br from-[#121929] via-[#0E1726] to-[#080B12] border-blue-500/40 hover:border-blue-400 text-white shadow-blue-500/10'
        }`}
      >
        {/* Plenary Top Header with Track Badge and Sibling Bookmark Button */}
        <div className="p-4 sm:p-5 pb-0 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isBreak
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-400/40'
              }`}
            >
              {isBreak ? <Sparkles className="w-3.5 h-3.5" aria-hidden="true" /> : <Award className="w-3.5 h-3.5" aria-hidden="true" />}
              {session.trackLabel}
            </span>

            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />
              {session.time}
            </span>

            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />
              {session.room}
            </span>
          </div>

          {/* Sibling Bookmark Button (NOT nested inside another button) */}
          <button
            id={`bookmark-btn-${session.id}`}
            type="button"
            onClick={handleBookmarkClick}
            aria-label={isBookmarked ? `Remove bookmark for ${session.title}` : `Bookmark ${session.title}`}
            aria-pressed={isBookmarked}
            className={`p-2 rounded-xl border transition-all cursor-pointer shrink-0 ${
              isBookmarked
                ? 'bg-amber-500 text-white border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white hover:bg-white/10'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} aria-hidden="true" />
          </button>
        </div>

        {/* Primary Interactive Button for Plenary Session Details */}
        <button
          id={`session-btn-${session.id}`}
          type="button"
          onClick={handleMainTriggerClick}
          onKeyDown={handleKeyDown}
          aria-haspopup="dialog"
          aria-label={`${session.title}. ${session.time}, ${session.room}. Speaker: ${session.speaker.name}. Press Enter or Space to view full details.`}
          className="w-full text-left p-4 sm:p-5 pt-3 focus:outline-hidden cursor-pointer flex-1 flex flex-col justify-between gap-4"
        >
          <div className="space-y-2 w-full min-w-0">
            <h3 className="font-hero text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white group-hover:text-blue-300 transition-colors break-words">
              {session.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed break-words">
              {session.summary}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/10 w-full min-w-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 flex items-center justify-center text-xs font-bold shrink-0">
                <User className="w-3.5 h-3.5" aria-hidden="true" />
              </div>
              <div className="truncate">
                <span className="text-xs sm:text-sm font-semibold text-white">{session.speaker.name}</span>
                <span className="text-xs text-slate-400 truncate hidden xs:inline"> • {session.speaker.company}</span>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-300 border border-blue-500/30 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0 self-start sm:self-auto">
              <span>View details</span>
              <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            </span>
          </div>
        </button>
      </article>
    );
  }

  // Standard Track Session Card
  return (
    <article
      aria-label={`${session.title} (${session.track})`}
      className={`w-full max-w-full rounded-2xl bg-[#10151F] border border-white/10 hover:border-white/20 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between group relative overflow-hidden ${trackInfo.cardBorder}`}
    >
      {/* Top Bar: Track Identifier, Level & Sibling Bookmark Button */}
      <div className="p-3.5 sm:p-4 pb-0 flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider border ${trackInfo.badgeBg} ${trackInfo.badgeText} ${trackInfo.badgeBorder}`}
          >
            {getTrackIcon()}
            <span>{session.track}</span>
          </span>

          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-white/5 text-slate-400 border border-white/10">
            {session.level}
          </span>
        </div>

        {/* Sibling Bookmark Button (NOT nested inside session button) */}
        <button
          id={`bookmark-btn-${session.id}`}
          type="button"
          onClick={handleBookmarkClick}
          aria-label={isBookmarked ? `Remove bookmark for ${session.title}` : `Bookmark ${session.title}`}
          aria-pressed={isBookmarked}
          className={`p-1.5 rounded-lg border transition-all cursor-pointer shrink-0 ${
            isBookmarked
              ? 'bg-amber-500 text-white border-amber-400 shadow-xs'
              : 'bg-white/5 text-slate-400 border-white/10 hover:text-amber-400 hover:bg-white/10'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} aria-hidden="true" />
        </button>
      </div>

      {/* Primary Interactive Button for Session Details */}
      <button
        id={`session-btn-${session.id}`}
        type="button"
        onClick={handleMainTriggerClick}
        onKeyDown={handleKeyDown}
        aria-haspopup="dialog"
        aria-label={`${session.title}. ${session.track}, ${session.time}, Room: ${session.room}. Speaker: ${session.speaker.name}, ${session.speaker.company}. Press Enter or Space to open full session details.`}
        className="w-full text-left p-3.5 sm:p-4 pt-2.5 flex-1 flex flex-col justify-between gap-3 focus:outline-hidden cursor-pointer"
      >
        <div className="space-y-2 w-full min-w-0">
          <div className="text-xs font-mono font-semibold text-blue-400">
            {session.time}
          </div>

          <h3 className="font-display text-sm sm:text-base font-bold text-white tracking-tight leading-snug group-hover:text-blue-400 transition-colors break-words">
            {session.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed break-words">
            {session.summary}
          </p>
        </div>

        {/* Speaker, Room & Details CTA */}
        <div className="pt-3 border-t border-white/10 space-y-2 w-full min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-5 h-5 rounded-full bg-white/10 border border-white/15 text-slate-300 flex items-center justify-center text-[10px] font-bold shrink-0">
              {session.speaker.name.charAt(0)}
            </div>
            <div className="truncate text-xs">
              <span className="font-semibold text-slate-200">{session.speaker.name}</span>
              <span className="text-slate-500 text-[11px] truncate"> • {session.speaker.company}</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400 font-medium">
            <span className="flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 text-slate-500 shrink-0" aria-hidden="true" />
              <span className="truncate">{session.room}</span>
            </span>

            <span className="inline-flex items-center gap-0.5 text-blue-400 font-semibold group-hover:translate-x-0.5 transition-transform shrink-0">
              <span>Details</span>
              <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            </span>
          </div>
        </div>
      </button>
    </article>
  );
};
