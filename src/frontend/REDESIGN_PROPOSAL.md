# Onebit: From-Scratch Redesign Proposal

**Status:** Proposal Only — No Implementation Yet  
**Date:** February 4, 2026  
**Purpose:** Re-evaluate Onebit from zero while preserving the core goal: help users focus on the next one thing today without overwhelm, using deterministic-only "AI-like" behavior.

---

## Executive Summary

This proposal rethinks Onebit from the ground up, expanding its deterministic intelligence while maintaining the same overall session journey shape. The redesign removes demo mode, adds wellness/burnout support, and introduces richer adaptive behavior through combined text + structured inputs.

**Core Commitment:** All "AI-like" behavior remains deterministic (rule-based heuristics, pattern matching, structured decision trees). No external LLM or web AI integrations.

---

## 1. Core Philosophy & Goals (Preserved)

### What Stays the Same
- **Mission:** Help users identify and act on the next one thing today
- **Anti-overwhelm:** Reduce cognitive load, not add to it
- **Session journey shape:** Mental dump → Context → Focus → Action → Check-in → Recovery/Acknowledgment → End
- **One primary decision per screen:** No multi-step forms or complex interfaces
- **Calm, respectful tone:** No gamification, no motivational fluff, no AI self-reference

### What Changes
- **Richer understanding:** Combine free text with structured signals (sliders, tags, quick-select options)
- **Smarter adaptation:** Detect stuck/overwhelmed/burned out states and adapt pathways dynamically
- **Wellness integration:** Normalize failure, offer recovery paths, detect burnout patterns
- **Expanded micro-step intelligence:** Dynamic selection based on task category, user state, and historical patterns
- **Remove demo mode:** Replace with a better first-run experience

---

## 2. Redesigned End-to-End UX Flow

### 2.1 Landing / First-Run Experience

**Purpose:** Welcome new users and set expectations without requiring demo mode.

**Inputs:**
- None (view-only)

**Screen Elements:**
- Headline: "Focus on the next one thing."
- Subheadline: "No overwhelm. No guilt. Just one clear step forward."
- Daily anchor phrase (rotates deterministically by date)
- Two CTAs:
  - "Start a session" (primary)
  - "How it works" (secondary, opens inline explanation)
- Optional: Short video embed (admin-configurable)

**Deterministic Processing:**
- Daily anchor phrase selected by `(dayOfYear % phraseCount)`
- No backend calls until user starts session

**Copy Tone:**
- Calm, inviting, non-prescriptive
- Example: "When everything feels urgent, we help you find the one thing that matters right now."

---

### 2.2 Mental Dump (Enhanced)

**Purpose:** Capture everything on the user's mind without judgment or structure.

**One Primary Decision:** "What's on your mind right now?"

**Inputs:**
- **Free text area** (large, auto-expanding, placeholder: "Messy is fine. Just get it out.")
- **NEW: Energy level slider** (1-5 scale, labels: "Drained" to "Energized")
- **NEW: Overwhelm quick-tag** (optional single-select: "Feeling okay" / "A bit much" / "Totally overwhelmed")

**Deterministic Processing:**
- Text length analysis (word count, sentence count)
- Keyword extraction (simple regex patterns for task categories: writing, calls, admin, studying, creative, physical)
- Energy + overwhelm signals stored for later adaptation
- Draft persisted locally in real-time

**User-Facing Outputs:**
- Live character count (subtle, bottom-right)
- Auto-save indicator ("Saved locally")
- Helper text: "No one will see this but you. Messy is fine."

**Copy Tone:**
- Reassuring, non-judgmental
- Example: "This is your space. No formatting, no pressure."

---

### 2.3 Context Snapshot (Enhanced)

**Purpose:** Understand the user's current constraints and state.

**One Primary Decision (Split into Two Sequential Micro-Decisions):**

#### 2.3a: What's blocking you most right now?
**Inputs:**
- Four buttons (same as before):
  - "I don't know where to start"
  - "I'm avoiding something hard"
  - "I'm distracted or scattered"
  - "I'm tired or low energy"

**NEW: If user selected "Totally overwhelmed" in Mental Dump:**
- Add fifth option: "I'm burned out and need a break"
- This triggers a different pathway (see Burnout Detection below)

#### 2.3b: How much time do you have?
**Inputs:**
- Three buttons: "10 minutes" / "20 minutes" / "30 minutes"
- **NEW: "I'm not sure" option** → defaults to 10 minutes with adaptive suggestion

**Deterministic Processing:**
- Blocker + time + energy + overwhelm signals combined into a "user state profile"
- State profile used to select focus compression strategy and micro-step library subset

**User-Facing Outputs:**
- Confirmation text: "Got it. Let's find your next step."

**Copy Tone:**
- Validating, matter-of-fact
- Example: "No judgment. We'll work with what you've got."

---

### 2.4 Focus Compression (Significantly Enhanced)

**Purpose:** Distill the mental dump into one actionable task using deterministic intelligence.

**One Primary Decision:** "Does this feel like the right next step?"

**Deterministic Processing (Expanded):**

1. **Text Analysis:**
   - Extract task candidates (sentences with action verbs, time references, or urgency markers)
   - Categorize tasks by type (writing, calls, admin, studying, creative, physical, other)
   - Detect complexity signals (multi-step phrasing, vague language, emotional language)

2. **State-Aware Filtering:**
   - If energy ≤ 2: prioritize low-cognitive-load tasks (admin, physical, simple calls)
   - If blocker = "avoiding something hard": identify the avoided task and offer micro-step version
   - If blocker = "don't know where to start": pick smallest/clearest task
   - If blocker = "distracted": pick task with clear completion criteria
   - If blocker = "tired": pick task requiring minimal decision-making

3. **Time-Aware Scoping:**
   - 10 min: single micro-action only
   - 20 min: single task or two micro-actions
   - 30 min: single task with buffer or three micro-actions

4. **Adaptive Fallback Logic:**
   - If no clear task found: generate fallback based on category + state
   - If task too vague: auto-generate micro-step version
   - If task too complex: break into first micro-step only

5. **Rationale Generation:**
   - One-sentence explanation of why this task was selected
   - Example: "This is small, clear, and matches your energy level right now."

**User-Facing Outputs:**
- **Primary task card:**
  - Task text (rewritten for clarity if needed)
  - Rationale (one sentence)
  - Estimated time (based on time bucket)
- **Optional fallback card** (if confidence is medium):
  - Alternative task
  - "Or try this instead" label
- Two buttons:
  - "Yes, let's do this" (primary)
  - "Show me something else" (secondary, cycles through alternatives)

**Copy Tone:**
- Confident but not pushy
- Example: "Based on what you shared, this feels like the right next step."

---

### 2.5 Action Mode (Enhanced)

**Purpose:** Support the user during focused work with minimal distraction.

**One Primary Decision:** "I'm working on it" (implicit — user just works)

**Screen Elements:**
- Large, centered task text
- Countdown timer (visual progress ring)
- **NEW: Breathing reminder** (optional, appears at 50% mark if energy ≤ 2): "Take a breath. You're doing fine."
- **NEW: Quick note field** (collapsible, bottom): "Jot down a thought without stopping the timer"
- Pause/Resume button (small, bottom-left)
- "I'm done" button (appears after 50% time elapsed, or always if user prefers)

**Deterministic Processing:**
- Timer runs client-side
- Quick notes appended to session data
- No backend calls during action mode

**User-Facing Outputs:**
- Time remaining (MM:SS format)
- Optional: Subtle progress ring around timer

**Copy Tone:**
- Minimal, supportive
- Example: "You've got this. Just focus on the next few minutes."

---

### 2.6 Check-In (Enhanced)

**Purpose:** Capture outcome without judgment.

**One Primary Decision:** "How did it go?"

**Inputs:**
- Three buttons (same as before):
  - "I did it" (success)
  - "I got stuck" (partial/blocked)
  - "I avoided it" (didn't start or stopped early)
- **NEW: Optional quick-select tags** (multi-select, appears after button press):
  - For "I did it": "Felt good" / "Felt hard" / "Felt neutral"
  - For "I got stuck": "Hit a blocker" / "Lost focus" / "Ran out of time"
  - For "I avoided it": "Too hard" / "Not the right time" / "Felt anxious"

**Deterministic Processing:**
- Outcome + tags stored for pattern detection
- If "I avoided it" selected 3+ times in last 7 days for similar tasks → trigger burnout check

**User-Facing Outputs:**
- Confirmation text: "Got it. Let's figure out what's next."

**Copy Tone:**
- Non-judgmental, curious
- Example: "No problem. Let's see what we can learn from this."

---

### 2.7 Recovery / Acknowledgment (Significantly Enhanced)

**Purpose:** Provide next steps based on outcome, with wellness support.

#### 2.7a: If "I did it"
**Screen Elements:**
- Acknowledgment text: "Nice work. You did the thing."
- **NEW: Reflection prompt** (optional, collapsible): "What made this easier?" (free text, saved for pattern learning)
- "End session" button

**Copy Tone:**
- Warm but not effusive
- Example: "You showed up and did it. That counts."

#### 2.7b: If "I got stuck" or "I avoided it"
**Screen Elements:**
- Validation text: "That's okay. Let's try a different angle."
- **Two deterministic micro-steps** (selected from expanded library based on task category + blocker + tags)
- **NEW: "I need a break" option** (triggers wellness pathway)
- Two buttons:
  - "Try a micro-step" (starts new mini-session with selected micro-step)
  - "End session" (saves and exits)

**Deterministic Micro-Step Selection (Expanded):**

1. **Category-Based Library:**
   - Writing: "Open the document" / "Write one sentence" / "Outline three bullet points"
   - Calls: "Draft the opening line" / "Set a 2-minute timer and dial" / "Write down what you need to say"
   - Admin: "Open the relevant tab" / "Find the form" / "Fill in one field"
   - Studying: "Read one paragraph" / "Summarize in one sentence" / "Find one example"
   - Creative: "Sketch one idea" / "Collect three references" / "Set a 5-minute timer and freewrite"
   - Physical: "Stand up and stretch" / "Walk to another room" / "Drink water"
   - Generic: "Set a 2-minute timer" / "Do the first 10%" / "Ask for help"

2. **State-Aware Selection:**
   - If energy ≤ 2: prioritize physical or admin micro-steps
   - If blocker = "avoiding something hard": pick "do the first 10%" or "ask for help"
   - If blocker = "distracted": pick "set a 2-minute timer" or "close other tabs"
   - If tags include "felt anxious": pick grounding micro-steps (physical, breathing)

3. **Fallback Logic:**
   - If no category match: use generic library
   - Always offer one physical/grounding option if energy ≤ 2

**Copy Tone:**
- Normalizing, practical
- Example: "Sometimes the task isn't the problem — the entry point is. Let's try a smaller door."

---

### 2.8 Burnout Detection & Wellness Pathway (NEW)

**Trigger Conditions (Deterministic):**
- User selected "Totally overwhelmed" in Mental Dump + "I'm burned out and need a break" in Context
- OR: "I avoided it" outcome 3+ times in last 7 days for similar task categories
- OR: Energy level ≤ 2 for 5+ consecutive sessions

**Screen Elements:**
- Validation text: "It sounds like you're running on empty. That's a signal, not a failure."
- **Three options:**
  1. "Take a real break" → Ends session, suggests returning tomorrow, offers optional reflection prompt: "What would help you recharge?"
  2. "Try the smallest possible step" → Offers one ultra-micro-step (e.g., "Open the document and close it" / "Write one word")
  3. "Talk to someone" → Suggests reaching out for support, ends session

**Deterministic Processing:**
- Burnout flag stored locally (resets after 48 hours of no sessions or after 3 "I did it" outcomes)
- If burnout flag active: all future focus compressions prioritize low-stakes, low-energy tasks

**User-Facing Outputs:**
- Calm, validating copy
- No pressure to continue
- Optional: Link to external resources (admin-configurable)

**Copy Tone:**
- Compassionate, permission-giving
- Example: "You don't have to push through. Rest is productive too."

---

### 2.9 Session End (Enhanced)

**Purpose:** Save session and offer next actions.

**Screen Elements:**
- Session summary card:
  - Task attempted
  - Outcome
  - Time spent
  - Quick notes (if any)
  - Micro-steps tried (if any)
- **NEW: Habit memory display:** "You've shown up X days in the last 14 days."
- Three buttons:
  - "Start another session" (primary, if not burned out)
  - "View history" (secondary)
  - "Done for today" (tertiary)

**Deterministic Processing:**
- Session saved locally
- Optional: Sync to backend if enabled and authenticated
- Habit memory recalculated

**Copy Tone:**
- Encouraging, forward-looking
- Example: "You showed up today. That's what matters."

---

## 3. Deterministic "AI-Like" Behavior Model

### 3.1 Richer Suggestions

**Mechanism:**
- Combine text analysis (keyword extraction, action verb detection, complexity scoring) with structured inputs (energy, overwhelm, blocker, time)
- Use weighted scoring system to rank task candidates
- Apply state-aware filters to prioritize appropriate tasks

**Example:**
- Input: "I need to write the report but I'm so tired and I also have to call the client"
- Energy: 2/5
- Blocker: "I'm tired or low energy"
- Time: 10 minutes
- Output: "Call the client" (rationale: "Calls require less sustained focus than writing when you're tired.")

### 3.2 Adaptive Fallback Tasks

**Mechanism:**
- If primary task selection confidence is low (< 70% based on scoring), generate fallback
- Fallback selection prioritizes:
  1. Different task category than primary
  2. Lower complexity score
  3. Better match for current energy level

**Example:**
- Primary: "Write the report" (confidence: 65%)
- Fallback: "Outline three bullet points for the report" (confidence: 85%)

### 3.3 Smarter Stuck Detection

**Signals:**
- Outcome patterns: 3+ "I got stuck" or "I avoided it" in last 7 days for same task category
- Energy trends: 3+ consecutive sessions with energy ≤ 2
- Time patterns: Consistently selecting shortest time bucket (10 min)
- Tag patterns: "Felt anxious" or "Too hard" tags appearing 2+ times in last 5 sessions

**Adaptive Response:**
- Trigger wellness pathway
- Shift focus compression to prioritize ultra-micro-steps
- Suggest category rotation (e.g., "You've been avoiding writing tasks. Want to try something different?")

### 3.4 Dynamic Micro-Step Selection

**Mechanism:**
- Maintain editable library organized by category (Writing, Calls, Admin, Studying, Creative, Physical, Generic)
- Each micro-step tagged with: category, energy requirement (1-5), complexity (1-5), blocker match (array)
- Selection algorithm:
  1. Filter by task category
  2. Filter by energy requirement ≤ user's current energy
  3. Filter by blocker match
  4. Rank by historical success rate (if available)
  5. Select top 2

**Example:**
- Task: "Write the report"
- Category: Writing
- Energy: 2/5
- Blocker: "I'm avoiding something hard"
- Selected micro-steps:
  1. "Open the document" (energy: 1, complexity: 1, blocker match: ["avoiding"])
  2. "Write one sentence" (energy: 2, complexity: 2, blocker match: ["avoiding", "don't know where to start"])

### 3.5 Improved Input Understanding

**Mechanism:**
- Text analysis provides content (what tasks exist)
- Structured inputs provide context (user state, constraints)
- Combined scoring system weighs both equally
- State profile (energy + overwhelm + blocker + time) acts as filter/modifier on text analysis results

**Example:**
- Text: "I need to finish the presentation, respond to emails, and prep for the meeting"
- Energy: 4/5
- Overwhelm: "Feeling okay"
- Blocker: "I don't know where to start"
- Time: 20 minutes
- Output: "Respond to emails" (rationale: "This is a clear starting point with visible progress.")

---

## 4. Wellness & Burnout Support

### 4.1 Burnout Detection

**Deterministic Signals:**
- Explicit: User selects "Totally overwhelmed" + "I'm burned out and need a break"
- Implicit: 3+ "I avoided it" outcomes in 7 days for similar categories
- Implicit: Energy ≤ 2 for 5+ consecutive sessions
- Implicit: No "I did it" outcomes in last 10 sessions

**Response:**
- Trigger wellness pathway (see 2.8)
- Set burnout flag (persists 48 hours or until 3 "I did it" outcomes)
- Adjust all future suggestions to prioritize low-stakes tasks

### 4.2 Recovery Pathways

**For "I got stuck" / "I avoided it":**
- Offer two micro-steps (see 2.7b)
- Normalize the outcome: "This happens. Let's try a smaller door."
- Provide "I need a break" option (no guilt)

**For burnout state:**
- Offer three options: real break, ultra-micro-step, or talk to someone
- No pressure to continue
- Suggest returning tomorrow

### 4.3 Focus on "Next One Thing Today"

**Throughout the flow:**
- Never show multiple tasks simultaneously (except fallback)
- Never suggest "and then do this" chains
- Always frame as "the next step" not "the plan"
- End-of-session copy emphasizes showing up, not completing everything

**Example copy:**
- "You don't have to do everything today. Just this one thing."
- "The goal isn't to finish. It's to start."

### 4.4 Normalization of Failure

**Copy patterns:**
- "I got stuck" → "That's okay. Let's try a different angle."
- "I avoided it" → "No judgment. Sometimes the timing isn't right."
- Burnout → "Running on empty is a signal, not a failure."
- Habit memory → "You've shown up X days" (not "You missed Y days")

**Design patterns:**
- No red/negative colors for "stuck" or "avoided" outcomes
- No streak counters or completion percentages
- No "try again" pressure — always offer "end session" as equal option

---

## 5. Feature Inventory Decision Table

| Feature | Decision | Rationale |
|---------|----------|-----------|
| **Demo Mode / "Try Demo"** | **Remove** | Adds complexity, creates confusion between demo and real sessions. Replace with better first-run experience (inline "How it works" explanation on landing page). |
| **3 Canned Demo Sessions** | **Remove** | No longer needed without demo mode. |
| **Session History** | **Keep (Enhanced)** | Core value for reflection and pattern learning. Add filtering by outcome and date range. |
| **End-of-Day Reflections** | **Modify** | Keep the concept but make it optional and less intrusive. Trigger only if user had 2+ sessions today. |
| **Admin Panel** | **Keep (Simplified)** | Keep for landing content, daily anchors, and micro-step library editing. Remove API key management (no LLM). |
| **Accessibility Controls** | **Keep** | High-contrast and large-font modes are essential for inclusive design. |
| **Optional Backend Sync** | **Keep** | Maintains local-first approach while allowing cross-device sync for authenticated users. |
| **Quick Add (Ctrl+Enter)** | **Keep** | Useful for capturing thoughts mid-session without disrupting flow. |
| **Habit Memory** | **Keep (Enhanced)** | Motivating without being gamified. Show "days active in last 14 days" instead of streaks. |
| **Daily Anchor Phrases** | **Keep** | Provides calm, rotating inspiration without being prescriptive. |
| **Micro-Step Library** | **Keep (Expanded)** | Core to recovery pathway. Expand with more categories and state-aware selection. |
| **Finalization Checklist** | **Postpone** | Not user-facing. Keep for internal deployment readiness only. |
| **Export Sessions (.txt)** | **Keep** | Useful for users who want to review sessions outside the app. |
| **Internet Identity Auth** | **Keep** | Required for backend sync and cross-device access. |
| **User Profiles (Name)** | **Keep** | Humanizes the experience without requiring extensive personal data. |

---

## 6. Backend Implications (High-Level)

### 6.1 Data Model Needs

**Current backend supports:**
- User profiles (name only)
- Authorization (admin/user/guest roles)
- Blob storage (not currently used)

**New requirements:**
- **Session storage:**
  - Session data structure: task, outcome, tags, energy, overwhelm, blocker, time bucket, quick notes, micro-steps tried, timestamp
  - Query methods: get all sessions for user, get sessions by date range, get sessions by outcome
- **Pattern detection data:**
  - Aggregate queries: count outcomes by category in last N days, get energy trends, detect burnout signals
  - No need for complex analytics — simple count/filter queries sufficient

### 6.2 Endpoints Needed

**New backend methods:**
- `saveSession(session: SessionData): async SessionId`
- `getSessions(userId: Principal, limit: Nat, offset: Nat): async [SessionData]`
- `getSessionsByDateRange(userId: Principal, startDate: Int, endDate: Int): async [SessionData]`
- `getSessionStats(userId: Principal): async SessionStats` (returns: total sessions, outcomes breakdown, habit memory count)

**Existing methods (keep):**
- `getCallerUserProfile(): async ?UserProfile`
- `saveCallerUserProfile(profile: UserProfile): async ()`

### 6.3 Migration Risk

**Low risk:**
- Current backend has no session data to migrate
- User profiles are simple (name only) and can remain unchanged
- New session storage is additive, not destructive

**Migration path:**
- Add new session storage methods
- Keep existing user profile methods unchanged
- Frontend continues to work with local-first storage; backend sync is optional

---

## 7. Removed Features & Replacements

### 7.1 Demo Mode Removal

**What's removed:**
- "Try Demo" button on landing page
- Demo mode toggle in admin panel
- 3 canned demo sessions
- Demo flow configurations
- Demo mode state management

**What replaces it:**
- **Inline "How it works" explanation** on landing page (collapsible):
  - "1. Tell us what's on your mind"
  - "2. We'll help you find the next one thing"
  - "3. Focus for 10-30 minutes"
  - "4. Check in and adjust"
- **Better first-run UX:**
  - Landing page copy sets clear expectations
  - First session flow includes subtle helper text
  - No fake data or simulated sessions
- **Value proposition:**
  - Demo mode's value was "try before you commit" — but Onebit has no commitment (no signup required for local-only use)
  - Better to let users try a real session with their own data

---

## 8. UI/UX Design Principles

### 8.1 Visual Direction

**Color palette:**
- Primary: Calm blue-green (not generic blue)
- Secondary: Warm neutral (taupe/sand)
- Accent: Soft amber (for validation/success states)
- Destructive: Muted red (for errors only, never for outcomes)
- Background: Off-white (light mode) / Deep charcoal (dark mode)

**Typography:**
- Headings: Inter (clean, readable)
- Body: System font stack (performance, familiarity)
- Monospace: JetBrains Mono (for timer, technical elements)

**Spacing & Rhythm:**
- Generous whitespace (min 24px between major sections)
- Consistent vertical rhythm (8px base unit)
- Asymmetric layouts to avoid sterile grid feel

**Border radius:**
- Buttons: 8px (soft but not pill-shaped)
- Cards: 12px
- Modals: 16px
- No full-rounded elements except avatar/icons

### 8.2 Interaction Patterns

**One primary decision per screen:**
- Single large CTA (primary action)
- Secondary actions smaller, lower contrast
- Tertiary actions text-only or icon-only

**Keyboard accessibility:**
- All interactive elements focusable
- Visible focus states (2px outline, accent color)
- Keyboard shortcuts for primary actions (Enter, Escape)

**Loading states:**
- Inline spinners for mutations (button-level)
- Skeleton loaders for data fetching (page-level)
- Never block entire UI during background operations

**Error handling:**
- Inline error messages (below input)
- Toast notifications for system errors
- Never blame the user ("Something went wrong" not "You did X wrong")

### 8.3 Copy Tone Guidelines

**Voice:**
- Calm, respectful, non-prescriptive
- Second person ("you") not first person ("we")
- Active voice, present tense
- No exclamation points (except for genuine celebration)

**Avoid:**
- Motivational language ("You've got this!" → "You're working on it.")
- AI self-reference ("I think..." → "This feels like...")
- Gamification ("Level up!" → "You showed up.")
- Guilt trips ("You missed..." → "You've shown up X days.")

**Examples:**
- Good: "That's okay. Let's try a different angle."
- Bad: "Don't give up! You can do this!"
- Good: "You showed up today. That counts."
- Bad: "Congratulations! You're on a 3-day streak!"

---

## 9. Implementation Phases (Proposed)

### Phase 1: Core Flow Redesign
- Implement enhanced Mental Dump (energy slider, overwhelm tag)
- Implement enhanced Context (burnout option)
- Implement enhanced Focus Compression (expanded deterministic logic)
- Implement enhanced Recovery (expanded micro-step library)
- Remove demo mode entirely

### Phase 2: Wellness & Burnout Support
- Implement burnout detection logic
- Implement wellness pathway
- Implement recovery pathways
- Add normalization copy throughout

### Phase 3: Backend Integration
- Implement session storage backend methods
- Implement session sync logic
- Implement pattern detection queries
- Add session history filtering

### Phase 4: Polish & Refinement
- Implement new visual design
- Add inline "How it works" explanation
- Enhance accessibility features
- Add session export enhancements

---

## 10. Open Questions for User Approval

1. **Energy slider:** Should this be 1-5 scale or 1-10? (Recommendation: 1-5 for simplicity)
2. **Overwhelm tag:** Should this be required or optional? (Recommendation: Optional to reduce friction)
3. **Burnout pathway:** Should "Take a real break" end the session immediately or offer a reflection prompt first? (Recommendation: Offer optional reflection)
4. **Micro-step library:** Should this be user-editable or admin-only? (Recommendation: Admin-only to maintain quality)
5. **Session history:** Should this include filtering by outcome and date range, or just chronological list? (Recommendation: Add filtering for power users)
6. **Daily anchor phrases:** Should these be time-of-day aware (morning/afternoon/evening) or just daily rotation? (Recommendation: Just daily for simplicity)
7. **Quick Add:** Should this be available during Action Mode or only outside sessions? (Recommendation: Available always for maximum utility)
8. **Habit memory:** Should this show "days active in last 14 days" or "days active in last 30 days"? (Recommendation: 14 days for more immediate feedback)

---

## 11. Success Metrics (Deterministic)

**User engagement:**
- Sessions per week (target: 3+)
- Session completion rate (target: 70%+)
- "I did it" outcome rate (target: 40%+)

**Wellness indicators:**
- Burnout pathway trigger rate (target: <10% of sessions)
- "I need a break" selection rate (target: <5% of sessions)
- Energy level trends (target: average ≥ 3/5)

**Feature adoption:**
- Energy slider usage rate (target: 80%+)
- Overwhelm tag usage rate (target: 30%+)
- Micro-step try rate after stuck/avoided (target: 50%+)

**Retention:**
- 7-day return rate (target: 60%+)
- 30-day return rate (target: 40%+)
- Habit memory (target: 5+ days active in last 14 days)

---

## 12. Conclusion

This redesign preserves Onebit's core mission while significantly expanding its deterministic intelligence and wellness support. By combining text analysis with structured inputs, we can provide richer, more adaptive guidance without relying on external AI.

The removal of demo mode simplifies the product and reduces confusion. The addition of burnout detection and recovery pathways makes Onebit more humane and supportive for users who are genuinely struggling.

All proposed features are implementable using deterministic logic, rule-based heuristics, and pattern matching. No external LLM or web AI integrations are required.

**Next Steps:**
1. User reviews and approves this proposal
2. User answers open questions (section 10)
3. Implementation begins with Phase 1 (core flow redesign)

---

**End of Proposal**
