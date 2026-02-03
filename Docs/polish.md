# Home Owner Steward — Contrast, Depth & Layout Polish (Final)
*This document replaces earlier polish notes. Implement these rules exactly to fix flatness, improve contrast, and clarify logo placement.*

---

## Purpose

The UI is structurally solid but still feels **flat and low-contrast**.  
This document focuses on three things:

1. **Turning up contrast** so content is readable and confident
2. **Adding depth** so sections and cards feel intentional
3. **Clarifying layout rules** so the logo, nav, hero, cards, and footer are unmistakable

This is not exploratory. These are **prescriptive instructions**.

---

## 1) Remove Redundant / Out-of-Place Elements

### Remove the “HOME” Label Above the Hero Title
- Delete the small uppercase “HOME” text above “Home Owner Steward” on the landing page.

**Why**
- You already have navigation with an active state.
- This label reads like a leftover breadcrumb or admin template artifact.
- It weakens the hero instead of strengthening it.

**Rule**
- Landing hero starts directly with the H1.
- No page labels or breadcrumbs on the home page.

---

## 2) Contrast Strategy (Critical)

### Key Principle
We are **not** using light gray-blue as a surface color.  
It is only the **canvas** behind elevated white panels.

### Color Tokens (Use These Exact Values)

```css
:root {
  /* Canvas & surfaces */
  --hos-bg: #EEF2F7;        /* Page background */
  --hos-surface: #FFFFFF;  /* Cards, hero panel, nav, footer panels */

  /* Text */
  --hos-text: #0B1220;      /* Primary text (very dark) */
  --hos-muted: #334155;    /* Secondary text (still readable) */

  /* Brand */
  --hos-primary: #0B2238;  /* Navy */
  --hos-secondary: #1F5A92;
  --hos-accent: #2F7D5C;

  /* Borders & tints */
  --hos-border: #CBD5E1;
  --hos-tint-primary: #EAF2FF;
  --hos-tint-accent: #EAFBF2;

  /* Shadows (depth) */
  --hos-shadow-sm: 0 2px 10px rgba(11,34,56,0.10);
  --hos-shadow:    0 12px 32px rgba(11,34,56,0.18);
}


## 8) Iconography Standards (Explicit – Do Not Improvise)

### Problem Being Solved
Current icons look:
- Too soft
- Inconsistent in stroke weight
- Decorative instead of functional

Icons must read clearly at a glance and reinforce structure, not decoration.

---

## Approved Icon Library (Primary)

### Use Font Awesome (Required)
Use **Font Awesome SVG icons**, not font-based icons.

Approved usage:
- Font Awesome Free
- SVG-based icons (via `@fortawesome/react-fontawesome` or SVG sprite)

Why Font Awesome:
- Consistent visual language
- Strong, readable shapes
- Works well with darker UI and card-based layouts
- Scales cleanly across desktop and PWA contexts

---

## Icon Style Rules (Non-Negotiable)

### Icon Weight
- Use **solid** or **regular** styles only
- Do NOT use thin or light variants

### Icon Size
- Inside cards: `20–22px`
- In navigation (if ever used): `18–20px`
- Do not oversize icons to fill space

### Icon Color
- Default: white on dark background OR navy on light background
- Never light gray
- Never low-contrast blue

---

## Icon Container (Badge) — Required Pattern

All feature icons must live inside a **badge container**.

```css
.icon-badge {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--hos-primary);
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}


## 9) Steward Green — Accent Usage Rules (Explicit)

### Decision
Yes, incorporate the green from the logo — but only as a **semantic accent**, not a primary color.

The UI remains navy-led.
Green is reserved for moments that signal:
- Success
- Completion
- Stewardship
- Positive outcomes

---

## Approved Green Color

Use this exact value everywhere green appears:

```css
--hos-green: #2F7D5C;


## 10) Darker Canvas Background (Required)

### Problem Being Solved
The UI currently feels overly bright and washed out because:
- The page canvas is too close to white
- Cards and hero panels don’t have enough contrast against their surroundings
- The eye has nowhere to rest

---

## Decision
Darken the **page background only** to create contrast and visual grounding.

This is NOT dark mode.
This is a darker canvas behind white content.

---

## Approved Canvas Background Colors

Use ONE of the following (preferred at top):

```css
--hos-bg: #E1E7EF;   /* preferred: calm, modern */

## 11) Darker Canvas + Green Accent Strategy (Final)

### Decision
Yes — the page background should be **significantly darker**.

The goal is to:
- Ground the UI
- Make white panels feel deliberate
- Reduce visual brightness fatigue
- Increase perceived quality

This is NOT dark mode.

---

## Canvas Background (Required)

Use this exact value unless testing alternatives:

```css
--hos-bg: #D2DAE4;
