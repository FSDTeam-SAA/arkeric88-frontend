# Results page: readable preference labels

## Purpose

The `/results` page previously displayed backend preference identifiers directly. For example, users could see `food_drinks`, `art_history_culture`, or `small_town` in the hero tags.

This frontend-only change keeps those identifiers unchanged for API and stored-data compatibility, while displaying the corresponding human-readable quiz label in the results UI.

## Changes made

### 1. Central label resolver

File: `src/lib/wellness-archetypes.ts`

Added `getQuizOptionLabel(value)`. It searches the existing `journeyQuestions` option definitions and returns the option's `label` for a matching `value`.

Examples:

| API value | Displayed on `/results` |
| --- | --- |
| `food_drinks` | `Food & drinks` |
| `art_history_culture` | `Art, history and culture` |
| `small_town` | `Small town` |
| `coast` | `Coast` |

If a value is not found in the quiz definitions, the fallback replaces underscores with spaces. This prevents raw underscore-separated identifiers from appearing in the UI.

### 2. Results hero uses labels

File: `src/components/journey/ResultsPage.tsx`

The page now uses `getQuizOptionLabel` for:

- the hero headline when it comes from `history.userProfile.seeking`;
- each tag in `history.travelThemes`;
- fallback tags from `currentEnergy` and `travelStyle`.

## Data flow

```
Quiz/API value (e.g. food_drinks)
        ↓ unchanged
Backend response / saved journey history
        ↓
ResultsPage
        ↓ getQuizOptionLabel
Visible label (e.g. Food & drinks)
```

## Not changed

- No backend code, validation, or database data was changed.
- API payloads continue to use stable values such as `food_drinks` and `small_town`.
- `JourneyQuiz` was not changed; it already renders the quiz option label.
- `journey-api.ts` was not changed; its types intentionally retain the raw values.

## Verification

`npm run build` completed successfully after the change.
