# CONVERGE 2026 — Conference Schedule

An award-winning, accessible, and modern single-page technical conference schedule web application for **CONVERGE 2026** (Bengaluru, India • October 14–15, 2026). Engineered with a high-end editorial dark aesthetic, keyboard accessibility, and a fluid responsive layout down to 320px width without horizontal scrolling.

---

## 🚀 Live Demo

**[View CONVERGE 2026 Live Demo]([https://agent-6aa4298db05d0237--inspiring-caramel-3c3506.netlify.app/](https://inspiring-caramel-3c3506.netlify.app/))**

---


## Project Overview

**CONVERGE 2026** brings together engineers, researchers, and systems architects exploring **Artificial Intelligence**, **Web3 & Cloud Infrastructure**, and **Autonomous Robotics**.

This web application serves as the interactive conference program guide, allowing attendees to explore plenaries and parallel tracks, search sessions in real time, view detailed speaker biographies and key takeaways in an accessible modal dialog, bookmark personal schedules, and export calendar invites.

The application also includes a **Public Repository Search** feature powered by the real GitHub REST API, demonstrating real-world API integration and distinct application states.

---

## Features

* **Two-Day Schedule**: Seamlessly toggle between **Day 1 (Wednesday, Oct 14)** and **Day 2 (Thursday, Oct 15)** via keyboard-navigable WAI-ARIA tabs.

* **Three Parallel Tracks**:
  * **Track A**: *AI Futures* (Foundation models, multi-agent frameworks, neural architectures)
  * **Track B**: *Web3 & Cloud Systems* (Distributed infrastructure, zero-trust cryptographic security, eBPF)
  * **Track C**: *Robotics & Emerging Tech* (Autonomous machines, spatial compute, WebGPU, tactile UX)

* **Atmospheric Visual Layer**: Premium conference keynote atmosphere featuring deep obsidian navy tones (`#080B12`), crisp high-contrast typography, and electric blue accents (`#3B82F6`).

* **Public Repository Search (GitHub API)**: Integrated live search querying the real GitHub REST API (`https://api.github.com/search/repositories?q={query}`) with repository results, star counts, programming languages, topic information, and direct external links.

* **Repository Search States**: The search experience clearly handles successful results, loading, empty results, and API errors through distinct UI states.

* **Accessible Modal Dialog**: Full session breakdown with speaker biographies, key takeaways, topic tags, `.ics` calendar download, and shareable URLs.

* **Live Search & Track Filtering**: Instant query filtering by session title, speaker name, topic tag, and experience level.

* **Local Schedule Persistence**: Bookmark sessions to build a personalized conference plan saved locally across browser sessions.

* **Screen Reader Live Announcements**: `aria-live="polite"` announces day switches, bookmark actions, filtered search counts, and dynamic repository search states.

---

# Public Repository Search

The application includes a live public repository search powered by the GitHub REST API.

### API Endpoint

```text
https://api.github.com/search/repositories?q={query}
```

The feature demonstrates real asynchronous data retrieval and provides meaningful feedback for every major request state.

### Repository Information

Search results can display:

- Repository name
- Repository description
- Star count
- Programming language
- Topic information
- Direct GitHub repository link

Users can submit searches using either the **Search** button or the **Enter** key.

---

## Responsive Strategy

On narrow screens, the three parallel conference tracks are stacked vertically instead of remaining side-by-side.

Three columns at 320px would make the content difficult to read and could introduce horizontal scrolling. Stacking the tracks preserves chronological order, keeps sessions readable, and maintains keyboard accessibility.

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
2. Focus is trapped within the dialog boundary: pressing `Tab` on the last element wraps to the first element; pressing `Shift + Tab` on the first element wraps to the last element.
3. Background page scrolling is locked (`overflow: hidden`).
4. Pressing `Escape` or clicking the Close button dismisses the dialog.
5. Focus is programmatically restored to the original session card button that opened the dialog.

---

## Accessibility Decisions (WCAG 2.2 AA)

1. **Semantic HTML**: Built with `<header>`, `<main>`, `<section>`, `<article>`, `<button>`, `<h3>`, `<nav>`, `<kbd>`, and `<select>`. No non-semantic clickable `<div>` elements.

2. **Valid HTML Nesting**: Zero nested interactive `<button>` elements. Bookmark buttons and session details buttons are clean siblings within each card `<article>`.

3. **WAI-ARIA Attributes**: Proper use of `role="tablist"`, `role="tab"`, `role="tabpanel"`, `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and `aria-describedby`.

4. **Color Contrast**: Designed to meet WCAG AA contrast requirements with high-contrast text on dark surfaces (`#080B12` and `#10151F`).

5. **Skip Navigation**: Keyboard users can jump straight to the schedule via the Skip Link (`.skip-link`).

6. **Motion Preferences**: Honors `@media (prefers-reduced-motion: reduce)` by disabling non-essential animations.

7. **Dynamic State Announcements**: Repository search loading, results, empty states, and errors use accessible dynamic messaging so users can understand changes without relying only on visual indicators.

---

# State and Data — Reviewer Guide

The **Public Repository Search** demonstrates real API-driven data and four distinct application states:

1. Successful Results
2. Loading
3. Empty Results
4. Error

All states are designed to be demonstrated directly through the user interface without editing the source code.

---

## 1. Successful Results

### How to demonstrate

1. Open the **Public Repository Search** section.
2. Enter:

```text
react
```

3. Click **Search** or press **Enter**.

### Expected result

The application queries the real GitHub REST API and displays public repository results.

Results can include:

- Repository name
- Repository description
- Star count
- Programming language
- Topics
- Direct GitHub link

This demonstrates a successful API request that returned data.

---

## 2. Loading State

### How to demonstrate

1. Enter a repository search query.
2. Submit the search.
3. Observe the interface while the API request is in progress.

### Expected result

The application displays:

> **Searching repositories...**

A loading indicator is displayed while the GitHub API request is being processed.

The loading state is visually and textually distinct from the results, empty state, and error state.

---

## 3. Empty State

### How to demonstrate

Search for the following intentionally unlikely query:

```text
zzzzzzzzzzzzzzzzzzzzzzzzzzzzxq987654321
```

### Expected result

The GitHub API request succeeds but returns zero matching repositories.

The application displays:

> **No repositories found**

Supporting guidance:

> **Try a different search term.**

### Important distinction

The empty state is **not an error**.

It means:

```text
API request succeeded
        ↓
0 repositories returned
        ↓
Display Empty State
```

This is intentionally different from a failed API request.

---

## 4. Error State

### How to demonstrate

Click the:

**Test Error State**

control in the Public Repository Search section.

### Expected result

The application intentionally demonstrates a failed request and displays:

> **Unable to load repositories.**

Supporting guidance:

> **Please check your connection and try again.**

A **Retry** button is also provided.

### Retry behavior

Click **Retry** to return to the normal repository search flow.

The reviewer can then perform a normal search again.

### Important distinction

The error state represents a **failed request**:

```text
API request failed
        ↓
Display Error State
        ↓
Offer Retry
```

This is different from an empty response, where the request succeeds but returns zero results.

---

## State Summary

| State | Reviewer Action | Expected Result |
| --- | --- | --- |
| ✅ Successful | Search `react` | Real GitHub repositories |
| 🔄 Loading | Submit a repository search | `Searching repositories...` |
| 📭 Empty | Search the provided random query | `No repositories found` |
| ❌ Error | Click `Test Error State` | Error message + Retry |

---

## Reviewer Checklist

- [ ] Successful GitHub API results can be demonstrated
- [ ] Loading state can be demonstrated
- [ ] Empty state can be demonstrated
- [ ] Error state can be demonstrated
- [ ] Loading state is visually distinct
- [ ] Empty state is visually distinct
- [ ] Error state is visually distinct
- [ ] Empty results are not presented as an error
- [ ] Error state provides a clear recovery action
- [ ] Retry functionality is available
- [ ] All required states can be demonstrated without editing source code
- [ ] Repository data comes from the real GitHub REST API
- [ ] Search works using the Search button
- [ ] Search works using the Enter key

---

## Getting Started

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

---

## Production Deployment

The application is deployed as a production web application using Netlify.

### Live Website

**[Open CONVERGE 2026](https://agent-6aa4298db05d0237--inspiring-caramel-3c3506.netlify.app/)**

---

## Project Architecture

The application is organized around several core experiences:

```text
CONVERGE 2026
│
├── Conference Schedule
│   ├── Day 1
│   ├── Day 2
│   ├── Track A — AI Futures
│   ├── Track B — Web3 & Cloud Systems
│   └── Track C — Robotics & Emerging Tech
│
├── Session Experience
│   ├── Session Details
│   ├── Speaker Biography
│   ├── Key Takeaways
│   ├── Bookmark
│   ├── Calendar Export
│   └── Share
│
├── Repository Search
│   ├── Search Input
│   ├── GitHub API
│   ├── Loading State
│   ├── Success State
│   ├── Empty State
│   └── Error State
│
└── Accessibility
    ├── Keyboard Navigation
    ├── Focus Management
    ├── Screen Reader Announcements
    ├── Skip Navigation
    └── Reduced Motion
```

---

## UX Principles

CONVERGE 2026 is designed around the following principles:

### Discoverability

Users should be able to understand the conference structure and discover relevant sessions quickly.

### Clarity

Large amounts of conference information are presented with clear hierarchy and intentional spacing.

### Accessibility

Important interactions are accessible through keyboard navigation and assistive technologies.

### Responsiveness

The experience adapts to desktop, tablet, and mobile layouts, including a 320px viewport.

### Real Data

The repository search demonstrates integration with a real external API rather than relying only on static mock data.

### Meaningful States

Loading, success, empty, and error states are clearly communicated so users always understand what the application is doing.

---

## Accessibility Checklist

- [x] Semantic HTML
- [x] WCAG 2.2 AA-focused design
- [x] Keyboard navigation
- [x] Visible focus indicators
- [x] WAI-ARIA tabs
- [x] Accessible modal dialog
- [x] Focus trapping
- [x] Focus restoration
- [x] Escape-to-close behavior
- [x] Screen-reader announcements
- [x] Skip navigation
- [x] Reduced-motion support
- [x] 44px minimum touch targets
- [x] Responsive layout
- [x] 320px viewport support
- [x] No horizontal scrolling
- [x] Accessible API state announcements

---

## Conference Tracks

| Track | Focus |
| --- | --- |
| 🔵 Track A | AI Futures |
| 🟣 Track B | Web3 & Cloud Systems |
| 🟦 Track C | Robotics & Emerging Tech |

---

## Conference

**CONVERGE 2026**

📍 Bengaluru, India  
📅 October 14–15, 2026  
🎯 Technical Engineering Summit

**Tracks:** AI Futures · Web3 & Cloud · Robotics & Emerging Tech

---

## Links

- 🌐 **[Live Demo](https://agent-6aa4298db05d0237--inspiring-caramel-3c3506.netlify.app/)**
- 💻 **[GitHub Repository](https://github.com/kakashsunny/dev-connect-frontend)**

---

## License

This project is available under the license specified in the repository.

---

> **CONVERGE 2026 — Where ideas become what’s next.**
