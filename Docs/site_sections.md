# Own Well Services — Site Sections (Expanded) + Visual Content Guidance (v0.2)
*Detailed page specs for an agent to implement routes, layouts, copy, and UI components, including specific icon/image guidance and “what it should look like” notes.*

---

## Global UX + UI Guidance (Applies to All Pages)

### Design Tone + Copy Style
- Calm, trustworthy, “helpful guide”
- Avoid sales-y language and hype
- Use short paragraphs, strong headings, and scannable bullets
- Prefer plain language (define PMI, escrow, etc. when first introduced)

### Layout Standard
- Sticky top nav with logo + 5–6 links max
- Max-width content container (readable line length)
- Consistent spacing rhythm (8/16/24/32)
- Footer with:
  - Secondary links (About, Resources, Disclaimer)
  - Simple legal/disclaimer line

### Visual System (Icons + Illustrations)
Use visuals to communicate meaning quickly and reduce text density.

**Icon approach**
- Use a consistent icon set (outline icons recommended)
- Icons should be 24–32px in cards and 16–20px in inline labels
- Only 1 icon style across the site (avoid mixing filled + outline)

**Illustration approach**
- Use simple vector/flat illustrations (not photoreal)
- Illustrations should feel “friendly professional”
- Avoid cluttered scenes; prefer 1–3 focal objects

**Where to place visuals**
- Hero illustration on each top-level page
- Icon per feature card / section header
- Divider illustration or subtle background pattern between major sections
- “Explainer” mini-graphics for complex concepts (PMI, escrow, closing costs)

> Implementation note: In v1, images can be static assets under `/public/images` and referenced by path. Use placeholders initially (e.g., `hero-home.svg`) and swap later.

### Accessibility Requirements
- Alt text for all meaningful images
- Decorative images should use empty alt (`alt=""`)
- Form fields must have explicit labels (not placeholders-only)
- Contrast meets WCAG AA

---

## Navigation (Top-Level)

Primary navigation:
- `/` Home
- `/services` Service Overview
- `/cost-calculator` Cost Calculator
- `/guide` Guide
- `/community` Community
- `/mission` Mission

Secondary (footer or later):
- `/about`
- `/resources`
- `/roadmap`
- `/disclaimer`

---

# 1) Landing Page (`/`)

## Page Goal
Explain what the product does quickly, show credibility, and route users toward:
- Cost Calculator
- Service Overview

## Visual “Look & Feel”
- Clean hero with illustration on the right (desktop) or below (mobile)
- A row/grid of feature cards with icons
- A simple 3-step timeline section
- A “Trust/Principles” band with a subtle background

## Sections + Content Specs

### A) Hero
**Layout**
- Left: Title, tagline, short description, CTAs
- Right: Hero illustration

**Copy**
- H1: **Own Well Services**
- Tagline: “A guided companion for buying, owning, and improving a home.”
- 1–2 sentence explainer: “Plan your purchase, estimate real monthly costs, and stay on top of maintenance after closing.”

**CTAs**
- Primary: “Estimate Monthly Cost” → `/cost-calculator`
- Secondary: “How It Works” → scroll to step strip

**Hero Visual**
- Illustration options:
  - House + shield + checklist
  - Person holding clipboard next to a home
  - Home with small icons orbiting (calculator, wrench, chat bubble)
- Optional subtle background pattern: blueprint grid / roofline motif

**Suggested icon keywords**
- house, shield-check, clipboard-check, blueprint

---

### B) Feature Preview Cards (“What You Get”)
**Layout**
- 5 cards, responsive grid (2 per row on tablet, 1 per row on mobile)
- Each card: icon + heading + 1 sentence

**Cards**
1. **Save for a Home**
   - Copy: “Set a goal and track what you’ll need for down payment and closing.”
   - Icon: piggy-bank / wallet / savings jar
2. **Understand Total Cost**
   - Copy: “See your true monthly cost, not just the mortgage payment.”
   - Icon: calculator / receipt
3. **Buy With Confidence**
   - Copy: “Know what to ask, what to expect, and what to avoid.”
   - Icon: map-pin-house / key
4. **Maintain Your Home**
   - Copy: “Stay ahead of upkeep with simple checklists and reminders.”
   - Icon: wrench / gear / calendar-check
5. **Improve Home Value**
   - Copy: “Get guidance on improvements that matter most.”
   - Icon: upward-trend / paint-roller

---

### C) “How It Works” Step Strip
**Layout**
- Horizontal timeline (desktop), vertical steps (mobile)
- Each step: icon + title + 1–2 bullets

**Steps**
1. **Plan**
   - Bullets: “Estimate costs.  Build a savings plan.  Learn the basics.”
   - Icon: calendar / target
2. **Purchase**
   - Bullets: “Find support.  Compare options.  Avoid surprises.”
   - Icon: key / house-search
3. **Steward**
   - Bullets: “Follow maintenance routines.  Find contractors.  Improve wisely.”
   - Icon: wrench / shield

**Divider Visual**
- Simple line with dots or numbered circles
- Optional small illustration between steps (tiny house progression)

---

### D) Trust / Principles Band
**Layout**
- 3 principles in a row, each with icon + short line

**Principles**
- Education-first (icon: book-open)
- Transparency (icon: eye / document)
- No-pressure guidance (icon: handshake / calm face)

**Background**
- Soft tinted section background with subtle pattern

---

### E) Footer CTA
- Copy: “Start with your monthly cost estimate.”
- Button: “Open Calculator” → `/cost-calculator`
- Small disclaimer line below

---

# 2) Service Overview (`/services`)

## Page Goal
Make it obvious what the service does across the full lifecycle:
- Before buying
- During purchase
- After purchase

## Visual “Look & Feel”
- “Journey” hero illustration
- A stage selector component (tabs or cards)
- Capability cards with icons
- A “What this is / isn’t” trust section

## Sections + Content Specs

### A) Hero + Summary
**Copy**
- Title: “Support for the full home ownership journey”
- 1 paragraph: "From saving and planning to maintenance and value improvements, Own Well Services keeps everything understandable and organized."

**Hero Visual**
- Journey/path illustration: renter → key handoff → maintained home
- Icon keywords: path, milestone, map, home

---

### B) “Choose Your Stage” Selector
**Component**
- Tabs or 3 clickable tiles:
  - Preparing to Buy
  - Buying
  - After Purchase

**Each stage displays**
- “What we help with” bullets (3–5)
- “Common questions” (2–3)
- “Next best action” button linking to calculator/guide

**Icons**
- Preparing: calendar + dollar sign
- Buying: key / house-search
- After: wrench / calendar-check

---

### C) Capability Groups (Cards or Accordion)
**Groups + visuals**
1. **Financial Planning**
   - Icon: target / piggy bank
   - Copy: “Plan savings, understand up-front costs, and avoid surprises.”
2. **Cost Education**
   - Icon: book + calculator
   - Copy: “Break down PMI, taxes, insurance, and more in plain language.”
3. **Buying Support**
   - Icon: key / compass
   - Copy: “Know what to look for, what to ask, and how to compare options.”
4. **Maintenance Guidance**
   - Icon: wrench / calendar-check
   - Copy: “Simple checklists and routines that prevent expensive repairs.”
5. **Contractor Finding**
   - Icon: hard-hat / phone
   - Copy: “Find service providers with context on what you actually need.”
6. **Community**
   - Icon: chat-bubbles
   - Copy: “Learn from other homeowners and share what worked.”

---

### D) “What This Is Not” (Trust Builder)
**Layout**
- Two-column: “We do” vs “We don’t”
- Use subtle icons:
  - Do: checkmark
  - Don’t: neutral “x” (avoid harsh red)

**Examples**
- Not a mortgage lender
- Not legal/financial advice
- Not a real estate brokerage
- Not a guarantee of contractor outcomes (unless later)

---

# 3) Cost Calculator (`/cost-calculator`)

## Page Goal
Let users estimate their **true monthly housing cost** with a clear breakdown and teach what each cost means.

## Visual “Look & Feel”
- Hero with calculator + home illustration
- Form + results side-by-side (desktop), stacked (mobile)
- Results summary uses a clean card layout
- Optional simple chart later (bar/donut)

## Page Sections + Component Specs

### A) Calculator Hero
**Copy**
- Title: “Estimate your monthly home cost”
- Subtitle: “More than a mortgage: taxes, insurance, PMI, and HOA can change the picture.”

**Hero Visual**
- Home + calculator illustration
- Icon keywords: calculator, receipt, house

---

### B) Calculator Form (Inputs)
**Layout**
- Group inputs into collapsible panels or clear headings:
  1. Home & Loan
  2. Monthly Ownership Costs
  3. Optional Add-ons

**Inputs (v1)**
**Home & Loan**
- Home price (currency)
- Down payment (toggle: % or $)
- Loan term (15/30)
- Interest rate APR (%)
- HOA dues (monthly, optional)

**Monthly Ownership Costs**
- Property taxes (toggle annual/monthly)
- Homeowners insurance (toggle annual/monthly)
- PMI:
  - If down payment < 20%: show PMI section
  - Provide two modes:
    - “Estimate for me” (simple rate assumption)
    - “I know my PMI” (user-enter monthly)

**Optional Add-ons**
- Utilities estimate (optional)
- Maintenance reserve suggestion (optional educational line item)

**Icons inside form headings**
- Home & Loan: document / house
- Ownership Costs: receipt / shield
- Add-ons: plus-circle / sliders

**Microcopy tooltips (very important)**
- PMI: “Often required under 20% down.  Usually removable later.”
- Taxes: “Varies by area.  Can change yearly.”
- Insurance: “Depends on coverage and location.”
- Interest rate: “Small changes can shift payment a lot.”

---

### C) Results Summary (Outputs)
**Layout**
- Large “Total Monthly Cost” number at top
- Breakdown list below (each with label + amount)
- Optional: small “Upfront Cash Needed” card

**Outputs**
- Principal & Interest (P&I)
- PMI (if applicable)
- Property taxes
- Homeowners insurance
- HOA
- Utilities
- (Optional) Maintenance reserve
- **Total Monthly Cost**

**Upfront (secondary)**
- Down payment amount
- Estimated closing costs (if included as optional input)
- Suggested cash buffer (educational)

**Visuals**
- Use small icons for line items:
  - P&I: bank / document
  - PMI: shield
  - Taxes: government building / receipt
  - Insurance: umbrella / shield
  - HOA: building
  - Utilities: lightning bolt / droplet
- Add a subtle “info” icon next to total: “What’s included?”

---

### D) “What This Means” Explainer Section
**Purpose**
Help users interpret results without anxiety.

**Content blocks**
- “Why this number is higher than your mortgage quote”
- “What changes the total the most”
- “How to reduce monthly cost” (non-sales guidance)

**Visuals**
- 3 explainer cards with icons:
  - sliders (sensitivity)
  - lightbulb (tips)
  - shield-check (confidence)

---

### E) Disclaimer Strip
- “Estimates only.  Local costs vary.  Not financial advice.”

---

## Calculator Math Guidance (Implementation)
- Loan amount = homePrice - downPayment
- Monthly P&I uses standard amortization formula
- Convert annual taxes/insurance to monthly
- PMI rules:
  - If downPaymentPercent < 20% show PMI
  - Provide estimation mode using a configurable annual PMI rate (placeholder)
  - Provide user-enter mode

> Edge cases: handle 0% interest rate, empty/invalid inputs, negative values, and extremely large values gracefully.

---

# 4) Home Ownership Guide (`/guide`)

## Page Goal
Organize education into bite-sized topics users can browse quickly.

## Visual “Look & Feel”
- Category cards with strong icons
- Simple illustrations for each category
- Optional “Featured topic” callout

## Sections + Content Specs

### A) Guide Hub Categories (Card Grid)
- Buying Basics (icon: key)
- Cost & Terminology (icon: book + calculator)
- Inspections (icon: magnifying glass)
- Maintenance by Season (icon: calendar)
- Improvements & Value (icon: paint roller + upward trend)

### B) Featured Checklist Preview
- “Seasonal Maintenance Snapshot”
- Show 5–8 items max
- Link to deeper pages later

**Visuals**
- Checklist illustration (clipboard-check)

---

# 5) Community (`/community`)

## Page Goal
Explain community benefits and set expectations, even if community features are future.

## Visual “Look & Feel”
- Warm, friendly illustration (chat bubbles)
- Topic cards that look like forum threads (static)

## Sections + Content Specs
- Hero: “You’re not the only one figuring this out.”
- Topic cards (static examples):
  - “Contractor recommendations”
  - “First-time homeowner su
