# Onebit Build Notes

## Overview
Onebit is a calm, minimal web app that helps people focus on ONE important action at a time. The app is **stable and fully functional without LLMs** by default, using deterministic logic for all decision-making.

## Architecture

### Deterministic Logic (Default)
The app works completely offline and without any AI/LLM integration by default.

**Focus Compression** (`frontend/src/utils/deterministicFocusCompression.ts`)
- Splits mental dump by lines and common separators
- Scores candidates based on:
  - Verb presence (write, call, email, etc.)
  - Urgency indicators (urgent, ASAP, now)
  - Time-bounded mentions
  - Text length (shorter is better for single tasks)
- Filters candidates to match selected time bucket (10/20/30 minutes)
- Returns ONE primary action + optional fallback
- Handles empty input gracefully with safe defaults

**Recovery Logic** (`frontend/src/utils/deterministicRecovery.ts`)
- For "stuck": Returns exactly 2 micro-steps based on task intent (writing/call/email/default)
- For "avoided": Returns neutral reframe + exactly 2 micro-steps
- For "done": Returns completion message
- No therapy language, no motivational coaching
- Minimal, neutral tone throughout

### Optional LLM Integration (Disabled by Default)

**Admin Control** (`frontend/src/store/adminSettings.ts`)
- LLM is **disabled by default** on fresh installs
- Admin can enable via Settings dialog (top-right gear icon)
- Setting persists in localStorage

**LLM Hooks** (Currently Placeholder)
- `frontend/src/pages/FocusCompressionPage.tsx` - Can enhance focus compression
- `frontend/src/pages/RecoveryPage.tsx` - Can enhance recovery suggestions
- Max 3 LLM calls per session (tracked in `App.tsx` session state)
- Always falls back to deterministic logic on error/timeout

**Output Validation** (`frontend/src/utils/llmOutputPolicy.ts`)
- Validates LLM output to ensure:
  - At most one sentence
  - Neutral tone
  - No greetings or AI self-references
  - No motivational/therapy language
  - Contains actionable content
- Returns `null` if invalid → triggers deterministic fallback

**Backend Integration** (`backend/main.mo`)
- API key stored backend-only via `storeApiKey()`
- Never exposed to frontend or logs
- Backend rejects LLM calls when key is missing
- Frontend continues with deterministic logic

### How to Enable LLM Safely

1. **Admin Access Required**
   - Log in with Internet Identity
   - Ensure you have admin role (first user is auto-admin)

2. **Configure API Key**
   - Click Settings icon (top-right)
   - Enter OpenAI API key in "OpenAI API Key" field
   - Click "Save Key"
   - Key is stored backend-only, never in frontend

3. **Enable LLM Toggle**
   - In same Settings dialog, toggle "Enable LLM Enhancement"
   - This enables optional LLM calls for Focus Compression and Recovery
   - Max 3 calls per session enforced

4. **Fallback Behavior**
   - If LLM fails (timeout, error, invalid output), app automatically uses deterministic logic
   - User experience is never broken
   - Session continues normally

### Local-First Storage

**Session Store** (`frontend/src/store/sessionStore.ts`)
- Saves completed sessions to localStorage
- Persists across reloads
- No backend required

**Backend Sync** (Optional, Opt-In)
- Disabled by default
- User can enable in History page
- When enabled, sessions sync to backend (requires login)
- When disabled, app works completely offline

### Demo Mode

**Demo Sessions** (`frontend/src/demo/demoSessions.ts`)
- Exactly 3 canned sessions
- Zero API calls
- Fully functional end-to-end
- Enable from Landing page "Try Demo" button

**Demo Mode Store** (`frontend/src/store/demoMode.ts`)
- Persists demo mode setting
- When enabled:
  - Shows canned sessions in History
  - Prevents backend calls
  - Uses only deterministic logic

### Export

**Export Utility** (`frontend/src/utils/exportSessionsTxt.ts`)
- Browser-only, no backend calls
- Generates readable .txt file
- Includes: date/time, mental dump, blocker, time bucket, action, fallback, outcome, recovery steps
- Works in demo mode and offline

## Key Constraints

1. **LLM is disabled by default** - Fresh installs use only deterministic logic
2. **Max 3 LLM calls per session** - Enforced in `App.tsx` session state
3. **LLM only for Focus Compression and Recovery** - No other features use LLM
4. **Always fallback to deterministic** - On any LLM error/timeout
5. **API key backend-only** - Never stored or exposed in frontend
6. **App works without backend** - Local-first by default

## File Structure

