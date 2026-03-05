# Feature: AI Budget Analysis

## Goal
Enhance the Budget page by allowing the user to request an AI-powered analysis of their budget.

An **"AI Analysis"** button should appear to the right of the **Budget** page title when:
- The user has **at least one budget line item**
- The user has **Monthly Take Home configured**

When clicked, the app will:
1. Send the user's budget data to the backend
2. The backend will send the data to OpenAI
3. The AI will return financial advice
4. The advice will be displayed in a **popup modal titled "AI Budget Analysis"**

---

# UI Changes

## Budget Page Header

Modify the header layout so it contains:

Left side: