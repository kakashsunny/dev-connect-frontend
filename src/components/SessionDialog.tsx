import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  Clock,
  MapPin,
  Bookmark,
  Calendar,
  Sparkles,
  CheckCircle2,
  Share2,
  Download,
  Copy,
  Check,
  Cpu,
  Layers,
  Bot,
} from 'lucide-react';
import { Session } from '../types';
import { TRACKS } from '../data/conferenceData';

interface SessionDialogProps {
  session: Session | null;
  isOpen: boolean;
  isBookmarked: boolean;
  onClose: () => void;
  onToggleBookmark: (sessionId: string) => void;
  triggerElement: HTMLElement | null;
}

export const SessionDialog: React.FC<SessionDialogProps> = ({
  session,
  isOpen,
  isBookmarked,
  onClose,
  onToggleBookmark,
  triggerElement,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);

  // Focus Trapping & Accessibility
  useEffect(() => {
    if (!isOpen || !session) return;

    // Save previous focus and lock body scroll
    const previousActiveElement = document.activeElement as HTMLElement;
    document.body.style.overflow = 'hidden';

    // Focus the close button on open
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);

      // Restore focus to triggering element
      if (triggerElement && typeof triggerElement.focus === 'function') {
        triggerElement.focus();
      } else if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
        previousActiveElement.focus();
      }
    };
  }, [isOpen, session, onClose, triggerElement]);

  if (!isOpen || !session) return null;

  const trackInfo = TRACKS[session.track];

  const handleCopyLink = () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('session', session.id);
      navigator.clipboard.writeText(url.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleDownloadICS = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CONVERGE 2026//Conference Schedule//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${session.title}`,
      `DESCRIPTION:${session.summary.replace(/\n/g, ' ')} - Speaker: ${session.speaker.name} (${session.speaker.company})`,
      `LOCATION:${session.room}, Bengaluru Arena, India`,
      `DTSTART:2026101${session.day}T${session.startTime.replace(':', '')}00Z`,
      `DTEND:2026101${session.day}T${session.endTime.replace(':', '')}00Z`,
      `UID:${session.id}-converge-2026@conference`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${session.id}-converge-2026.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="session-dialog-title"
      aria-describedby="session-dialog-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto"
    >
      {/* Darkened Backdrop with Blur */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity modal-backdrop-animate"
      />

      {/* Dialog Surface Modal */}
      <div
        ref={dialogRef}
        className="relative w-full max-w-2xl bg-[#10151F] border border-white/15 rounded-3xl shadow-2xl text-[#F5F7FA] overflow-hidden z-10 my-auto modal-dialog-animate flex flex-col max-h-[90vh]"
      >
        {/* Modal Header Bar */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-start justify-between gap-4 bg-[#080B12]">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider border ${trackInfo.badgeBg} ${trackInfo.badgeText} ${trackInfo.badgeBorder}`}
              >
                {session.track === 'Track A' && <Cpu className="w-3.5 h-3.5" aria-hidden="true" />}
                {session.track === 'Track B' && <Layers className="w-3.5 h-3.5" aria-hidden="true" />}
                {session.track === 'Track C' && <Bot className="w-3.5 h-3.5" aria-hidden="true" />}
                <span>{session.trackLabel || session.track}</span>
              </span>

              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-white/10 text-slate-300">
                Day {session.day} • {session.level}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 font-medium pt-1">
              <span className="flex items-center gap-1 font-mono text-blue-400 font-semibold">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                {session.time}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                {session.room}
              </span>
            </div>
          </div>

          {/* Close Button */}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close session details dialog"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 border border-white/10 transition-colors shrink-0"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Modal Scrollable Content Area */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1 focus:outline-hidden" tabIndex={0}>
          {/* Main Title */}
          <div>
            <h2
              id="session-dialog-title"
              className="font-hero text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white leading-snug"
            >
              {session.title}
            </h2>
            <p id="session-dialog-desc" className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              {session.summary}
            </p>
          </div>

          {/* Speaker Profile Block */}
          <div className="bg-[#080B12] p-4 rounded-2xl border border-white/10 flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-md">
              {session.speaker.name.charAt(0)}
            </div>
            <div className="space-y-1 min-w-0">
              <div className="font-bold text-white text-sm sm:text-base">{session.speaker.name}</div>
              <div className="text-xs text-blue-400 font-medium">
                {session.speaker.role} • {session.speaker.company}
              </div>
              <p className="text-xs text-slate-400 pt-1 leading-relaxed">
                {session.speaker.bio}
              </p>
            </div>
          </div>

          {/* Full Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              SESSION OVERVIEW
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {session.description}
            </p>
          </div>

          {/* Key Takeaways */}
          {session.keyTakeaways && session.keyTakeaways.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                WHAT YOU’LL LEARN
              </h3>
              <ul className="space-y-2" aria-label="Key session takeaways">
                {session.keyTakeaways.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Topic Tags */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              TOPICS & TAGS
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {session.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-slate-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-6 border-t border-white/10 bg-[#080B12] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Bookmark Toggle */}
            <button
              type="button"
              onClick={() => onToggleBookmark(session.id)}
              aria-label={isBookmarked ? 'Remove session from bookmarks' : 'Add session to bookmarks'}
              aria-pressed={isBookmarked}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
                isBookmarked
                  ? 'bg-amber-500 text-white border-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:text-white hover:bg-white/10'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} aria-hidden="true" />
              <span>{isBookmarked ? 'Saved to Schedule' : 'Save Session'}</span>
            </button>

            {/* Download Calendar (.ics) */}
            <button
              type="button"
              onClick={handleDownloadICS}
              aria-label="Download calendar event (.ics file)"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium bg-white/5 text-slate-300 border border-white/10 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span className="hidden xs:inline">Add to</span> Calendar (.ics)
            </button>

            {/* Share / Copy Link */}
            <button
              type="button"
              onClick={handleCopyLink}
              aria-label="Copy session link to clipboard"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium bg-white/5 text-slate-300 border border-white/10 hover:text-white hover:bg-white/10 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                  <span className="text-emerald-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" aria-hidden="true" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>

          {/* Close Action Button */}
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all cursor-pointer ml-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
