# Specification

## Summary
**Goal:** Rebuild Onebit as a deterministic-by-default, local-first single-flow focus app with optional backend sync, optional backend-only LLM support (disabled by default), and an extended private admin panel.

**Planned changes:**
- Implement the exact core flow screens in order: Landing → Mental Dump → Context Snapshot (blocker + time bucket) → Focus Compression (deterministic) → Action Mode (single task + client-side timer) → Manual Check-in (done/stuck/avoided) → Recovery (deterministic micro-steps) → Session End → Light Session History; ensure each screen has one primary CTA and all user-facing text is English.
- Add deterministic Focus Compression logic in frontend and backend (split input into candidates, score, match to 10/20/30 minute bucket) returning exactly one primary action plus an optional fallback.
- Add deterministic Recovery Logic in frontend and backend: for “stuck” return exactly 2 micro-steps; for “avoided” return a neutral reframe, exactly 2 micro-steps, and an explicit End Session option.
- Add an Action Mode countdown timer that runs fully in-browser with start/pause/reset and matches the selected time bucket.
- Add Demo Mode with exactly 3 canned sessions and zero API/backend calls, usable end-to-end through History and export.
- Implement local-first storage for session drafts and completed sessions (persisted across reloads) plus an opt-in toggle for backend sync to store/fetch sessions from the Motoko backend when enabled.
- Build Light Session History UI showing recent sessions (timestamp, chosen action, outcome, recovery info when present) with a “Start new Onebit” entrypoint; merge local and backend sessions when sync is enabled.
- Add browser-generated plain-text (.txt) export of session history (works offline and in demo mode).
- Make LLM integration optional and disabled by default, admin-controlled; enforce max 3 LLM calls per session; restrict LLM usage to Focus Compression and Recovery only; always fall back to deterministic logic on error/timeout.
- Enforce OpenAI security constraints: backend-only requests, only when OPENAI_API_KEY is configured in backend; never expose/store the key in the frontend; validate/normalize LLM output to at most one neutral sentence with no therapy/motivation/greetings/self-referential AI language.
- Extend the private Admin panel to manage OPENAI_API_KEY and to set a public Landing-page demo video link (60s) and pitch text stored in backend state; expose only the public pitch/video fields on Landing for non-admins.
- Apply a consistent Grok+Calm-inspired minimal theme with strong contrast, keyboard navigation, visible focus states, and “one decision per screen” hierarchy.
- Add a short in-repo build notes document describing where deterministic logic lives, where optional LLM hooks live, how to enable LLM safely (admin/key setup), and how call limits + fallback are enforced; document the closest safe alternative for key storage if backend secrets cannot be programmatically written.

**User-visible outcome:** Users can complete the Onebit flow end-to-end offline with deterministic task selection and recovery, use a built-in timer, view/export lightweight session history, optionally enable demo mode, and optionally turn on backend sync; admins can configure LLM usage and set Landing pitch text + a demo video link without exposing admin controls to normal users.
