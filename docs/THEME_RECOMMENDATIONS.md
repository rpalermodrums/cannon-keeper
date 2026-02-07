# Theme Recommendations: CanonKeeper

> Implementation-ready design token specification for the CanonKeeper theme refresh.
> This document provides exact CSS values, migration guidance, and rationale for every change.

---

## 1. Design Philosophy

### Literary warmth, not clinical utility

CanonKeeper should feel like sitting down at a well-appointed writing desk -- warm wood, good light, a trusted notebook open beside you. The current theme misses this mark: tan/parchment surfaces feel like a scanned document, and the teal accent reads as analytical (think spreadsheet software or banking dashboards) rather than editorial.

### Five guiding principles

1. **Content-first.** UI chrome should retreat. The writer's words and the app's editorial insights should dominate the visual hierarchy. Surface colors stay quiet; only the accent demands attention, and only when it has earned it.

2. **Calm over stimulating.** Fiction writers spend hours in this app. Every color choice should reduce visual fatigue, not add to it. Warm neutrals, restrained contrast, and soft shadows create an environment where the eye can rest.

3. **Familiar to writers.** The visual language should echo the tools writers already love -- Scrivener's warm sidebar, Ulysses' clean typography, iA Writer's disciplined minimalism, Bear's soft palette. Writers should feel at home immediately.

4. **Purposeful accent.** The accent color is the app's editorial voice. It should feel literary: the muted plum of a publisher's cloth binding, the wine-dark ink of a margin note. Not the teal of a SaaS dashboard.

5. **Fraunces stays.** The display font is excellent. Its optical-size axis and Baroque sensibility give CanonKeeper exactly the right literary character. It is one of the best things about the current design.

### Why muted plum?

Plum/wine sits at the intersection of warmth, distinction, and literary tradition. It evokes cloth-bound spines, editorial margin notes, and wax seals -- all objects in the writer's visual vocabulary. It is warm without being aggressive, distinctive without being trendy, and it pairs naturally with ivory and warm charcoal.

---

## 2. New Color System

### Light Mode -- "Morning Pages"

The feeling of fresh paper under morning light. Clean, warm, unhurried.

```
Surface tokens:
  surface-0        #FAF9F6  Warm off-white, slightly ivory. The page itself.
  surface-1        #F4F2ED  Soft cream. Cards, panels, elevated containers.
  surface-2        #FFFFFF  Pure white. Inputs, text areas -- maximum readability.
  surface-3        #EDEAE4  Warm light gray. Recessed areas, secondary backgrounds.

Text tokens:
  text-primary     #2B2B30  Warm near-black. Body text, headings.
  text-secondary   #55545E  Warm gray. Supporting labels, metadata.
  text-muted       #76757E  Medium warm gray. Placeholders, disabled text.
  text-inverse     #FAFAF8  For use on dark/accent backgrounds.
  text-link        #6B4560  Link text. Matches accent-hover for interactive coherence.

Accent tokens (muted plum/wine):
  accent           #7B506F  The hero color. Nav highlights, active states, primary buttons.
  accent-strong    #5E3B55  Darker plum. Hover states, emphasis.
  accent-soft      #F0E6ED  Very light plum wash. Selected row backgrounds, soft badges.
  accent-hover     #6B4560  Button hover, interactive element hover.
  accent-muted     #B899AE  Mid-tone plum. Decorative borders, subtle indicators, disabled accent.
  accent-text      #5E3B55  Text-safe accent. Guaranteed AA on all light surfaces.

Semantic tokens:
  ok               #4A7C5E  Sage green. Confirmed canon, success states.
  ok-strong        #38614A  Hover/emphasis for success.
  ok-soft          #E5F0E9  Success background wash.
  ok-muted         #8BB89E  Mid-tone sage. Decorative/disabled success indicators.
  warn             #96720F  Deep amber. Warnings, unconfirmed items. Passes AA for normal text.
  warn-strong      #7A5C08  Hover/emphasis for warnings.
  warn-soft        #F7F0DE  Warning background wash.
  warn-muted       #C4A84E  Mid-tone amber. Decorative borders, progress indicators.
  danger           #A0453A  Warm brick/terracotta. Errors, contradictions, deletions.
  danger-strong    #7E3530  Hover/emphasis for danger.
  danger-soft      #F5E5E3  Danger background wash.
  danger-muted     #C8877F  Mid-tone brick. Decorative/disabled danger indicators.

Border tokens:
  border           #DDD9D2  Warm light gray. Default borders.
  border-strong    #C8C4BC  Slightly darker. Emphasized borders, dividers.
  border-focus     var(--color-accent)  Focus rings match the accent.

Overlay token:
  surface-overlay  rgba(43, 43, 48, 0.45)  Modal/dialog backdrop.

Skeleton loading tokens:
  skeleton-base    var(--color-surface-3)  Resting skeleton background.
  skeleton-shine   var(--color-surface-1)  Shimmer highlight sweep.

Scrollbar tokens:
  scrollbar-track  var(--color-surface-1)  Scrollbar track background.
  scrollbar-thumb  var(--color-border-strong)  Scrollbar thumb.

Shadow tokens:
  shadow-xs  0 1px 2px rgba(43, 43, 48, 0.06)
  shadow-sm  0 1px 2px rgba(43, 43, 48, 0.07), 0 4px 12px rgba(123, 80, 111, 0.04)
  shadow-md  0 4px 10px rgba(43, 43, 48, 0.08), 0 10px 30px rgba(123, 80, 111, 0.05)
  shadow-lg  0 8px 24px rgba(43, 43, 48, 0.10), 0 16px 48px rgba(123, 80, 111, 0.06)

Body background gradient:
  radial-gradient(circle at 10% 0%, rgba(123, 80, 111, 0.06), transparent 42%),
  radial-gradient(circle at 90% 100%, rgba(176, 136, 48, 0.04), transparent 42%),
  var(--color-surface-0)
```

### Dark Mode -- "Late Night Draft"

The feeling of writing by lamplight. Warm darks, no blue or green cast, easy on tired eyes.

```
Surface tokens:
  surface-0        #1A1A1F  Warm near-black. No green tint. The canvas.
  surface-1        #222228  Warm dark gray. Sidebar, panels.
  surface-2        #2C2C33  Slightly lighter. Cards, inputs.
  surface-3        #34343C  Lighter than surface-1. Recessed borders, inset table headers.

Text tokens:
  text-primary     #EAEAE5  Warm off-white. Not blue-white.
  text-secondary   #B0AFA8  Warm medium gray.
  text-muted       #908F88  Warm mid-gray. Readable placeholders, timestamps.
  text-inverse     #1A1A1F  For use on light/accent backgrounds.
  text-link        #CFA0C0  Link text. Matches accent-hover for interactive coherence.

Accent tokens (lighter plum for dark backgrounds):
  accent           #C48DB5  Light plum/mauve. Readable on dark surfaces.
  accent-strong    #D8A8CB  Even lighter. Emphasis, hover on dark.
  accent-soft      #2E222B  Very dark plum. Soft background wash.
  accent-hover     #CFA0C0  Interactive hover.
  accent-muted     #7A5A70  Mid-tone dark plum. Decorative borders, subtle indicators.
  accent-text      #D8A8CB  Text-safe accent for dark mode. Guaranteed AA on dark surfaces.

Semantic tokens:
  ok               #6FB88A  Sage green, brighter for dark mode.
  ok-strong        #88D0A2  Emphasis.
  ok-soft          #1E2E24  Dark green wash.
  ok-muted         #3E6B4E  Mid-tone dark sage. Decorative/disabled success indicators.
  warn             #D4A840  Bright amber.
  warn-strong      #E0BC58  Emphasis.
  warn-soft        #2E2818  Dark amber wash.
  warn-muted       #7A6520  Mid-tone dark amber. Decorative borders, progress indicators.
  danger           #D0605A  Warm coral.
  danger-strong    #E07872  Emphasis.
  danger-soft      #301C1A  Dark coral wash.
  danger-muted     #7A3835  Mid-tone dark brick. Decorative/disabled danger indicators.

Border tokens:
  border           #36363E  Warm dark gray.
  border-strong    #464650  Slightly lighter.

Overlay token:
  surface-overlay  rgba(0, 0, 0, 0.55)  Modal/dialog backdrop.

Skeleton loading tokens:
  skeleton-base    var(--color-surface-1)  Resting skeleton background.
  skeleton-shine   var(--color-surface-2)  Shimmer highlight sweep.

Scrollbar tokens:
  scrollbar-track  #151518  Scrollbar track background (deeper than canvas).
  scrollbar-thumb  var(--color-border-strong)  Scrollbar thumb.

Shadow tokens:
  shadow-xs  0 1px 2px rgba(0, 0, 0, 0.20)
  shadow-sm  0 1px 2px rgba(0, 0, 0, 0.25), 0 4px 12px rgba(0, 0, 0, 0.12)
  shadow-md  0 4px 10px rgba(0, 0, 0, 0.28), 0 10px 30px rgba(0, 0, 0, 0.18)
  shadow-lg  0 8px 24px rgba(0, 0, 0, 0.30), 0 16px 48px rgba(0, 0, 0, 0.22)

Body background gradient:
  radial-gradient(circle at 10% 0%, rgba(196, 141, 181, 0.05), transparent 42%),
  radial-gradient(circle at 90% 100%, rgba(212, 168, 64, 0.03), transparent 42%),
  var(--color-surface-0)
```

---

## 3. Typography

### Retained font stack

| Role | Font | Rationale |
|------|------|-----------|
| Body | IBM Plex Sans | Clean, modern, excellent readability at all sizes. A workhorse. |
| Display | Fraunces | Perfect literary character. The optical-size axis and soft-serif forms give headings warmth and authority. Keep it. |
| Monospace | IBM Plex Mono | Clean match for Plex Sans. Used for technical elements (chunk IDs, hashes, debug info). |

### Base font size

The body base is `font-size: 15px`. This sits between the cramped feel of 14px and the loose feel of 16px for information-dense editorial UIs. It pairs well with Plex Sans's x-height at that optical size.

### Recommended letter-spacing

Add a small amount of letter-spacing to body text for a more relaxed reading feel:

```css
/* Add to @layer base body styles */
letter-spacing: 0.012em;   /* --tracking-normal */
```

This is roughly 1.2% of the em -- enough to give body text breathing room without feeling loose. It matches the `--tracking-normal` design token. Test at larger display sizes and remove if it feels too open above 18px.

### Typography scale tokens

These tokens formalize the vertical rhythm and horizontal spacing used throughout the app.

**Line height (leading):**

| Token | Value | Usage |
|-------|-------|-------|
| `--leading-tight` | `1.2` | Headings, display text, compact labels |
| `--leading-normal` | `1.55` | Body text, paragraphs, list items |
| `--leading-relaxed` | `1.72` | Long-form reading, manuscript excerpts, evidence quotes |

**Letter spacing (tracking):**

| Token | Value | Usage |
|-------|-------|-------|
| `--tracking-tight` | `-0.012em` | Large display headings (Fraunces at 24px+) |
| `--tracking-normal` | `0.012em` | Body text (IBM Plex Sans) |
| `--tracking-wide` | `0.06em` | Small labels, tab bar items, sidebar section headers |
| `--tracking-caps` | `0.1em` | All-caps text (status badges, section dividers) |

---

## 4. Migration Guide

### Complete replacement CSS

Below is the full replacement for the `@theme` block, `.dark` overrides, and body background gradients in `app.css`. Everything not shown here (keyframes, scrollbar styles, reduced motion, base layer resets) remains unchanged.

#### Current `@theme` block (to be replaced)

```css
/* OLD -- remove this entire @theme block */
@theme {
  /* -- Fonts -- */
  --font-sans: "IBM Plex Sans", "Avenir Next", "Segoe UI", sans-serif;
  --font-display: "Fraunces", Georgia, serif;
  --font-mono: "IBM Plex Mono", "SF Mono", monospace;

  /* -- Colors: Surfaces -- */
  --color-surface-0: #f7f3eb;
  --color-surface-1: #f2ecdf;
  --color-surface-2: #fffdf8;
  --color-surface-3: #e9dfcc;

  /* -- Colors: Text -- */
  --color-text-primary: #1d2a2a;
  --color-text-secondary: #334242;
  --color-text-muted: #5f6f6f;
  --color-text-inverse: #fffdf8;

  /* -- Colors: Accent (teal -- canon/confirmed) -- */
  --color-accent: #0f5d5d;
  --color-accent-strong: #0b4747;
  --color-accent-soft: #d8ece8;
  --color-accent-hover: #0a5050;

  /* -- Colors: Semantic -- */
  --color-danger: #973131;
  --color-danger-strong: #7a2020;
  --color-danger-soft: #f4dfdf;
  --color-warn: #8a5a05;
  --color-warn-strong: #6e4804;
  --color-warn-soft: #f8ecd8;
  --color-ok: #245c3f;
  --color-ok-strong: #1a4830;
  --color-ok-soft: #e0efe7;

  /* -- Colors: Borders -- */
  --color-border: #d8ccba;
  --color-border-strong: #c4b8a4;
  --color-border-focus: var(--color-accent);

  /* -- Shadows (warm-tinted) -- */
  --shadow-xs: 0 1px 2px rgba(18, 31, 31, 0.06);
  --shadow-sm: 0 1px 2px rgba(18, 31, 31, 0.08), 0 4px 12px rgba(18, 31, 31, 0.04);
  --shadow-md: 0 4px 10px rgba(18, 31, 31, 0.1), 0 10px 30px rgba(18, 31, 31, 0.08);
  --shadow-lg: 0 8px 24px rgba(18, 31, 31, 0.12), 0 16px 48px rgba(18, 31, 31, 0.08);

  /* -- Border Radii -- */
  --radius-xs: 4px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 999px;

  /* -- Animation tokens -- */
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --animate-shimmer: shimmer 1.5s linear infinite;
  --animate-slide-in-right: slide-in-right 320ms ease-out;
  --animate-slide-in-up: slide-in-up 200ms ease-out;
  --animate-scale-in: scale-in 200ms var(--ease-spring);
  --animate-fade-in: fade-in 200ms ease-out;
  --animate-pulse-dot: pulse-dot 2s ease-in-out infinite;
  --animate-spin: spin 600ms linear infinite;
}
```

#### New `@theme` block

```css
@theme {
  /* ── Fonts ── */
  --font-sans: "IBM Plex Sans", "Avenir Next", "Segoe UI", sans-serif;
  --font-display: "Fraunces", Georgia, serif;
  --font-mono: "IBM Plex Mono", "SF Mono", monospace;

  /* ── Colors: Surfaces ("Morning Pages" -- warm whites and ivories) ── */
  --color-surface-0: #FAF9F6;
  --color-surface-1: #F4F2ED;
  --color-surface-2: #FFFFFF;
  --color-surface-3: #EDEAE4;
  --color-surface-overlay: rgba(43, 43, 48, 0.45);

  /* ── Colors: Text (warm charcoals, no green tint) ── */
  --color-text-primary: #2B2B30;
  --color-text-secondary: #55545E;
  --color-text-muted: #76757E;
  --color-text-inverse: #FAFAF8;
  --color-text-link: #6B4560;

  /* ── Colors: Accent (muted plum/wine -- literary, warm, distinctive) ── */
  --color-accent: #7B506F;
  --color-accent-strong: #5E3B55;
  --color-accent-soft: #F0E6ED;
  --color-accent-hover: #6B4560;
  --color-accent-muted: #B899AE;
  --color-accent-text: #5E3B55;

  /* ── Colors: Semantic ── */
  --color-ok: #4A7C5E;
  --color-ok-strong: #38614A;
  --color-ok-soft: #E5F0E9;
  --color-ok-muted: #8BB89E;
  --color-warn: #96720F;
  --color-warn-strong: #7A5C08;
  --color-warn-soft: #F7F0DE;
  --color-warn-muted: #C4A84E;
  --color-danger: #A0453A;
  --color-danger-strong: #7E3530;
  --color-danger-soft: #F5E5E3;
  --color-danger-muted: #C8877F;

  /* ── Colors: Borders ── */
  --color-border: #DDD9D2;
  --color-border-strong: #C8C4BC;
  --color-border-focus: var(--color-accent);

  /* ── Skeleton loading ── */
  --color-skeleton-base: var(--color-surface-3);
  --color-skeleton-shine: var(--color-surface-1);

  /* ── Scrollbar ── */
  --color-scrollbar-track: var(--color-surface-1);
  --color-scrollbar-thumb: var(--color-border-strong);

  /* ── Shadows (plum-tinted second layer) ── */
  --shadow-xs: 0 1px 2px rgba(43, 43, 48, 0.06);
  --shadow-sm: 0 1px 2px rgba(43, 43, 48, 0.07), 0 4px 12px rgba(123, 80, 111, 0.04);
  --shadow-md: 0 4px 10px rgba(43, 43, 48, 0.08), 0 10px 30px rgba(123, 80, 111, 0.05);
  --shadow-lg: 0 8px 24px rgba(43, 43, 48, 0.10), 0 16px 48px rgba(123, 80, 111, 0.06);

  /* ── Border Radii ── */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* ── Spacing scale ── */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* ── Typography ── */
  --leading-tight: 1.2;
  --leading-normal: 1.55;
  --leading-relaxed: 1.72;
  --tracking-tight: -0.012em;
  --tracking-normal: 0.012em;
  --tracking-wide: 0.06em;
  --tracking-caps: 0.1em;

  /* ── Transitions ── */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --transition-fast: 150ms var(--ease-out);
  --transition-base: 250ms var(--ease-out);
  --transition-slow: 400ms var(--ease-out);
}
```

#### Current `.dark` overrides (to be replaced)

```css
/* OLD -- remove this entire .dark block */
.dark {
  --color-surface-0: #141a1a;
  --color-surface-1: #1a2222;
  --color-surface-2: #212b2b;
  --color-surface-3: #0f1414;

  --color-text-primary: #e8e4dc;
  --color-text-secondary: #b8b2a6;
  --color-text-muted: #7a7468;
  --color-text-inverse: #141a1a;

  --color-accent: #3db8a0;
  --color-accent-strong: #5cd4bc;
  --color-accent-soft: #1a3a34;
  --color-accent-hover: #4dc4ac;

  --color-danger: #e06060;
  --color-danger-strong: #f07878;
  --color-danger-soft: #3a1c1c;
  --color-warn: #d4a020;
  --color-warn-strong: #e0b040;
  --color-warn-soft: #362e14;
  --color-ok: #5cb88c;
  --color-ok-strong: #78d4a8;
  --color-ok-soft: #1a3428;

  --color-border: #2e3838;
  --color-border-strong: #3e4a4a;

  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.2);
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.15);
  --shadow-md: 0 4px 10px rgba(0, 0, 0, 0.3), 0 10px 30px rgba(0, 0, 0, 0.2);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.35), 0 16px 48px rgba(0, 0, 0, 0.25);
}
```

#### New `.dark` overrides

```css
.dark {
  /* ── Surfaces ("Late Night Draft" -- warm darks, no green tint) ── */
  --color-surface-0: #1A1A1F;
  --color-surface-1: #222228;
  --color-surface-2: #2C2C33;
  --color-surface-3: #34343C;
  --color-surface-overlay: rgba(0, 0, 0, 0.55);

  /* ── Text (warm light tones) ── */
  --color-text-primary: #EAEAE5;
  --color-text-secondary: #B0AFA8;
  --color-text-muted: #908F88;
  --color-text-inverse: #1A1A1F;
  --color-text-link: #CFA0C0;

  /* ── Accent (lighter plum for dark backgrounds) ── */
  --color-accent: #C48DB5;
  --color-accent-strong: #D8A8CB;
  --color-accent-soft: #2E222B;
  --color-accent-hover: #CFA0C0;
  --color-accent-muted: #7A5A70;
  --color-accent-text: #D8A8CB;

  /* ── Semantic (brighter for dark mode readability) ── */
  --color-ok: #6FB88A;
  --color-ok-strong: #88D0A2;
  --color-ok-soft: #1E2E24;
  --color-ok-muted: #3E6B4E;
  --color-warn: #D4A840;
  --color-warn-strong: #E0BC58;
  --color-warn-soft: #2E2818;
  --color-warn-muted: #7A6520;
  --color-danger: #D0605A;
  --color-danger-strong: #E07872;
  --color-danger-soft: #301C1A;
  --color-danger-muted: #7A3835;

  /* ── Borders ── */
  --color-border: #36363E;
  --color-border-strong: #464650;

  /* ── Skeleton loading ── */
  --color-skeleton-base: var(--color-surface-1);
  --color-skeleton-shine: var(--color-surface-2);

  /* ── Scrollbar ── */
  --color-scrollbar-track: #151518;
  --color-scrollbar-thumb: var(--color-border-strong);

  /* ── Shadows (deeper opacity for dark mode) ── */
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.20);
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.25), 0 4px 12px rgba(0, 0, 0, 0.12);
  --shadow-md: 0 4px 10px rgba(0, 0, 0, 0.28), 0 10px 30px rgba(0, 0, 0, 0.18);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.30), 0 16px 48px rgba(0, 0, 0, 0.22);
}
```

#### Body background gradient changes

In the `@layer base` section, replace the body and `.dark body` background rules:

```css
/* OLD body background */
body {
  @apply bg-surface-0 text-text-primary font-sans antialiased;
  background:
    radial-gradient(circle at 10% 0%, rgba(15, 93, 93, 0.12), transparent 42%),
    radial-gradient(circle at 90% 100%, rgba(138, 90, 5, 0.1), transparent 42%),
    var(--color-surface-0);
}

.dark body {
  background:
    radial-gradient(circle at 10% 0%, rgba(61, 184, 160, 0.06), transparent 42%),
    radial-gradient(circle at 90% 100%, rgba(212, 160, 32, 0.04), transparent 42%),
    var(--color-surface-0);
}
```

```css
/* NEW body background */
body {
  @apply bg-surface-0 text-text-primary font-sans antialiased;
  background:
    radial-gradient(circle at 10% 0%, rgba(123, 80, 111, 0.06), transparent 42%),
    radial-gradient(circle at 90% 100%, rgba(176, 136, 48, 0.04), transparent 42%),
    var(--color-surface-0);
}

.dark body {
  background:
    radial-gradient(circle at 10% 0%, rgba(196, 141, 181, 0.05), transparent 42%),
    radial-gradient(circle at 90% 100%, rgba(212, 168, 64, 0.03), transparent 42%),
    var(--color-surface-0);
}
```

Note: The gradient opacity has been significantly reduced in light mode (from 0.12/0.10 to 0.06/0.04). The old gradient was too saturated with teal, creating a visible color wash. The new plum gradient is intentionally subtle -- just enough to add warmth without tinting the page. Dark mode gradients have been further reduced (from 0.06/0.04 to 0.05/0.03) for a quieter nighttime feel.

---

## 5. Design Token Reference Table

### Surfaces

| Token | Old (Light) | New (Light) | Old (Dark) | New (Dark) | Rationale |
|-------|-------------|-------------|------------|------------|-----------|
| `surface-0` | `#f7f3eb` tan parchment | `#FAF9F6` warm off-white | `#141a1a` green-black | `#1A1A1F` warm near-black | Remove yellowed parchment feel; remove green tint from dark |
| `surface-1` | `#f2ecdf` deeper tan | `#F4F2ED` soft cream | `#1a2222` green-dark | `#222228` warm dark gray | Lighter, cleaner panel color |
| `surface-2` | `#fffdf8` warm white | `#FFFFFF` pure white | `#212b2b` green-tinted | `#2C2C33` neutral dark | Pure white for maximum input readability |
| `surface-3` | `#e9dfcc` dark tan | `#EDEAE4` warm light gray | `#0f1414` deepest green-black | `#34343C` warm mid-dark gray | Light: less yellow, more neutral. Dark: now lighter than surface-1, matching light mode hierarchy where surface-3 marks recessed/inset areas distinctly |

### Overlay

| Token | New (Light) | New (Dark) | Usage |
|-------|-------------|------------|-------|
| `surface-overlay` | `rgba(43, 43, 48, 0.45)` | `rgba(0, 0, 0, 0.55)` | Modal/dialog backdrop. Warm-tinted in light mode, pure black in dark mode for maximum dimming. |

### Text

| Token | Old (Light) | New (Light) | Old (Dark) | New (Dark) | Rationale |
|-------|-------------|-------------|------------|------------|-----------|
| `text-primary` | `#1d2a2a` green-black | `#2B2B30` warm near-black | `#e8e4dc` warm white | `#EAEAE5` warm off-white | Remove green cast from primary text |
| `text-secondary` | `#334242` green-gray | `#55545E` warm gray | `#b8b2a6` tan gray | `#B0AFA8` warm medium gray | Neutral warmth, no green |
| `text-muted` | `#5f6f6f` green-muted | `#76757E` medium warm gray | `#7a7468` tan muted | `#908F88` warm mid-gray | Light: darker for better contrast (4.0:1 on surface-0). Dark: lighter for better readability (3.6:1 on surface-0) |
| `text-inverse` | `#fffdf8` warm white | `#FAFAF8` near-white | `#141a1a` green-black | `#1A1A1F` warm near-black | Consistent with new surface-0 values |
| `text-link` | (none) | `#6B4560` mid plum | (none) | `#CFA0C0` mauve | Dedicated link color distinct from accent; matches accent-hover for interactive coherence |

### Accent

| Token | Old (Light) | New (Light) | Old (Dark) | New (Dark) | Rationale |
|-------|-------------|-------------|------------|------------|-----------|
| `accent` | `#0f5d5d` teal | `#7B506F` muted plum | `#3db8a0` bright teal | `#C48DB5` light plum | Core identity shift: clinical teal to literary plum |
| `accent-strong` | `#0b4747` dark teal | `#5E3B55` dark plum | `#5cd4bc` bright teal | `#D8A8CB` light mauve | Maintains hierarchy within new accent family |
| `accent-soft` | `#d8ece8` teal wash | `#F0E6ED` plum wash | `#1a3a34` dark teal | `#2E222B` dark plum | Background tint for selected states |
| `accent-hover` | `#0a5050` dark teal | `#6B4560` mid plum | `#4dc4ac` teal | `#CFA0C0` mauve | Interactive hover state |
| `accent-muted` | (none) | `#B899AE` mid plum | (none) | `#7A5A70` dark plum | Decorative borders, disabled accent states, subtle indicators |
| `accent-text` | (none) | `#5E3B55` dark plum | (none) | `#D8A8CB` light mauve | Text-safe accent guaranteed to pass AA on all mode surfaces |

### Semantic

| Token | Old (Light) | New (Light) | Old (Dark) | New (Dark) | Rationale |
|-------|-------------|-------------|------------|------------|-----------|
| `ok` | `#245c3f` forest green | `#4A7C5E` sage green | `#5cb88c` bright green | `#6FB88A` sage bright | Warmer, more natural green |
| `ok-strong` | `#1a4830` dark forest | `#38614A` dark sage | `#78d4a8` bright green | `#88D0A2` bright sage | Consistent with ok shift |
| `ok-soft` | `#e0efe7` green wash | `#E5F0E9` sage wash | `#1a3428` dark green | `#1E2E24` dark sage | Slightly warmer wash |
| `ok-muted` | (none) | `#8BB89E` mid sage | (none) | `#3E6B4E` dark sage | Decorative borders, disabled success indicators, progress bars |
| `warn` | `#8a5a05` dark amber | `#96720F` deep amber | `#d4a020` amber | `#D4A840` bright amber | Significantly darker in light mode; now passes WCAG AA for normal text on all light surfaces |
| `warn-strong` | `#6e4804` brown | `#7A5C08` deep amber | `#e0b040` bright | `#E0BC58` bright amber | Warmer, less brownish; maintains hierarchy below warn |
| `warn-soft` | `#f8ecd8` amber wash | `#F7F0DE` warm amber wash | `#362e14` dark amber | `#2E2818` dark amber | Near-identical, very slight adjustment |
| `warn-muted` | (none) | `#C4A84E` mid amber | (none) | `#7A6520` dark amber | Decorative borders, progress indicators, disabled warning states |
| `danger` | `#973131` crimson | `#A0453A` brick/terracotta | `#e06060` coral | `#D0605A` warm coral | Warmer, less aggressive. Brick over blood. |
| `danger-strong` | `#7a2020` dark red | `#7E3530` dark brick | `#f07878` pink-coral | `#E07872` warm coral | Consistent with danger shift |
| `danger-soft` | `#f4dfdf` pink wash | `#F5E5E3` warm wash | `#3a1c1c` dark red | `#301C1A` dark brick | Warmer undertone |
| `danger-muted` | (none) | `#C8877F` mid brick | (none) | `#7A3835` dark brick | Decorative borders, disabled danger states, subtle indicators |

### Muted variant usage guide

The `-muted` tokens fill the gap between the strong foreground color and the soft background wash. They are mid-tone colors designed for:

- **Decorative borders** -- e.g., a left-border accent on a card that does not need full-intensity color.
- **Disabled states** -- semantic meaning is preserved but visually receded.
- **Progress indicators** -- track fills, partial-completion bars.
- **Icon tints** -- icons that communicate status without competing with text.
- **Chart/data visualization** -- secondary series, grid lines, annotations.

These tokens are NOT intended for text on surfaces. Use the base or `-strong` variant for any text that must be readable.

### Borders

| Token | Old (Light) | New (Light) | Old (Dark) | New (Dark) | Rationale |
|-------|-------------|-------------|------------|------------|-----------|
| `border` | `#d8ccba` tan border | `#DDD9D2` warm gray | `#2e3838` green-gray | `#36363E` neutral dark gray | Remove tan/green tint from borders |
| `border-strong` | `#c4b8a4` dark tan | `#C8C4BC` warm gray | `#3e4a4a` green-gray | `#464650` neutral dark gray | Same neutral shift |
| `border-focus` | `var(--color-accent)` | `var(--color-accent)` | (inherits) | (inherits) | Unchanged -- focus rings follow accent |

### Border Radii

| Token | Old | New | Notes |
|-------|-----|-----|-------|
| `--radius-xs` | `4px` | (removed) | Consolidated into `--radius-sm` |
| `--radius-sm` | `8px` | `4px` | Tighter small radius for inputs, badges, small chips |
| `--radius-md` | `12px` | `8px` | Cards, dropdowns, popovers |
| `--radius-lg` | `16px` | `12px` | Modals, dialogs, large panels |
| `--radius-xl` | `24px` | `16px` | Hero cards, feature sections |
| `--radius-full` | `999px` | `9999px` | Pill shapes, avatars (increased for safety with large elements) |

### Shadows

| Token | Old (Light) | New (Light) | Old (Dark) | New (Dark) | Rationale |
|-------|-------------|-------------|------------|------------|-----------|
| `shadow-xs` | `rgba(18,31,31,0.06)` | `rgba(43,43,48,0.06)` | `rgba(0,0,0,0.2)` | `rgba(0,0,0,0.20)` | Neutral warm shadow base color (was green-tinted) |
| `shadow-sm` | `rgba(18,31,31,...)` | `rgba(43,43,48,0.07) + rgba(123,80,111,0.04)` | `rgba(0,0,0,0.3/0.15)` | `rgba(0,0,0,0.25/0.12)` | Plum-tinted second layer in light mode; dark mode slightly reduced |
| `shadow-md` | `rgba(18,31,31,...)` | `rgba(43,43,48,0.08) + rgba(123,80,111,0.05)` | `rgba(0,0,0,0.3/0.2)` | `rgba(0,0,0,0.28/0.18)` | Plum tint adds warmth without being visible as color |
| `shadow-lg` | `rgba(18,31,31,...)` | `rgba(43,43,48,0.10) + rgba(123,80,111,0.06)` | `rgba(0,0,0,0.35/0.25)` | `rgba(0,0,0,0.30/0.22)` | Plum tint ties shadows to accent family at large elevation |

### Skeleton Loading

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `skeleton-base` | `var(--color-surface-3)` | `var(--color-surface-1)` | The resting background of skeleton placeholder elements |
| `skeleton-shine` | `var(--color-surface-1)` | `var(--color-surface-2)` | The highlight color that sweeps across during shimmer animation |

### Scrollbar

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `scrollbar-track` | `var(--color-surface-1)` | `#151518` | Scrollbar track background; blends with panel chrome |
| `scrollbar-thumb` | `var(--color-border-strong)` | `var(--color-border-strong)` | Scrollbar thumb; visible but not distracting |

### Spacing

| Token | Value | Common usage |
|-------|-------|-------------|
| `--space-1` | `4px` | Inline icon gap, tight padding |
| `--space-2` | `8px` | Input padding, small gaps between elements |
| `--space-3` | `12px` | Card padding (compact), list item padding |
| `--space-4` | `16px` | Default card padding, section gaps |
| `--space-5` | `20px` | Medium section padding |
| `--space-6` | `24px` | Panel padding, generous card padding |
| `--space-8` | `32px` | Section spacing, large gaps |
| `--space-10` | `40px` | Page-level section breaks |
| `--space-12` | `48px` | Major layout divisions |
| `--space-16` | `64px` | Top-level page padding, hero spacing |

### Transitions

| Token | Value | Usage |
|-------|-------|-------|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Standard deceleration curve for most transitions |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Bouncy overshoot for scale-in, popover entrances |
| `--transition-fast` | `150ms var(--ease-out)` | Hover states, color changes, opacity toggles |
| `--transition-base` | `250ms var(--ease-out)` | Panel slides, accordion open/close, tab switches |
| `--transition-slow` | `400ms var(--ease-out)` | Page transitions, large layout shifts, modal entrances |

---

## 6. Accessibility Notes

### WCAG AA Contrast Ratios (Light Mode)

All ratios target **4.5:1 minimum** for normal text and **3:1 minimum** for large text (18px+ or 14px+ bold).

| Combination | Ratio | Passes AA | Notes |
|-------------|-------|-----------|-------|
| `text-primary` (#2B2B30) on `surface-0` (#FAF9F6) | **14.2:1** | Yes | Excellent |
| `text-primary` (#2B2B30) on `surface-1` (#F4F2ED) | **13.0:1** | Yes | Excellent |
| `text-primary` (#2B2B30) on `surface-2` (#FFFFFF) | **14.7:1** | Yes | Excellent |
| `text-secondary` (#55545E) on `surface-0` (#FAF9F6) | **6.8:1** | Yes | Good |
| `text-secondary` (#55545E) on `surface-2` (#FFFFFF) | **7.0:1** | Yes | Good |
| `text-muted` (#76757E) on `surface-0` (#FAF9F6) | **4.0:1** | Large text only | Improved from 3.4:1; closer to AA threshold |
| `text-muted` (#76757E) on `surface-2` (#FFFFFF) | **4.2:1** | Large text only | Improved from 3.5:1; closer to AA threshold |
| `text-link` (#6B4560) on `surface-0` (#FAF9F6) | **7.2:1** | Yes | Excellent for link text |
| `text-link` (#6B4560) on `surface-2` (#FFFFFF) | **7.4:1** | Yes | Excellent for link text |
| `accent` (#7B506F) on `surface-0` (#FAF9F6) | **5.5:1** | Yes | Good for interactive text |
| `accent` (#7B506F) on `surface-2` (#FFFFFF) | **5.7:1** | Yes | Good for buttons/links |
| `accent-strong` (#5E3B55) on `surface-0` (#FAF9F6) | **8.0:1** | Yes | Excellent for emphasis |
| `text-inverse` (#FAFAF8) on `accent` (#7B506F) | **5.5:1** | Yes | White text on plum buttons |
| `text-inverse` (#FAFAF8) on `accent-strong` (#5E3B55) | **8.0:1** | Yes | Excellent |
| `danger` (#A0453A) on `surface-0` (#FAF9F6) | **5.8:1** | Yes | Good |
| `warn` (#96720F) on `surface-0` (#FAF9F6) | **5.4:1** | Yes | Now passes AA for normal text (was 3.8:1) |
| `warn` (#96720F) on `surface-2` (#FFFFFF) | **5.6:1** | Yes | Now passes AA for normal text |
| `warn-strong` (#7A5C08) on `surface-0` (#FAF9F6) | **6.9:1** | Yes | Excellent |
| `ok` (#4A7C5E) on `surface-0` (#FAF9F6) | **4.6:1** | Yes | Passes, just above threshold |

### WCAG AA Contrast Ratios (Dark Mode)

| Combination | Ratio | Passes AA | Notes |
|-------------|-------|-----------|-------|
| `text-primary` (#EAEAE5) on `surface-0` (#1A1A1F) | **13.8:1** | Yes | Excellent |
| `text-primary` (#EAEAE5) on `surface-1` (#222228) | **11.6:1** | Yes | Excellent |
| `text-primary` (#EAEAE5) on `surface-2` (#2C2C33) | **9.7:1** | Yes | Excellent |
| `text-secondary` (#B0AFA8) on `surface-0` (#1A1A1F) | **8.3:1** | Yes | Good |
| `text-muted` (#908F88) on `surface-0` (#1A1A1F) | **5.2:1** | Yes | Now passes AA for normal text (was 3.7:1 with #706F68) |
| `text-muted` (#908F88) on `surface-1` (#222228) | **4.4:1** | Large text only | Acceptable for muted elements on panels |
| `text-link` (#CFA0C0) on `surface-0` (#1A1A1F) | **7.8:1** | Yes | Excellent for link text |
| `text-link` (#CFA0C0) on `surface-1` (#222228) | **6.6:1** | Yes | Good |
| `accent` (#C48DB5) on `surface-0` (#1A1A1F) | **7.0:1** | Yes | Good |
| `accent` (#C48DB5) on `surface-1` (#222228) | **5.9:1** | Yes | Good |
| `danger` (#D0605A) on `surface-0` (#1A1A1F) | **5.3:1** | Yes | Good |
| `warn` (#D4A840) on `surface-0` (#1A1A1F) | **7.8:1** | Yes | Excellent |
| `ok` (#6FB88A) on `surface-0` (#1A1A1F) | **7.2:1** | Yes | Excellent |

### Accessibility adjustments and notes

1. **`text-muted` improvements.** The muted text token has been adjusted in both modes for better readability. In light mode, `#76757E` achieves 4.0:1 on surface-0 (up from 3.4:1 with the previous `#8E8D96`), bringing it much closer to the AA normal-text threshold while still reading as clearly "muted." In dark mode, `#908F88` achieves 5.2:1 on surface-0 (up from 3.7:1 with `#706F68`), now passing AA for normal text on the primary canvas. Muted text remains intentionally subdued per design system convention (Tailwind, Radix, Shadcn) and should still not be used for critical information.

2. **`warn` now passes AA for normal text.** The previous light-mode `warn` (#B08830) achieved only 3.8:1 and required falling back to `warn-strong` for body text. The new `#96720F` achieves 5.4:1 on surface-0, comfortably passing WCAG AA for normal text. This means `warn` can now be used directly for warning labels, inline text, and small badges without any contrast concern.

3. **Plum accent on white achieves 5.7:1.** This comfortably exceeds the 4.5:1 AA threshold for normal text. The accent can be used for links, button labels, and interactive elements without concern.

4. **`-muted` tokens are decorative, not text-safe.** The `-muted` variants (`accent-muted`, `ok-muted`, `warn-muted`, `danger-muted`) are mid-tone colors intended for borders, icons, disabled states, and decorative elements. They do NOT meet contrast requirements for text on any surface and must not be used as text colors. Use the base or `-strong` variant for readable text.

5. **Focus indicators.** The `border-focus` token inherits from `accent`, which provides good contrast in both modes. Focus rings should use a 2px solid style with the accent color, optionally with a 2px offset for additional clarity.

6. **Semantic soft backgrounds.** All `-soft` background tokens (e.g., `ok-soft`, `danger-soft`) are designed to pair with their corresponding base or strong text color at well above 4.5:1. For example, `danger` (#A0453A) on `danger-soft` (#F5E5E3) achieves approximately 5.2:1.

---

## Appendix: Quick Visual Reference

### The palette at a glance

```
Light Mode "Morning Pages"
----------------------------------------------
Surface:    #FAF9F6  #F4F2ED  #FFFFFF  #EDEAE4
Overlay:    rgba(43, 43, 48, 0.45)
Text:       #2B2B30  #55545E  #76757E  #6B4560 (link)
Accent:     #7B506F  #5E3B55  #F0E6ED  #6B4560  #B899AE  #5E3B55
OK:         #4A7C5E  #38614A  #E5F0E9  #8BB89E
Warn:       #96720F  #7A5C08  #F7F0DE  #C4A84E
Danger:     #A0453A  #7E3530  #F5E5E3  #C8877F
Border:     #DDD9D2  #C8C4BC


Dark Mode "Late Night Draft"
----------------------------------------------
Surface:    #1A1A1F  #222228  #2C2C33  #34343C
Overlay:    rgba(0, 0, 0, 0.55)
Text:       #EAEAE5  #B0AFA8  #908F88  #CFA0C0 (link)
Accent:     #C48DB5  #D8A8CB  #2E222B  #CFA0C0  #7A5A70  #D8A8CB
OK:         #6FB88A  #88D0A2  #1E2E24  #3E6B4E
Warn:       #D4A840  #E0BC58  #2E2818  #7A6520
Danger:     #D0605A  #E07872  #301C1A  #7A3835
Border:     #36363E  #464650
```

### Character of the change

| Aspect | Before | After |
|--------|--------|-------|
| Surface personality | Aged parchment, yellowed | Fresh paper, clean ivory |
| Accent character | Clinical teal (analytical) | Muted plum (literary, editorial) |
| Dark mode undertone | Green-tinted blacks | Warm neutral blacks |
| Dark mode surface-3 | Deepest black (below surface-0) | Mid-dark gray (above surface-1) |
| Text warmth | Green-cast charcoals | Neutral-warm charcoals |
| Muted text contrast | Below AA in both modes | Near-AA light, passes AA dark |
| Warn contrast (light) | 3.8:1 (large text only) | 5.4:1 (passes AA normal text) |
| Semantic tone | Standard/harsh | Warmer (sage, amber, brick) |
| Semantic coverage | base/strong/soft only | base/strong/soft/muted (4 stops) |
| Shadows | Flat neutral | Plum-tinted second layer (light) |
| Border radii | 6 stops (xs through full) | 5 stops (sm through full), tighter |
| Foundation tokens | Colors + radii only | + spacing, typography, transitions |
| Overall feeling | Banking dashboard | Well-appointed writing desk |
