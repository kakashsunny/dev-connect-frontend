import React, { useRef } from 'react';
import { ConferenceDay } from '../types';
import { Calendar, Sparkles } from 'lucide-react';

interface DaySelectorProps {
  currentDay: ConferenceDay;
  onSelectDay: (day: ConferenceDay) => void;
  day1SessionCount: number;
  day2SessionCount: number;
}

export const DaySelector: React.FC<DaySelectorProps> = ({
  currentDay,
  onSelectDay,
  day1SessionCount,
  day2SessionCount,
}) => {
  const day1Ref = useRef<HTMLButtonElement>(null);
  const day2Ref = useRef<HTMLButtonElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, day: ConferenceDay) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (day === 1) {
        onSelectDay(2);
        day2Ref.current?.focus();
      } else {
        onSelectDay(1);
        day1Ref.current?.focus();
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (day === 2) {
        onSelectDay(1);
        day1Ref.current?.focus();
      } else {
        onSelectDay(2);
        day2Ref.current?.focus();
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      onSelectDay(1);
      day1Ref.current?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      onSelectDay(2);
      day2Ref.current?.focus();
    }
  };

  return (
    <section aria-labelledby="day-selector-heading" className="w-full">
      <h2 id="day-selector-heading" className="sr-only">
        Conference Days Navigation
      </h2>

      <div
        role="tablist"
        aria-label="Conference Schedule Days"
        className="w-full max-w-2xl mx-auto p-1.5 sm:p-2 bg-[#10151F] border border-white/10 rounded-2xl shadow-xl grid grid-cols-2 gap-2"
      >
        {/* Day 1 Tab Button */}
        <button
          ref={day1Ref}
          id="day-tab-1"
          role="tab"
          type="button"
          aria-selected={currentDay === 1}
          aria-controls="schedule-tabpanel"
          tabIndex={currentDay === 1 ? 0 : -1}
          onClick={() => onSelectDay(1)}
          onKeyDown={(e) => handleKeyDown(e, 1)}
          className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl transition-all cursor-pointer text-center relative overflow-hidden group ${
            currentDay === 1
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/40'
              : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          {currentDay === 1 && (
            <span className="absolute top-2 right-2 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-300 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
          )}

          <span className="font-hero text-lg sm:text-2xl font-black tracking-tight uppercase">
            DAY 01
          </span>
          <span className={`text-xs sm:text-sm font-semibold tracking-wider uppercase mt-0.5 ${
            currentDay === 1 ? 'text-blue-100' : 'text-slate-400'
          }`}>
            OCT 14, 2026
          </span>
          <span className={`text-[11px] mt-1 font-medium ${
            currentDay === 1 ? 'text-blue-200' : 'text-slate-500'
          }`}>
            {day1SessionCount} Sessions • 3 Parallel Tracks
          </span>
        </button>

        {/* Day 2 Tab Button */}
        <button
          ref={day2Ref}
          id="day-tab-2"
          role="tab"
          type="button"
          aria-selected={currentDay === 2}
          aria-controls="schedule-tabpanel"
          tabIndex={currentDay === 2 ? 0 : -1}
          onClick={() => onSelectDay(2)}
          onKeyDown={(e) => handleKeyDown(e, 2)}
          className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl transition-all cursor-pointer text-center relative overflow-hidden group ${
            currentDay === 2
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/40'
              : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          {currentDay === 2 && (
            <span className="absolute top-2 right-2 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-300 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
          )}

          <span className="font-hero text-lg sm:text-2xl font-black tracking-tight uppercase">
            DAY 02
          </span>
          <span className={`text-xs sm:text-sm font-semibold tracking-wider uppercase mt-0.5 ${
            currentDay === 2 ? 'text-blue-100' : 'text-slate-400'
          }`}>
            OCT 15, 2026
          </span>
          <span className={`text-[11px] mt-1 font-medium ${
            currentDay === 2 ? 'text-blue-200' : 'text-slate-500'
          }`}>
            {day2SessionCount} Sessions • 3 Parallel Tracks
          </span>
        </button>
      </div>
    </section>
  );
};
