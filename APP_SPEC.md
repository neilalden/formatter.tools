# Formatter Tools - App Spec

## Summary

Formatter Tools is a web app for BPO agents and virtual assistants. It provides
simple, fast formatting tools with in-memory history and JSON export. The app is
fully offline-capable and requires no accounts.

## Goals

- Provide at least 3 formatter tools at beta launch.
- Keep formatting fast and reliable with minimal friction.
- Work fully offline in the browser.
- Allow users to export their history as JSON.

## Non-Goals (current)

- Accounts, roles, or permissions.
- Backend services, databases, or third-party integrations.
- Payments, analytics, or admin console.
- Localization and accessibility compliance targets.

## Target Users

- BPO agents
- Virtual assistants

## Platforms

- Web only, mobile-browser friendly.
- Offline usage required.

## Launch Plan

- Beta launch date: February 6, 2026.
- Minimum scope for beta: at least 3 formatter tools (phone, income, phrase).
- Milestone: reach at least 5 tools after beta.

## Information Architecture

- Single-page web app.
- Tabs used for tool navigation.

## Core Tools (MVP)

### 1) Phone Formatter

**Inputs**

- One text input field.

**Rules**

- Strip non-digit characters (e.g., +1, spaces, dashes, parentheses).
- After stripping, use the last 10 digits if more than 10 digits are provided.
- If fewer than 10 digits remain, show a clear validation error.

**Output**

- Format: `(###) ###-####`
- Example: input `+1 999-888-7777` -> output `(999) 888-7777`

### 2) Income Formatter

**Inputs**

- Hourly rate (USD)
- Hours per week

**Rules**

- Validate numeric inputs.
- Output values in USD with 2 decimal places.
- Monthly calculation: hourly_rate _ hours_per_week _ 52 / 12
- Annual calculation: hourly_rate _ hours_per_week _ 52

**Output**

- Two values: monthly and annual.

### 3) Phrase Formatter

**Capabilities**

- Users can create any number of variables.
- Variable names are auto-generated and incremental (e.g., var1, var2, var3).
- Variables can be inserted into a phrase by drag-and-drop.

**Editor**

- Phrase uses a text editor UI.
- Variables are represented as draggable chips/tokens.

**Output**

- Render the phrase with variables replaced by their current values.

## History

- A history entry is created each time the user clicks a "Format" button.
- Each entry stores: inputs, output, createdAt timestamp.
- No max history size.
- History is in-memory by default.

## Export

- Export history as JSON via browser download.

## Offline Requirements

- Full functionality without internet.
- History is stored in a local JSON file through user export.
- No external API dependencies.

## Visual / UI Direction

- Use Tailwind CSS.
- Simple, frictionless UI.

## Technical Preferences

- React + TypeScript.
- Hosting: Firebase Hosting.
- No database.
- Testing: Jest.
- Linting: ESLint.

## Open Questions (resolved)

- App name: Formatter Tools.
- Navigation: Tabs.
- Phone formatter input cleanup: strip non-digits.
- Income formatter output: monthly and annual, USD, 2 decimals.
- History: inputs, output, createdAt, JSON export.
