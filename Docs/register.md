# Feature: Register Page

## Objective
Create a new `Register` page that allows a user to enter basic account information.  

The page must reuse the styling, layout structure, spacing, and visual components already used in `CostCalculator.tsx`.  
Do NOT introduce new UI frameworks, new CSS patterns, or different spacing logic.

This page should visually feel like it belongs to the same app section as `CostCalculator`.

---

## File Structure

Create:

/src/pages/Register.tsx

Use the same:
- Layout container
- Card structure
- Section spacing
- Button styles
- Typography hierarchy
- Input styling
- Form spacing patterns

as seen in `CostCalculator.tsx`.

---

## Page Title

Header at top of card:

# Create Your Account

Subtext below header:

"Enter your information below to create an account."

Match typography weight and spacing from CostCalculator headings.

---

## Form Fields

Add the following inputs in this order:

1. Full Name (text)
2. Email Address (email)
3. Password (password)
4. Confirm Password (password)
5. Telephone Number (tel)
6. Street Address (text)
7. City (text)
8. State (text)
9. Zip Code (text)

All inputs should:

- Use same input component styling as CostCalculator
- Have consistent margin spacing between fields
- Stretch full width of the card container
- Include placeholder text
- Include labels above each input

Example placeholder style:

Full Name → "John Smith"  
Email → "john@email.com"  
Telephone → "(555) 123-4567"

---

## Validation Requirements (UI Only)

Add basic client-side validation:

- Required fields for all inputs
- Email must validate proper format
- Password must:
  - Be at least 8 characters
- Confirm Password must match Password

Display validation errors:

- Same error styling pattern as CostCalculator
- Inline under the relevant input
- Use same color and spacing rules

Do NOT implement backend calls yet.

---

## Buttons

Primary button:

"Create Account"

- Use same primary button style as CostCalculator
- Full width
- Slight top margin from final input

Below button add:

Already have an account? Log in

Make "Log in" a clickable text link.

---

## Layout Requirements

- Centered card layout (match CostCalculator container)
- Same padding values
- Same border radius
- Same shadow styling
- Same background color usage
- No additional design embellishments

This page must visually look like it was created at the same time as CostCalculator.

---

## Accessibility

- Use proper label-for associations
- Ensure inputs have unique IDs
- Buttons must be keyboard accessible
- Password fields must allow show/hide toggle (if CostCalculator pattern supports toggles)

---

## State Management

Use React useState for now.

Structure example:

- formData object
- errors object
- handleChange()
- handleSubmit()

No external state management libraries.

---

## Future Notes (Do Not Implement Yet)

Leave TODO comments for:

- API integration
- Password strength meter
- Address auto-complete
- Terms & Conditions checkbox

---

## Final Acceptance Criteria

- Styling matches CostCalculator exactly
- Clean form layout
- Validation works
- No console errors
- No unused imports
- No new global CSS rules

Keep implementation simple and consistent.
