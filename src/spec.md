# Specification

## Summary
**Goal:** Add an English, proposal-only redesign document for Onebit that re-evaluates the product from zero while preserving the same core goal and overall session journey shape, and proposes deterministic (rule-based) “AI-like” expansion plus wellness/burnout/overwhelm support for later approval.

**Planned changes:**
- Create `frontend/REDESIGN_PROPOSAL.md` as a proposal-only deliverable (no implementation).
- Define an end-to-end UX specification for the redesigned Onebit flow, with one primary decision per screen and explicit inputs (free text + structured), deterministic processing, and user-facing outputs/tone guidance.
- Specify deterministic rules/heuristics for richer suggestions, adaptive fallback tasks, stuck detection, dynamic micro-step selection, and improved understanding using combined text + structured signals.
- Include explicit burnout/overwhelm handling (detection signals, recovery pathways, “next one thing today” guidance, normalization of failure, try-again paths).
- Add a feature inventory decision table that re-evaluates current features from zero (Keep/Modify/Remove/Postpone) and explicitly removes “Try Demo” and the 3 canned demo sessions; note high-level backend implications without requiring implementation.

**User-visible outcome:** A new `frontend/REDESIGN_PROPOSAL.md` document is available in the repo describing the proposed from-scratch redesign and deterministic “AI-like” + wellness support approach for review and approval before any code changes.
