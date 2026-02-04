# Own Well Services Style Guide (Bootstrap)

Purpose: Add more color, depth, and visual hierarchy while keeping the site clean and trustworthy. This guide defines a small design system the agent can apply consistently across the site.

---

## 1) Brand Direction

Tone: calm, trustworthy, “finance meets home care”.
Approach: use a strong primary blue, a supportive green accent, soft surfaces, and subtle shadows. Keep backgrounds light, add depth with cards, borders, and section separation.

---

## 2) Color Palette

### Core
- **Primary (Navy):** `#0B2A4A`
  - Use for primary buttons, active nav state, key headings
- **Primary Hover:** `#083057`

- **Accent (Steward Green):** `#2F8F46`
  - Use sparingly for success states, small highlights, icons, badges
- **Accent Hover:** `#26783A`

### Surfaces and Text
- **Page Background:** `#EEF4FB`
- **Surface (Card):** `#FFFFFF`
- **Surface Muted:** `#F6F9FD`

- **Border:** `#D9E3F0`
- **Border Strong:** `#C7D6EA`

- **Text Primary:** `#0F172A`
- **Text Muted:** `#475569`

### Utility
- **Info Tint (for callouts):** `#E7F1FF`
- **Success Tint:** `#EAF7EE`
- **Warning Tint:** `#FFF4E5`
- **Danger Tint:** `#FEECEC`

### Gradients (optional, tasteful)
- **Header/Top band gradient:** `linear-gradient(180deg, #F2F7FF 0%, #EAF2FF 100%)`
- **Hero background glow:** `radial-gradient(circle at 20% 10%, rgba(47,143,70,0.10), transparent 40%), radial-gradient(circle at 80% 0%, rgba(11,42,74,0.10), transparent 45%)`

---

## 3) Typography and Spacing

Use Bootstrap default font stack. Add slight hierarchy improvements:

- Headings: `font-weight: 700`
- Body: `font-weight: 400`
- Small text: `color: var(--hos-muted)`

Spacing targets:
- Section padding: `py-5` desktop, `py-4` mobile
- Card padding: `p-4` (or `p-3` on small screens)
- Card gaps in grids: 16 to 20px

---

## 4) Bootstrap Theme Strategy

### Preferred approach
Override Bootstrap CSS variables in a custom stylesheet loaded after Bootstrap.

Add this to: `site-theme.css` (or equivalent)

```css
:root {
  /* Brand */
  --hos-primary: #0B2A4A;
  --hos-primary-hover: #083057;
  --hos-accent: #2F8F46;
  --hos-accent-hover: #26783A;

  /* Surfaces */
  --hos-bg: #EEF4FB;
  --hos-surface: #FFFFFF;
  --hos-surface-muted: #F6F9FD;

  /* Borders */
  --hos-border: #D9E3F0;
  --hos-border-strong: #C7D6EA;

  /* Text */
  --hos-text: #0F172A;
  --hos-muted: #475569;

  /* Effects */
  --hos-shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.08);
  --hos-shadow-md: 0 10px 25px rgba(15, 23, 42, 0.10);
  --hos-shadow-lg: 0 18px 40px rgba(15, 23, 42, 0.14);

  --hos-radius-sm: 10px;
  --hos-radius-md: 16px;
  --hos-radius-lg: 20px;
}

/* Page baseline */
body {
  background: var(--hos-bg);
  color: var(--hos-text);
}

/* Links */
a {
  color: var(--hos-primary);
}
a:hover {
  color: var(--hos-primary-hover);
}
