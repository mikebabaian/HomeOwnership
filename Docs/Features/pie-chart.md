# Task: Modernize Monthly Snapshot Pie Chart UI

## Goal
Refactor the Monthly Snapshot section so it feels modern, clean, and premium — more like a fintech dashboard and less like a default chart component.

Do NOT just tweak colors. Improve layout, depth, spacing, and information hierarchy.

---

## 1. Wrap Chart in a Modern Card Container

- Place the chart inside a centered card.
- Card styling:
  - Background: white or very light neutral
  - Border radius: 16px–20px
  - Soft shadow (not heavy)
  - Padding: 32px
  - Max width: 600px
- Add generous vertical spacing above and below.

---

## 2. Improve Typography Hierarchy

Replace the current simple title with:

- Title (larger, semi-bold):  
  "Monthly Snapshot"

- Subtitle (small, muted):  
  "Breakdown of your monthly cash flow"

Typography rules:
- Use stronger contrast for title.
- Muted gray for subtitle.
- Add spacing between title and chart.

---

## 3. Upgrade the Pie Chart

### Visual Improvements

- Increase chart size slightly.
- Add:
  - Smooth drop shadow under chart container
  - Slight inner padding around the pie
- Use a soft modern color palette:
  - Housing: deep blue
  - Insurance: muted violet
  - Utilities: bright but not neon purple
  - Other: cool gray
  - Remaining: rich green

### Depth & Modern Feel

- Add slight slice separation (small padding angle).
- Add smooth animation on load (fade + scale).
- Use subtle hover effects:
  - Slight slice expansion
  - Tooltip with clean styling

---

## 4. Move Legend to the Right

Instead of bottom legend:

- Place legend vertically on the right side of the chart.
- For each legend item:
  - Color dot
  - Label
  - Monthly amount (formatted as currency)
  - Optional percentage (muted text)

Layout:
[ Chart ]  |  [ Vertical Legend + Values ]

This immediately makes it feel more professional.

---

## 5. Add Summary Metrics Above or Below

Add 2 summary numbers:

- Total Monthly Income
- Total Monthly Expenses
- Remaining (large, emphasized)

If Remaining > 0:
- Show green badge:
  ✓ You're in good shape this month

If Remaining < 0:
- Show red badge:
  ⚠ You're over budget by $X

Use subtle colored pill badges.

---

## 6. Improve Background & Spacing

- Ensure page background is slightly off-white (#f8f9fb style)
- Increase spacing between sections
- Avoid gray-on-gray flat tones

---

## 7. Keep It Clean

Do NOT:
- Add 3D pie effects
- Use gradients that look glossy or outdated
- Add thick borders around slices
- Overuse shadows

Aim for:
- Calm
- Airy
- Balanced
- Fintech-style dashboard

---

## Optional Enhancements (If Easy)

- Add smooth animated transition when data changes
- Add subtle hover scaling on the entire card
- Add donut chart instead of full pie (modern look)
  - Center label showing Remaining amount