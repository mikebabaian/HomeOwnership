# Home Owner Steward — Layout + Branding Rules (Agent Must Follow)
*This document is intentionally explicit. Do not improvise away these rules.*

---

## 0) Contrast Guidance (Read This First)

We are using a light gray-blue *only as the page canvas*, NOT as the primary surface color.

Rules:
- App background: light gray-blue (canvas)
- Content surfaces: white cards/panels with borders + shadows
- Headings and primary text: dark navy/ink (never light gray)
- Muted text is allowed only for secondary copy, never for primary labels

If any section becomes hard to read, increase contrast by:
- Darkening text (use navy/ink)
- Strengthening borders and shadows on white surfaces
- Using tinted section backgrounds (navy tint) behind white panels

---

## 1) Color Tokens (High Contrast, Bootstrap-Friendly)

Use these exact colors:

- Primary Navy (buttons, headings): `#0B2238`
- Secondary Blue (links, accents): `#1F5A92`
- Steward Green (success accents): `#2F7D5C`

- Canvas Background (page): `#F3F6FA`
- Surface (cards/nav/panels): `#FFFFFF`
- Text (primary): `#0F172A`
- Text (muted): `#475569`
- Border: `#D7DEE8`

- Navy Tint (section background): `#EAF2FF`
- Green Tint (callouts): `#EAFBF2`

Minimum contrast rules:
- Primary text must be `#0F172A` or `#0B2238`
- Do not use muted text color for nav links or headings

---

## 2) GLOBAL LAYOUT RULES (Do Not Skip)

- The page background (body) must be `#F3F6FA`.
- All major content should sit inside a centered container (`.container`) BUT:
  - The *brand bar* and *footer top band* should be full width.
- Use generous spacing:
  - Section padding: 56–72px top/bottom.

---

# 3) HEADER + LOGO (FULL-WIDTH BRAND BAR REQUIRED)

## Objective
The logo is currently getting lost. To fix this, the header must include a full-width brand bar that gives the logo its own presence.

## Required Header Structure (Two-Tier Header)
1) **Brand Bar** (full width)  
2) **Navigation Bar** (full width, sticky)

### 3.1 Brand Bar (Full Width)
**Must be full width** (100% viewport width).
**Must contain a large brand area** on the left.

Brand bar requirements:
- Background: white
- Bottom border: visible (border color)
- Height: comfortable (not thin)
- Left side: large logo + wordmark area
- Right side: optional tagline or small “Trusted guide” line (optional)

Logo requirements:
- Logo height: 56px desktop, 44px mobile
- Logo must be inside a visible container so it does not float on white

Brand block must include:
- Logo image
- Text lockup:
  - “Home Owner” (smaller)
  - “Steward” (larger or accented)
- The entire brand block links to `/`

**Brand container style**
- Use a tinted background behind the logo and text (navy tint)
- Rounded corners
- Light border

### Example brand block layout
[ Logo ]  Home Owner
          Steward

### Required CSS behavior
- Brand block must be visually dominant compared to nav links.
- Do not make the logo tiny.
- Do not push the logo into a corner with no padding.

---

### 3.2 Navigation Bar (Full Width, Sticky)
Nav bar requirements:
- Sticky top
- Background: white with slight transparency and blur
- Links should be medium-dark, not gray
- Active link must be obvious (underline or pill)
- Include one primary CTA button on the far right

Nav links (top-level):
- Home
- Services
- Cost Calculator
- Guide
- Community
- Mission

CTA:
- “Estimate Cost” (primary button)

Active link styling (required):
- Active link text: navy
- Active link: underline or pill background

---

## 4) HERO SECTION (HOME PAGE)

Hero must be a large white panel sitting on the canvas background.

Requirements:
- White surface with border + shadow
- Rounded corners
- Large headline using navy/ink
- Two buttons (primary + outline)
- Optional hero illustration on the right

Hero panel positioning:
- Centered in container
- Spaced away from header (24–32px)

---

## 5) CARDS (PRIMARY UI LANGUAGE)

Cards are the main visual building block. Everything important should be inside cards.

Card requirements:
- White surface
- Border and soft shadow
- Rounded corners (14–16px)
- Hover lift (subtle)

Card internal structure:
- Icon badge at top-left of card content
- Title
- 1–2 lines of copy (muted allowed only for description)

Icon badge:
- Navy tint background
- Navy icon color
- Green used only for success/check meaning

Use cards for:
- “What You Get” features
- Service overview capability blocks
- Calculator results panels
- Guide topic categories
- Community topic previews

---

## 6) FOOTER (FULL-WIDTH, BRAND REINFORCEMENT)

Footer must be full-width and visually anchored.

Footer structure (two zones):

### 6.1 Footer Top Band (Full Width, Brand Reinforcement)
- Full width background: navy (`#0B2238`)
- Contains:
  - Logo (white-friendly version if possible; otherwise place original logo inside a white badge)
  - Short mission line (1 sentence)
  - Primary footer CTA button (optional): “Estimate Cost”

If the logo does not work on dark background:
- Put logo in a small white badge container so it remains readable.

### 6.2 Footer Links Row (Container)
- Inside a `.container`
- Links:
  - About
  - Resources
  - Disclaimer
  - Roadmap (optional)

Footer text:
- Light text on navy, readable
- Muted link color but still legible

---

## 7) BOOTSTRAP IMPLEMENTATION REQUIREMENTS

Use Bootstrap classes aggressively:
- Navbar: `navbar`, `navbar-expand-lg`, `sticky-top`
- Layout: `container`, `row`, `col`, `g-4`
- Panels: `card`, `shadow-sm`, `rounded-4`
- Spacing: `py-5`, `my-4`, `px-4`
- Buttons: `btn`, `btn-primary`, `btn-outline-primary`

Do not rely on unstyled custom divs for layout.

---

## 8) ACCEPTANCE CHECKLIST (MUST PASS)

The UI is acceptable only if all are true:

### Logo + Header
- Logo is clearly visible at a glance
- Logo height is >= 56px desktop
- Logo has its own full-width brand bar area
- Navigation is full-width, sticky, and readable
- Active nav item is obvious
- CTA button is visually dominant

### Pages
- Page background is light canvas, not pure white
- Important content is in white cards/panels with borders/shadows
- Headings are navy/ink, not muted gray
- Cards have consistent icon badges and hover polish

### Footer
- Footer is full width and visually anchors the page
- Brand is reinforced in the footer (logo + mission line)
- Footer links are clear and readable

---

## 9) Notes for the Agent (Do Not Ignore)

Do not optimize for minimalism at the expense of clarity.  
This product needs visible branding, strong hierarchy, and modern card styling.

If something looks “washed out,” the fix is:
- Make primary text darker
- Strengthen borders/shadows
- Use tinted backgrounds behind white surfaces
- Increase spacing

End goal: a clean but confident product UI.
