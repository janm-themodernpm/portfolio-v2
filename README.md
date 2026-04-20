# Portfolio — Design System

A personal portfolio for Jan Patrick McGhee, senior PM. Built as static HTML/CSS/JS with no build step. The design commits to an **editorial** direction: serif-led typography, generous whitespace, printed-page rhythm, and restrained color. It borrows from long-form magazine layouts and PM portfolios like Julie Zhuo's and Jason Yuan's — confident, text-first, and unapologetic about reading time.

---

## Aesthetic direction

**Editorial, print-inspired, quietly confident.**

The site reads like a feature article, not a landing page. Case studies are numbered, sectioned, and paced. Typography does most of the work; decoration is almost entirely absent. The only ornament is a single warm accent color used sparingly for emphasis and wayfinding.

Three aesthetic modes are available via the Tweaks panel:
- **Editorial** (default) — Instrument Serif + Inter, warm off-white paper
- **Monolith** — JetBrains Mono throughout, Swiss grid, high-contrast neutrals
- **Studio** — rounded sans, warm paper, softer feel

Light and dark themes are both first-class.

---

## Typography

| Role | Family | Weights | Usage |
|---|---|---|---|
| Display | **Instrument Serif** | 400, 400 italic | Hero headlines, case-study titles, large stat numerals, pullquotes |
| Body & UI | **Inter** | 300, 400, 500, 600, 700 | All running text, labels, nav, buttons |
| Mono | **JetBrains Mono** | 400, 500 | Eyebrows, section numbers, meta labels, footer mark |

**Type scale (editorial mode):**

| Token | Size | Line-height | Used for |
|---|---|---|---|
| Display XL | 96–128px | 0.95 | Landing hero headline |
| Display L | 64–88px | 1.0 | Case-study titles |
| H2 | 40–56px | 1.15 | Section headings |
| H3 | 22–28px | 1.3 | Card titles, role titles |
| Body L | 20–22px | 1.55 | Case-study prose, lede |
| Body | 16–17px | 1.6 | Default running text |
| Meta | 12–13px | 1.4 | Mono labels, eyebrows, nav |

Italics are reserved for emphasis inside serif headlines — they carry a lot of the editorial voice.

---

## Color

Minimal palette. One accent, one ink, layered paper tones. Everything else is a neutral derived from OKLCH stops.

### Light theme

| Token | Value | Role |
|---|---|---|
| `--paper` | `#faf7f2` | Page background (warm off-white) |
| `--paper-2` | `#f2ece2` | Raised surface, card backgrounds |
| `--ink` | `#1a1814` | Primary text |
| `--ink-2` | `#4a4640` | Secondary text |
| `--muted` | `#8a847a` | Tertiary text, meta labels |
| `--line` | `#e5dfd3` | Hairlines, dividers |
| `--accent` | `#c8542c` | Single accent — links, highlights, CTAs |
| `--accent-soft` | `#e89a7a` | Accent backgrounds, hover tints |

### Dark theme

| Token | Value | Role |
|---|---|---|
| `--paper` | `#141210` | Page background |
| `--paper-2` | `#1f1c18` | Raised surface |
| `--ink` | `#f2ece2` | Primary text |
| `--ink-2` | `#b8b0a4` | Secondary text |
| `--muted` | `#7a7468` | Tertiary text |
| `--line` | `#2a2620` | Hairlines |
| `--accent` | `#e89a7a` | Accent — lighter in dark mode for contrast |

**Rules:**
- Accent never runs more than ~5% of the visible viewport at once.
- No gradients in backgrounds or buttons. Reserved for the Spec-Check radar chart glow only.
- Ink on paper, not paper on ink — dark mode is the exception, not the default.

---

## Spacing & layout

**Grid:** 12-column max-width container at 1200px; case-study body narrows to ~720px for readability.

**Spacing scale** (rem-based, 4px root):

| Token | Value | Use |
|---|---|---|
| xs | 4px | Icon padding, inline gaps |
| s | 8px | Tag padding, tight stacks |
| m | 16px | Default stack gap |
| l | 24px | Card inner padding |
| xl | 40px | Section-to-section inside a card |
| 2xl | 64px | Major section spacing |
| 3xl | 120px | Between top-level page sections |

**Rhythm:** case-study sections sit on ~120px vertical spacing. Hero sections get ~160px. The page breathes on purpose — density is for the body copy, not the layout.

**Radii:** `2px` for hairlines only. `6px` for cards, buttons, pills. No pill-shapes; no giant rounded corners.

---

## Components

### Nav
Fixed top, paper-colored with a hairline bottom border. Brand mark + name on the left, section links in mono-style weight on the right, theme toggle far right.

### Hero
Oversized serif headline with italicized emphasis on key nouns. Mono eyebrow above, short lede below, stats row with large serif numerals that count up on scroll.

### Project card
Media panel on top, body below. Tags in mono caps, title in serif, kicker in italic serif, description in body sans. Hover reveals a cursor-following label ("Read case study"). No shadow on rest; subtle lift on hover.

### Case-study body
- Numbered sections (`01 / Heading`, `02 / Heading` etc.) in mono eyebrow
- Section headings are serif, 40–56px, with the number in mono inline
- Pullquotes get a left hairline, italic serif, ~20% larger than body
- Outcome blocks are a 4-up grid of large serif numerals + mono labels

### Timeline (experience)
Vertical list, year range left-aligned in mono, role title in serif, org + location in sans. Metric bullets get bolded leading phrase (`$15.3M in revenue`) to make scan-ability work without icons.

### Footer
Two-line. Copyright left, mono tagline right.

### Cursor label
A custom floating label that follows the mouse on interactive elements — reveals context like "Read case study" or "Preview" without cluttering the card.

---

## Motion

- **Count-up numerals** on scroll-into-view for hero stats.
- **Fade + slight rise** on section reveal (12–16px, 400ms).
- **Hover lifts** of 2–3px on project cards (no shadow blooms).
- **Radar chart** on Spec-Check case study uses a 700ms cubic-bezier ease when scenarios change; number counts up in sync.
- Everything else is instant. Motion is a last resort, not a default.

---

## Voice & copy

- **First person, reflective.** Cases are written as narrative ("I got tired of the same pattern…") not as resume bullets.
- **Italics carry emphasis** in prose; bold is reserved for metric-leading bullets.
- **No jargon without reason.** If a term like "JTBD" appears, it's because it's load-bearing.
- **Quotes and pullquotes** punctuate long sections — one sharp sentence, set off.
- **Headings argue something.** "Adults don't quit sports because they get old. They quit because showing up feels risky." — not "The problem."

---

## Tech

- **No framework, no build step.** Plain HTML, one shared CSS file (`assets/site.css`), one shared JS file (`assets/site.js`).
- **Fonts** loaded from Google Fonts CDN.
- **Theme & aesthetic toggle** persisted to `localStorage`; defaults honor `prefers-color-scheme` on first load.
- **Tweaks protocol** — the site exposes a small `__edit_mode` postMessage handshake that surfaces an in-page Tweaks panel for cycling aesthetics and themes.
- **Hosting:** GitHub Pages. All paths are relative so it works under any sub-path.

---

## Credits

Designed and built by Jan Patrick McGhee, with AI assistance from Claude. Typography via Google Fonts.
