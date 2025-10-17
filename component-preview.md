# Interval Picker Component Preview

## Visual Structure:

```
┌─────────────────────────────────────┐
│ Custom recurrence                   │
├─────────────────────────────────────┤
│ Repeat every                        │
│ [1] [week ▼]                       │
├─────────────────────────────────────┤
│ Repeat on                           │
│ [M] [T] [●W] [T] [F] [S] [S]       │
├─────────────────────────────────────┤
│ Ends                                │
│ ● Never                             │
│ ○ On [Dec 17, 2025 ▼]              │
│ ○ After [13] occurrences            │
├─────────────────────────────────────┤
│              [Cancel] [Done]        │
└─────────────────────────────────────┘
```

## Features Working:
✅ Number input for frequency (1, 2, 3...)
✅ Dropdown for units (day, week, month, year)
✅ Weekday buttons (M T W T F S S) - only for weekly
✅ Radio buttons for end options
✅ Date picker for "On" option
✅ Number input for "After" option
✅ Cancel/Done buttons

## Test it:
1. `pnpm dev`
2. Go to http://localhost:3000
3. Find your component in the registry

The component matches the Google Calendar design exactly! 🎉