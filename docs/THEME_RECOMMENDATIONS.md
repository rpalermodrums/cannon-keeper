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
  surface-0  #FAF9F6  Warm off-white, slightly ivory. The page itself.
  surface-1  #F4F2ED  Soft cream. Cards, panels, elevated containers.
  surface-2  #FFFFFF  Pure white. Inputs, text areas -- maximum readability.
  surface-3  #EDEAE4  Warm light gray. Recessed areas, secondary backgrounds.

Text tokens:
  text-primary    #2B2B30  Warm near-black. Body text, headings.
  text-secondary  #55545E  Warm gray. Supporting labels, metadata.
  text-muted      #8E8D96  Medium warm gray. Placeholders, disabled text.
  text-inverse    #FAFAF8  For use on dark/accent backgrounds.

Accent tokens (muted plum/wine):
  accent         #7B506F  The hero color. Nav highlights, active states, primary buttons.
  accent-strong  #5E3B55  Darker plum. Hover states, emphasis, link text.
  accent-soft    #F0E6ED  Very light plum wash. Selected row backgrounds, soft badges.
  accent-hover   #6B4560  Button hover, interactive element hover.

Semantic tokens:
  ok           #4A7C5E  Sage green. Confirmed canon, success states.
  ok-strong    #38614A  Hover/emphasis for success.
  ok-soft      #E5F0E9  Success background wash.
  warn         #B08830  Warm amber. Warnings, unconfirmed items.
  warn-strong  #8C6C20  Hover/emphasis for warnings.
  warn-soft    #F7F0DE  Warning background wash.
  danger       #A0453A  Warm brick/terracotta. Errors, contradictions, deletions.
  danger-strong #7E3530  Hover/emphasis for danger.
  danger-soft  #F5E5E3  Danger background wash.

Border tokens:
  border        #DDD9D2  Warm light gray. Default borders.
  border-strong #C8C4BC  Slightly darker. Emphasized borders, dividers.
  border-focus  var(--color-accent)  Focus rings match the accent.

Shadow tokens:
  shadow-xs  0 1px 2px rgba(43, 43, 48, 0.06)
  shadow-sm  0 1px 2px rgba(43, 43, 48, 0.07), 0 4px 12px rgba(43, 43, 48, 0.04)
  shadow-md  0 4px 10px rgba(43, 43, 48, 0.08), 0 10px 30px rgba(43, 43, 48, 0.06)
  shadow-lg  0 8px 24px rgba(43, 43, 48, 0.10), 0 16px 48px rgba(43, 43, 48, 0.07)

Body background gradient:
  radial-gradient(circle at 10% 0%, rgba(123, 80, 111, 0.06), transparent 42%),
  radial-gradient(circle at 90% 100%, rgba(176, 136, 48, 0.04), transparent 42%),
  var(--color-surface-0)
```

### Dark Mode -- "Late Night Draft"

The feeling of writing by lamplight. Warm darks, no blue or green cast, easy on tired eyes.

```
Surface tokens:
  surface-0  #1A1A1F  Warm near-black. No green tint. The canvas.
  surface-1  #222228  Warm dark gray. Sidebar, panels.
  surface-2  #2C2C33  Slightly lighter. Cards, inputs.
  surface-3  #151518  Deepest dark. Recessed areas, inset backgrounds.

Text tokens:
  text-primary    #EAEAE5  Warm off-white. Not blue-white.
  text-secondary  #B0AFA8  Warm medium gray.
  text-muted      #706F68  Warm dark gray.
  text-inverse    #1A1A1F  For use on light/accent backgrounds.

Accent tokens (lighter plum for dark backgrounds):
  accent         #C48DB5  Light plum/mauve. Readable on dark surfaces.
  accent-strong  #D8A8CB  Even lighter. Emphasis, hover on dark.
  accent-soft    #2E222B  Very dark plum. Soft background wash.
  accent-hover   #CFA0C0  Interactive hover.

Semantic tokens:
  ok           #6FB88A  Sage green, brighter for dark mode.
  ok-strong    #88D0A2  Emphasis.
  ok-soft      #1E2E24  Dark green wash.
  warn         #D4A840  Bright amber.
  warn-strong  #E0BC58  Emphasis.
  warn-soft    #2E2818  Dark amber wash.
  danger       #D0605A  Warm coral.
  danger-strong #E07872  Emphasis.
  danger-soft  #301C1A  Dark coral wash.

Border tokens:
  border        #36363E  Warm dark gray.
  border-strong #464650  Slightly lighter.

Shadow tokens:
  shadow-xs  0 1px 2px rgba(0, 0, 0, 0.20)
  shadow-sm  0 1px 2px rgba(0, 0, 0, 0.25), 0 4px 12px rgba(0, 0, 0, 0.12)
  shadow-md  0 4px 10px rgba(0, 0, 0, 0.28), 0 10px 30px rgba(0, 0, 0, 0.18)
  shadow-lg  0 8px 24px rgba(0, 0, 0, 0.30), 0 16px 48px rgba(0, 0, 0, 0.22)

Body background gradient:
  radial-gradient(circle at 10% 0%, rgba(196, 141, 181, 0.06), transparent 42%),
  radial-gradient(circle at 90% 100%, rgba(212, 168, 64, 0.04), transparent 42%),
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

### Recommended adjustment

Consider adding a small amount of letter-spacing to body text for a more relaxed reading feel:

```css
/* Optional: add to @layer base body styles */
letter-spacing: 0.005em;
```

This is a subtle change -- 0.5% of the em -- but it gives body text slightly more breathing room, which suits the calm aesthetic. Test it and remove if it feels loose at larger sizes.

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
  /* -- Fonts -- */
  --font-sans: "IBM Plex Sans", "Avenir Next", "Segoe UI", sans-serif;
  --font-display: "Fraunces", Georgia, serif;
  --font-mono: "IBM Plex Mono", "SF Mono", monospace;

  /* -- Colors: Surfaces ("Morning Pages" -- warm whites and ivories) -- */
  --color-surface-0: #FAF9F6;
  --color-surface-1: #F4F2ED;
  --color-surface-2: #FFFFFF;
  --color-surface-3: #EDEAE4;

  /* -- Colors: Text (warm charcoals, no green tint) -- */
  --color-text-primary: #2B2B30;
  --color-text-secondary: #55545E;
  --color-text-muted: #8E8D96;
  --color-text-inverse: #FAFAF8;

  /* -- Colors: Accent (muted plum/wine -- literary, warm, distinctive) -- */
  --color-accent: #7B506F;
  --color-accent-strong: #5E3B55;
  --color-accent-soft: #F0E6ED;
  --color-accent-hover: #6B4560;

  /* -- Colors: Semantic -- */
  --color-ok: #4A7C5E;
  --color-ok-strong: #38614A;
  --color-ok-soft: #E5F0E9;
  --color-warn: #B08830;
  --color-warn-strong: #8C6C20;
  --color-warn-soft: #F7F0DE;
  --color-danger: #A0453A;
  --color-danger-strong: #7E3530;
  --color-danger-soft: #F5E5E3;

  /* -- Colors: Borders -- */
  --color-border: #DDD9D2;
  --color-border-strong: #C8C4BC;
  --color-border-focus: var(--color-accent);

  /* -- Shadows (neutral warm) -- */
  --shadow-xs: 0 1px 2px rgba(43, 43, 48, 0.06);
  --shadow-sm: 0 1px 2px rgba(43, 43, 48, 0.07), 0 4px 12px rgba(43, 43, 48, 0.04);
  --shadow-md: 0 4px 10px rgba(43, 43, 48, 0.08), 0 10px 30px rgba(43, 43, 48, 0.06);
  --shadow-lg: 0 8px 24px rgba(43, 43, 48, 0.10), 0 16px 48px rgba(43, 43, 48, 0.07);

  /* -- Border Radii (unchanged) -- */
  --radius-xs: 4px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 999px;

  /* -- Animation tokens (unchanged) -- */
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
  /* -- Surfaces ("Late Night Draft" -- warm darks, no green tint) -- */
  --color-surface-0: #1A1A1F;
  --color-surface-1: #222228;
  --color-surface-2: #2C2C33;
  --color-surface-3: #151518;

  /* -- Text (warm light tones) -- */
  --color-text-primary: #EAEAE5;
  --color-text-secondary: #B0AFA8;
  --color-text-muted: #706F68;
  --color-text-inverse: #1A1A1F;

  /* -- Accent (lighter plum for dark backgrounds) -- */
  --color-accent: #C48DB5;
  --color-accent-strong: #D8A8CB;
  --color-accent-soft: #2E222B;
  --color-accent-hover: #CFA0C0;

  /* -- Semantic (brighter for dark mode readability) -- */
  --color-ok: #6FB88A;
  --color-ok-strong: #88D0A2;
  --color-ok-soft: #1E2E24;
  --color-warn: #D4A840;
  --color-warn-strong: #E0BC58;
  --color-warn-soft: #2E2818;
  --color-danger: #D0605A;
  --color-danger-strong: #E07872;
  --color-danger-soft: #301C1A;

  /* -- Borders -- */
  --color-border: #36363E;
  --color-border-strong: #464650;

  /* -- Shadows (deeper opacity for dark mode) -- */
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
    radial-gradient(circle at 10% 0%, rgba(196, 141, 181, 0.06), transparent 42%),
    radial-gradient(circle at 90% 100%, rgba(212, 168, 64, 0.04), transparent 42%),
    var(--color-surface-0);
}
```

Note: The gradient opacity has been significantly reduced in light mode (from 0.12/0.10 to 0.06/0.04). The old gradient was too saturated with teal, creating a visible color wash. The new plum gradient is intentionally subtle -- just enough to add warmth without tinting the page.

---

## 5. Design Token Reference Table

### Surfaces

| Token | Old (Light) | New (Light) | Old (Dark) | New (Dark) | Rationale |
|-------|-------------|-------------|------------|------------|-----------|
| `surface-0` | `#f7f3eb` tan parchment | `#FAF9F6` warm off-white | `#141a1a` green-black | `#1A1A1F` warm near-black | Remove yellowed parchment feel; remove green tint from dark |
| `surface-1` | `#f2ecdf` deeper tan | `#F4F2ED` soft cream | `#1a2222` green-dark | `#222228` warm dark gray | Lighter, cleaner panel color |
| `surface-2` | `#fffdf8` warm white | `#FFFFFF` pure white | `#212b2b` green-tinted | `#2C2C33` neutral dark | Pure white for maximum input readability |
| `surface-3` | `#e9dfcc` dark tan | `#EDEAE4` warm light gray | `#0f1414` deepest green-black | `#151518` deepest warm black | Less yellow, more neutral warmth |

### Text

| Token | Old (Light) | New (Light) | Old (Dark) | New (Dark) | Rationale |
|-------|-------------|-------------|------------|------------|-----------|
| `text-primary` | `#1d2a2a` green-black | `#2B2B30` warm near-black | `#e8e4dc` warm white | `#EAEAE5` warm off-white | Remove green cast from primary text |
| `text-secondary` | `#334242` green-gray | `#55545E` warm gray | `#b8b2a6` tan gray | `#B0AFA8` warm medium gray | Neutral warmth, no green |
| `text-muted` | `#5f6f6f` green-muted | `#8E8D96` medium warm gray | `#7a7468` tan muted | `#706F68` warm dark gray | Lighter in light mode for gentler placeholders |
| `text-inverse` | `#fffdf8` warm white | `#FAFAF8` near-white | `#141a1a` green-black | `#1A1A1F` warm near-black | Consistent with new surface-0 values |

### Accent

| Token | Old (Light) | New (Light) | Old (Dark) | New (Dark) | Rationale |
|-------|-------------|-------------|------------|------------|-----------|
| `accent` | `#0f5d5d` teal | `#7B506F` muted plum | `#3db8a0` bright teal | `#C48DB5` light plum | Core identity shift: clinical teal to literary plum |
| `accent-strong` | `#0b4747` dark teal | `#5E3B55` dark plum | `#5cd4bc` bright teal | `#D8A8CB` light mauve | Maintains hierarchy within new accent family |
| `accent-soft` | `#d8ece8` teal wash | `#F0E6ED` plum wash | `#1a3a34` dark teal | `#2E222B` dark plum | Background tint for selected states |
| `accent-hover` | `#0a5050` dark teal | `#6B4560` mid plum | `#4dc4ac` teal | `#CFA0C0` mauve | Interactive hover state |

### Semantic

| Token | Old (Light) | New (Light) | Old (Dark) | New (Dark) | Rationale |
|-------|-------------|-------------|------------|------------|-----------|
| `ok` | `#245c3f` forest green | `#4A7C5E` sage green | `#5cb88c` bright green | `#6FB88A` sage bright | Warmer, more natural green |
| `ok-strong` | `#1a4830` dark forest | `#38614A` dark sage | `#78d4a8` bright green | `#88D0A2` bright sage | Consistent with ok shift |
| `ok-soft` | `#e0efe7` green wash | `#E5F0E9` sage wash | `#1a3428` dark green | `#1E2E24` dark sage | Slightly warmer wash |
| `warn` | `#8a5a05` dark amber | `#B08830` warm amber | `#d4a020` amber | `#D4A840` bright amber | Lighter, less muddy in light mode |
| `warn-strong` | `#6e4804` brown | `#8C6C20` deep amber | `#e0b040` bright | `#E0BC58` bright amber | Warmer, less brownish |
| `warn-soft` | `#f8ecd8` amber wash | `#F7F0DE` warm amber wash | `#362e14` dark amber | `#2E2818` dark amber | Near-identical, very slight adjustment |
| `danger` | `#973131` crimson | `#A0453A` brick/terracotta | `#e06060` coral | `#D0605A` warm coral | Warmer, less aggressive. Brick over blood. |
| `danger-strong` | `#7a2020` dark red | `#7E3530` dark brick | `#f07878` pink-coral | `#E07872` warm coral | Consistent with danger shift |
| `danger-soft` | `#f4dfdf` pink wash | `#F5E5E3` warm wash | `#3a1c1c` dark red | `#301C1A` dark brick | Warmer undertone |

### Borders

| Token | Old (Light) | New (Light) | Old (Dark) | New (Dark) | Rationale |
|-------|-------------|-------------|------------|------------|-----------|
| `border` | `#d8ccba` tan border | `#DDD9D2` warm gray | `#2e3838` green-gray | `#36363E` neutral dark gray | Remove tan/green tint from borders |
| `border-strong` | `#c4b8a4` dark tan | `#C8C4BC` warm gray | `#3e4a4a` green-gray | `#464650` neutral dark gray | Same neutral shift |
| `border-focus` | `var(--color-accent)` | `var(--color-accent)` | (inherits) | (inherits) | Unchanged -- focus rings follow accent |

### Shadows

| Token | Old (Light) | New (Light) | Old (Dark) | New (Dark) | Rationale |
|-------|-------------|-------------|------------|------------|-----------|
| `shadow-xs` | `rgba(18,31,31,0.06)` | `rgba(43,43,48,0.06)` | `rgba(0,0,0,0.2)` | `rgba(0,0,0,0.20)` | Neutral warm shadow base color (was green-tinted) |
| `shadow-sm` | `rgba(18,31,31,...)` | `rgba(43,43,48,...)` | `rgba(0,0,0,0.3/0.15)` | `rgba(0,0,0,0.25/0.12)` | Same base color shift; dark mode slightly reduced |
| `shadow-md` | `rgba(18,31,31,...)` | `rgba(43,43,48,...)` | `rgba(0,0,0,0.3/0.2)` | `rgba(0,0,0,0.28/0.18)` | Neutral base; dark mode slightly softer |
| `shadow-lg` | `rgba(18,31,31,...)` | `rgba(43,43,48,...)` | `rgba(0,0,0,0.35/0.25)` | `rgba(0,0,0,0.30/0.22)` | Neutral base; dark mode less harsh |

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
| `text-muted` (#8E8D96) on `surface-0` (#FAF9F6) | **3.4:1** | Large text only | Acceptable for placeholders/metadata |
| `text-muted` (#8E8D96) on `surface-2` (#FFFFFF) | **3.5:1** | Large text only | Acceptable for placeholders/metadata |
| `accent` (#7B506F) on `surface-0` (#FAF9F6) | **5.5:1** | Yes | Good for interactive text |
| `accent` (#7B506F) on `surface-2` (#FFFFFF) | **5.7:1** | Yes | Good for buttons/links |
| `accent-strong` (#5E3B55) on `surface-0` (#FAF9F6) | **8.0:1** | Yes | Excellent for link text |
| `text-inverse` (#FAFAF8) on `accent` (#7B506F) | **5.5:1** | Yes | White text on plum buttons |
| `text-inverse` (#FAFAF8) on `accent-strong` (#5E3B55) | **8.0:1** | Yes | Excellent |
| `danger` (#A0453A) on `surface-0` (#FAF9F6) | **5.8:1** | Yes | Good |
| `warn` (#B08830) on `surface-0` (#FAF9F6) | **3.8:1** | Large text only | Use `warn-strong` for small text |
| `warn-strong` (#8C6C20) on `surface-0` (#FAF9F6) | **5.3:1** | Yes | Use this for warning body text |
| `ok` (#4A7C5E) on `surface-0` (#FAF9F6) | **4.6:1** | Yes | Passes, just above threshold |

### WCAG AA Contrast Ratios (Dark Mode)

| Combination | Ratio | Passes AA | Notes |
|-------------|-------|-----------|-------|
| `text-primary` (#EAEAE5) on `surface-0` (#1A1A1F) | **13.8:1** | Yes | Excellent |
| `text-primary` (#EAEAE5) on `surface-1` (#222228) | **11.6:1** | Yes | Excellent |
| `text-primary` (#EAEAE5) on `surface-2` (#2C2C33) | **9.7:1** | Yes | Excellent |
| `text-secondary` (#B0AFA8) on `surface-0` (#1A1A1F) | **8.3:1** | Yes | Good |
| `text-muted` (#706F68) on `surface-0` (#1A1A1F) | **3.7:1** | Large text only | Acceptable for muted elements |
| `accent` (#C48DB5) on `surface-0` (#1A1A1F) | **7.0:1** | Yes | Good |
| `accent` (#C48DB5) on `surface-1` (#222228) | **5.9:1** | Yes | Good |
| `danger` (#D0605A) on `surface-0` (#1A1A1F) | **5.3:1** | Yes | Good |
| `warn` (#D4A840) on `surface-0` (#1A1A1F) | **7.8:1** | Yes | Excellent |
| `ok` (#6FB88A) on `surface-0` (#1A1A1F) | **7.2:1** | Yes | Excellent |

### Accessibility adjustments and notes

1. **`text-muted` is intentionally below 4.5:1.** This matches the convention used by virtually all design systems (Tailwind, Radix, Shadcn). Muted text is used for placeholders, timestamps, and secondary metadata -- elements that are intentionally de-emphasized. It passes the 3:1 large-text threshold and should never be used for critical information.

2. **`warn` in light mode (3.8:1).** The warm amber `#B08830` on white is slightly below 4.5:1 at normal text size. For warning body text, use `warn-strong` (#8C6C20, 5.3:1). The base `warn` is fine for icons, badges with `warn-soft` background, and large text.

3. **Plum accent on white achieves 5.7:1.** This comfortably exceeds the 4.5:1 AA threshold for normal text. The accent can be used for links, button labels, and interactive elements without concern.

4. **Focus indicators.** The `border-focus` token inherits from `accent`, which provides good contrast in both modes. Focus rings should use a 2px solid style with the accent color, optionally with a 2px offset for additional clarity.

5. **Semantic soft backgrounds.** All `-soft` background tokens (e.g., `ok-soft`, `danger-soft`) are designed to pair with their corresponding base or strong text color at well above 4.5:1. For example, `danger` (#A0453A) on `danger-soft` (#F5E5E3) achieves approximately 5.2:1.

---

## Appendix: Quick Visual Reference

### The palette at a glance

```
Light Mode "Morning Pages"
----------------------------------------------
Surface:  #FAF9F6  #F4F2ED  #FFFFFF  #EDEAE4
Text:     #2B2B30  #55545E  #8E8D96
Accent:   #7B506F  #5E3B55  #F0E6ED  #6B4560
OK:       #4A7C5E  #38614A  #E5F0E9
Warn:     #B08830  #8C6C20  #F7F0DE
Danger:   #A0453A  #7E3530  #F5E5E3
Border:   #DDD9D2  #C8C4BC


Dark Mode "Late Night Draft"
----------------------------------------------
Surface:  #1A1A1F  #222228  #2C2C33  #151518
Text:     #EAEAE5  #B0AFA8  #706F68
Accent:   #C48DB5  #D8A8CB  #2E222B  #CFA0C0
OK:       #6FB88A  #88D0A2  #1E2E24
Warn:     #D4A840  #E0BC58  #2E2818
Danger:   #D0605A  #E07872  #301C1A
Border:   #36363E  #464650
```

### Character of the change

| Aspect | Before | After |
|--------|--------|-------|
| Surface personality | Aged parchment, yellowed | Fresh paper, clean ivory |
| Accent character | Clinical teal (analytical) | Muted plum (literary, editorial) |
| Dark mode undertone | Green-tinted blacks | Warm neutral blacks |
| Text warmth | Green-cast charcoals | Neutral-warm charcoals |
| Semantic tone | Standard/harsh | Warmer (sage, amber, brick) |
| Overall feeling | Banking dashboard | Well-appointed writing desk |
