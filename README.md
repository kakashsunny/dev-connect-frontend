# CONVERGE 2026 — Conference Schedule

An award-winning, accessible, and modern single-page technical conference schedule web application for **CONVERGE 2026** (Bengaluru, India • October 14–15, 2026). Engineered with a high-end editorial dark aesthetic, keyboard accessibility, and a fluid responsive layout down to 320px width without horizontal scrolling.

---

## Project Overview

**CONVERGE 2026** brings together engineers, researchers, and systems architects exploring **Artificial Intelligence**, **Web3 & Cloud Infrastructure**, and **Autonomous Robotics**. This web application serves as the interactive conference program guide, allowing attendees to explore plenaries and parallel tracks, search sessions in real time, view detailed speaker biographies and key takeaways in an accessible modal dialog, bookmark personal schedules, and export calendar invites.

---

## Features

* **Two-Day Schedule**: Seamlessly toggle between **Day 1 (Wednesday, Oct 14)** and **Day 2 (Thursday, Oct 15)** via keyboard-navigable WAI-ARIA tabs.
* **Three Parallel Tracks**:
  * **Track A**: *AI Futures* (Foundation models, multi-agent frameworks, neural architectures)
  * **Track B**: *Web3 & Cloud Systems* (Distributed infrastructure, zero-trust cryptographic security, eBPF)
  * **Track C**: *Robotics & Emerging Tech* (Autonomous machines, spatial compute, WebGPU, tactile UX)
* **Atmospheric Visual Layer**: Premium conference keynote atmosphere featuring deep obsidian navy tones (`#080B12`), crisp high-contrast typography, and electric blue accents (`#3B82F6`).
* **Accessible Modal Dialog**: Full session breakdown with speaker biographies, key takeaways, topic tags, `.ics` calendar download, and shareable URLs.
* **Live Search & Track Filtering**: Instant query filtering by session title, speaker name, topic tag, and experience level.
* **Local Schedule Persistence**: Bookmark sessions to build a personalized conference plan saved locally across browser sessions.
* **Screen Reader Live Announcements**: `aria-live="polite"` announces day switches, bookmark actions, and filtered search counts.

---

## Responsive Strategy

On narrow screens, the three parallel conference tracks are stacked vertically instead of remaining side-by-side. Three columns at 320px would make the content difficult to read and could introduce horizontal scrolling. Stacking the tracks preserves chronological order, keeps sessions readable, and maintains keyboard accessibility.

### Responsive Breakpoints

* **Desktop (`> 1000px`)**:
  * Displays a 4-column parallel schedule: Sticky Time Indicator + Track A (AI Futures), Track B (Web3 & Cloud), Track C (Robotics & UX).
  * Plenary sessions (Keynotes, Lunch Breaks, Closing Panels) span all three track columns for clear visual distinction.
  * Sticky track header bar remains visible during scroll.
* **Tablet (`700px – 1000px`)**:
  * Retains multi-column layout with compact typography and padding for high information density.
* **Mobile (`< 700px`) & 320px Viewport**:
  * Automatically switches to a vertically stacked chronological stream.
  * Each time slot is highlighted by a sticky time banner (e.g., `09:00 — 10:00`), followed sequentially by Track A, Track B, and Track C session cards.

### 320px Testing & Compliance
* **Zero Horizontal Scrolling**: Built with fluid percentage widths, `box-sizing: border-box`, `max-w-full`, and `overflow-x: hidden`.
* **Zero Text Clipping**: Text wraps cleanly across all cards and metadata badges.
* **Touch & Focus Targets**: Minimum 44px touch targets and generous spacing between clickable elements.

---

## Keyboard Navigation & Focus Management

The application is 100% operable without a mouse:

| Key | Action |
| --- | --- |
| `Tab` | Move forward to the next interactive element |
| `Shift + Tab` | Move backward to the previous interactive element |
| `Enter` | Activate focused session card to open details / activate button |
| `Space` | Activate focused session card / toggle session bookmark |
| `Escape` | Close session dialog or keyboard shortcuts modal |
| `←` / `→` | Switch between Day 1 and Day 2 tabs |
| `Home` / `End` | Jump to Day 1 or Day 2 tab |
| `?` | Open the Keyboard Navigation & Accessibility Guide |

### Focus Indicator
All interactive elements retain a high-contrast focus indicator conforming to WCAG 2.2 Level AA:
```css
:focus-visible {
  outline: 3px solid #3B82F6 !important;
  outline-offset: 3px !important;
}
```

---

## Dialog Behavior & Focus Trapping

When a session card is activated:
1. Focus automatically moves into the dialog, focusing the Close button.
2. Focus is trapped within the dialog boundary: pressing `Tab` on the last element wraps to the first element; pressing `Shift + Tab` on the first element wraps to the last.
3. Background page scrolling is locked (`overflow: hidden`).
4. Pressing `Escape` or clicking the Close button dismisses the dialog.
5. Focus is programmatically restored to the original session card button that opened the dialog.

---

## Accessibility Decisions (WCAG 2.2 AA)

1. **Semantic HTML**: Built with `<header>`, `<main>`, `<section>`, `<article>`, `<button>`, `<h3>`, `<nav>`, `<kbd>`, and `<select>`. No non-semantic clickable `<div>` elements.
2. **Valid HTML Nesting**: Zero nested interactive `<button>` elements (bookmark buttons and session details buttons are clean siblings within each card `<article>`).
3. **WAI-ARIA Attributes**: Proper use of `role="tablist"`, `role="tab"`, `role="tabpanel"`, `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and `aria-describedby`.
4. **Color Contrast**: Complies with WCAG AA standard (>4.5:1 ratio) on dark surfaces (`#080B12` and `#10151F`).
5. **Skip Navigation**: Keyboard users can jump straight to the schedule via the Skip Link (`.skip-link`).
6. **Motion Preferences**: Honors `@media (prefers-reduced-motion: reduce)` by disabling non-essential animations.

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Build for production
npm run build
```
