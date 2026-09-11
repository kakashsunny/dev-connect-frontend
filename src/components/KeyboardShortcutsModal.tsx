import React, { useEffect, useRef } from 'react';
import { X, Keyboard, ArrowRight, CornerDownLeft, ShieldCheck } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const prevActive = document.activeElement as HTMLElement;
    document.body.style.overflow = 'hidden';

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
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
      if (prevActive && typeof prevActive.focus === 'function') {
        prevActive.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Tab', description: 'Move forward to next interactive element' },
    { key: 'Shift + Tab', description: 'Move backward to previous element' },
    { key: 'Enter', description: 'Activate focused session card / button' },
    { key: 'Space', description: 'Activate focused element / toggle saved session' },
    { key: 'Escape', description: 'Close session dialog or shortcuts modal' },
    { key: '← / →', description: 'Switch between Day 1 and Day 2 tabs' },
    { key: '?', description: 'Open this accessibility & shortcuts guide' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity modal-backdrop-animate"
      />

      <div
        ref={dialogRef}
        className="relative w-full max-w-lg bg-[#10151F] border border-white/15 rounded-3xl shadow-2xl text-[#F5F7FA] overflow-hidden z-10 my-auto modal-dialog-animate"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#080B12]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Keyboard className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h2 id="shortcuts-title" className="font-hero text-base sm:text-lg font-bold text-white">
                Keyboard Navigation & Accessibility
              </h2>
              <p className="text-xs text-slate-400">
                100% usable without a mouse (WCAG 2.2 AA)
              </p>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close shortcuts guide"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content Table */}
        <div className="p-4 sm:p-6 space-y-4">
          <div className="rounded-xl border border-white/10 overflow-hidden bg-[#080B12]">
            <table className="w-full text-xs text-left">
              <thead className="bg-white/5 border-b border-white/10 text-slate-300 font-mono uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-2.5 px-3.5 font-bold">Key</th>
                  <th className="py-2.5 px-3.5 font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {shortcuts.map((item) => (
                  <tr key={item.key} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3.5 font-mono font-semibold text-blue-400 whitespace-nowrap">
                      <kbd className="px-2 py-1 rounded bg-[#10151F] border border-white/15 text-xs text-white shadow-xs">
                        {item.key}
                      </kbd>
                    </td>
                    <td className="py-2.5 px-3.5 leading-relaxed">{item.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />
            <p>
              High contrast focus indicators (<code className="text-blue-300 font-mono">outline: 3px solid #3B82F6</code>) are maintained throughout the entire interface for screen readers, keyboard-only attendees, and switch devices.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#080B12] text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
