import React from 'react';
import { HelpCircle, Sparkles } from 'lucide-react';

interface FooterProps {
  onOpenShortcuts: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenShortcuts }) => {
  return (
    <footer className="w-full bg-[#080B12] border-t border-white/10 mt-16 py-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="font-hero text-sm font-bold text-white tracking-wider uppercase">
              CONVERGE 2026
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-blue-400 font-medium">Ideas · Technology · People</span>
          </div>
          <p className="text-[11px] text-slate-500">
            October 14–15, 2026 • Bengaluru Arena, India. © 2026 CONVERGE Conference.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <button
            type="button"
            onClick={onOpenShortcuts}
            className="text-slate-300 hover:text-blue-400 font-medium underline underline-offset-4 focus:outline-hidden transition-colors flex items-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Keyboard Controls & Accessibility</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
