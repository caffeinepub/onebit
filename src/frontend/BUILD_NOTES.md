# Onebit Build Notes

## Architecture Overview
Onebit is a deterministic-only focus app built with React + TypeScript frontend and Motoko backend on the Internet Computer.

## Core Features
- **Deterministic Logic**: All focus compression and recovery use rule-based algorithms (no AI/LLM)
- **Local-First**: Sessions stored in localStorage by default
- **Optional Backend Sync**: Users can enable sync (requires Internet Identity sign-in)
- **Demo Mode**: Three prefilled demo flows with zero backend calls
- **Daily Anchor**: One rotating phrase per day on landing page
- **Micro-Step Library**: Editable recovery steps by category
- **End-of-Day Reflection**: Optional once-per-day prompt
- **Habit Memory**: "You used Onebit on X of the last 14 days" (no streaks)
- **Finalization Checklist**: In-app setup wizard for deployment

## Key Files

### Deterministic Logic
- `frontend/src/utils/deterministicFocusCompression.ts`: Task selection algorithm
- `frontend/src/utils/deterministicRecovery.ts`: Recovery micro-step selection
- `frontend/src/utils/habitMemory.ts`: Habit memory computation

### Storage
- `frontend/src/store/sessionStore.ts`: Local session persistence
- `frontend/src/store/dailyAnchorPhrases.ts`: Daily anchor phrase rotation
- `frontend/src/store/microStepLibrary.ts`: Editable micro-step library
- `frontend/src/store/reflectionsStore.ts`: End-of-day reflections
- `frontend/src/store/finalizationChecklist.ts`: Deployment checklist data
- `frontend/src/store/syncSettings.ts`: Backend sync toggle
- `frontend/src/store/demoMode.ts`: Demo mode state

### Sync
- `frontend/src/sync/sessionSync.ts`: Optional backend sync coordinator

### Admin
- `frontend/src/components/AdminSettingsDialog.tsx`: Admin panel (sync, content, library)
- `frontend/src/pages/FinalizationChecklistPage.tsx`: Deployment checklist

## Flow
1. Landing → Mental Dump → Context → Focus Compression → Action → Check-In → Recovery → Session End → History
2. Admin panel accessible via settings icon (top-right)
3. Finalization checklist accessible from admin panel

## Sync Behavior
- **Sync Disabled (default)**: All data stays local, no sign-in required
- **Sync Enabled**: Requires Internet Identity sign-in, sessions sync to backend
- **Demo Mode**: Sync is always disabled

## Security
- No API keys, no external AI services
- Backend sync is opt-in and gated by authentication
- Demo mode never calls backend

## Accessibility
- Full keyboard navigation
- High-contrast mode toggle
- Large-font mode toggle
- Focus-visible states

## Design
- Calm, minimal aesthetic inspired by Grok and Calm
- OKLCH color system with light mode
- Soft shadows, spacious layout
- No gamification, no streaks
</typescript>
