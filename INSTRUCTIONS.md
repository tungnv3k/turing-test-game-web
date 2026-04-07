# Turing Test Game — Claude Sonnet Step-by-Step Build Guide

## Purpose

This document is a **persistent implementation guide** for **Claude Sonnet** so development can continue from **any step in a brand-new chat** without losing architectural intent.

It converts the product requirements into:

- a **clear 2-repo cloud-ready architecture**,
- a **step-by-step implementation sequence**,
- **strict technical rules** that must remain true across all steps,
- and **copy-paste prompts** Claude can use to generate code incrementally.

---

# 1. Product Summary

## Game Concept

**Turing Test Game** is a web-based multiplayer social deduction game where:

- **Humans** complete AI-themed tasks,
- **AI Bots** fake tasks, sabotage the system, and deceive others,
- players move around a shared map,
- a reported body triggers a structured discussion phase,
- and players vote to decommission a suspect.

The game is intentionally built **without runtime AI generation**. All AI flavor is simulated with predefined roles, structured prompts, and fixed response options.

## MVP Scope

The MVP must include:

- multiplayer room support,
- 1 map,
- 2 roles: Human and AI Bot,
- top-down movement,
- 3 minigame tasks,
- 2 sabotage types,
- body reporting,
- structured discussion,
- voting,
- win condition resolution.

---

# 2. Delivery Model

## Repositories

Development must be split into **2 repositories**.

### Repo A — `turing-test-game-server`
Deploy target: **Railway**

Responsible for:
- room lifecycle,
- authoritative match state,
- player connections,
- role assignment,
- movement sync,
- task progress sync,
- sabotage state,
- reporting/discussion/voting state,
- win condition evaluation,
- API + WebSocket events.

### Repo B — `turing-test-game-web`
Deploy target: **Vercel**

Responsible for:
- Phaser 3 client,
- mobile-first gameplay UI,
- all in-game screens and menus,
- rendering,
- client prediction/interpolation if needed,
- task minigame UIs,
- discussion/voting UIs,
- connecting to the Railway server.

---

# 3. Non-Negotiable Technical Rules

These rules are **global and immutable**. Claude must keep them true in all generated code.

## 3.1 Platform Rules

1. The game is **mobile-first**.
2. The game must work in **portrait and landscape** orientations.
3. The layout must be **responsive and scalable** across phone, tablet, and desktop sizes.
4. The game must **fit the visible screen** with **no page scrolling**.
5. Menus must be navigated **inside the game experience**, not through separate long scrolling web pages.
6. The project must be **cloud-ready** for Vercel (web) and Railway (server).
7. Runtime behavior must support **multiplayer synchronization** with server authority.

## 3.2 Rendering / Viewport Rules

1. The browser page must use:
   - `html, body, #__next` or app root at `width: 100%; height: 100%; overflow: hidden;`
   - zero scrollbars,
   - zero accidental page overflow.
2. The Phaser canvas/container must scale to available viewport space.
3. UI safe zones must handle:
   - notches,
   - mobile browser bars,
   - orientation changes,
   - narrow aspect ratios.
4. Use a **calculated viewport strategy** so the game always remains visible without scroll.
5. Prefer a **fixed virtual game size + responsive fit scaling** model.
6. All menus should be rendered as overlays / scenes / UI panels within the game shell.

## 3.3 Networking Rules

1. The server is **authoritative** for match state.
2. The client may render local motion smoothly, but the server decides truth.
3. All phase changes must come from server state:
   - lobby,
   - role reveal,
   - active play,
   - sabotage,
   - report,
   - discussion,
   - voting,
   - result.
4. Never store canonical match truth only on the client.
5. Events must be versionable and easy to inspect.

## 3.4 Code Quality Rules

1. Use **TypeScript** in both repos.
2. Keep generated code modular.
3. Avoid giant files.
4. Prefer explicit interfaces and enums for game state.
5. Build features in vertical slices that can be tested incrementally.
6. Every step must end in a **working state**, not a partial broken scaffold.
7. If a feature depends on later work, use a stub with clear TODO markers and keep the app runnable.

---

# 4. Recommended Tech Stack

## Server — `turing-test-game-server`
- Node.js
- TypeScript
- Express (light HTTP endpoints if needed)
- Socket.IO
- Railway deployment
- In-memory state for MVP
- Optional lightweight validation helpers

## Web — `turing-test-game-web`
- Next.js (App Router or Pages Router, but stay consistent)
- TypeScript
- Phaser 3
- Vercel deployment
- CSS modules / simple global CSS / Tailwind only if kept minimal
- Socket.IO client

## Why this split

- Railway is better suited for persistent WebSocket server behavior.
- Vercel is suitable for static/frontend deployment.
- This separation avoids mixing real-time server hosting concerns with frontend hosting constraints.

---

# 5. Shared Game Design Rules

Claude must preserve these product rules while coding.

## Roles
- **Human**: completes tasks, fixes sabotage, reports bodies, votes.
- **AI Bot**: fake tasks, sabotage, deceive, vote, optionally terminate if enabled in MVP.

## MVP Tasks
Implement at least these 3:
1. CAPTCHA Verification
2. Data Sorting
3. Logic Chain Repair

## MVP Sabotage
Implement at least these 2:
1. Data Corruption
2. Hallucination Injection

## Discussion System
Use a **structured multiple-choice discussion** system instead of open chat.

## Win Conditions
Humans win if:
- all tasks are complete, or
- all bots are eliminated.

Bots win if:
- bots equal humans, or
- critical sabotage remains unresolved.

---

# 6. Repository Structure Blueprint

## 6.1 `turing-test-game-server`

Suggested structure:

```text
src/
  index.ts
  config/
    env.ts
  server/
    app.ts
    socket.ts
  game/
    constants.ts
    types.ts
    state.ts
    roomManager.ts
    matchEngine.ts
    reducers/
      lobbyReducer.ts
      movementReducer.ts
      taskReducer.ts
      sabotageReducer.ts
      reportReducer.ts
      discussionReducer.ts
      votingReducer.ts
      winReducer.ts
    services/
      roleService.ts
      taskService.ts
      sabotageService.ts
      voteService.ts
  utils/
    id.ts
    logger.ts
```

## 6.2 `turing-test-game-web`

Suggested structure:

```text
src/
  app/ or pages/
    page.tsx / index.tsx
    layout.tsx
    globals.css
  game/
    bootstrap/
      createGame.ts
      gameConfig.ts
    scenes/
      BootScene.ts
      MenuScene.ts
      LobbyScene.ts
      RoleRevealScene.ts
      MainScene.ts
      TaskScene.ts
      DiscussionScene.ts
      VotingScene.ts
      ResultScene.ts
    ui/
      overlays/
      hud/
      components/
    networking/
      socketClient.ts
      eventHandlers.ts
      outboundEvents.ts
    state/
      clientStore.ts
      selectors.ts
      sync.ts
    tasks/
      captcha/
      dataSorting/
      logicChain/
    sabotage/
      hallucination.ts
      corruption.ts
    utils/
      viewport.ts
      scale.ts
      orientation.ts
```

---

# 7. Implementation Sequence Overview

The build should happen in the following order:

1. Initialize both repositories and deployment-ready scaffolds.
2. Build the frontend game shell and no-scroll responsive viewport system.
3. Build the server room + socket foundation.
4. Implement lobby flow and room join.
5. Add role assignment and role reveal phase.
6. Implement core top-down movement and sync.
7. Build map interaction framework.
8. Add task system and 3 MVP tasks.
9. Add sabotage system and repair flow.
10. Add elimination/report flow.
11. Add structured discussion flow.
12. Add voting and elimination resolution.
13. Add win condition engine.
14. Add mobile polish, orientation handling, reconnect messaging, and deployment docs.

Every step below includes:
- objective,
- deliverables,
- implementation detail,
- acceptance criteria,
- and a Claude-ready prompt.

---

# 8. How Claude Must Work In New Chats

Whenever starting from any later step, Claude must first:

1. Read this guide.
2. Respect all previously defined architecture and constraints.
3. Only generate code for the requested step unless explicitly asked to refactor earlier parts.
4. Keep both repos runnable.
5. If a required dependency from an earlier step is missing, create the minimum compatible version without breaking the documented architecture.
6. Output:
   - changed files only when asked for incremental updates,
   - full file content when asked for copy-paste-ready code,
   - directory structure whenever new files are introduced.

---

# 9. Step-by-Step Build Plan

## Step 1 — Create Both Repos and Baseline Scaffolds

### Objective
Set up the two-repo project foundation with deployable local development environments.

### Deliverables

#### `turing-test-game-server`
- Node + TypeScript project
- Socket.IO server bootstrap
- Express app bootstrap
- Railway-ready start script
- env handling
- health endpoint

#### `turing-test-game-web`
- Next.js + TypeScript app
- Phaser bootstrap mounted inside a full-screen page
- Vercel-ready project structure
- global CSS with no scroll
- placeholder in-game menu scene

### Implementation Notes
- The frontend must launch into a full-screen game shell.
- The page must never scroll.
- The first screen must already be rendered in-game, not as a standard long webpage.
- Add README notes for local startup commands in both repos.

### Acceptance Criteria
- Both apps run locally.
- Web app shows a full-screen game area with no scrollbars.
- Server exposes a working socket server and `/health` endpoint.

### Claude Prompt

```text
You are implementing Step 1 of the Turing Test Game using a 2-repo architecture:
- turing-test-game-server -> Railway
- turing-test-game-web -> Vercel

Requirements:
- TypeScript in both repos
- mobile-first
- full-screen no-scroll web shell
- Phaser bootstrapped in the web repo
- Socket.IO bootstrapped in the server repo
- keep files modular
- output directory structure and full file contents
- both repos must run locally after this step

Create the baseline scaffold only. Do not implement multiplayer gameplay yet.
```

---

## Step 2 — Build Responsive Game Shell and Viewport System

### Objective
Create the mobile-first viewport and scaling system that works in portrait and landscape without page scrolling.

### Deliverables
- viewport utility
- orientation detection utility
- game container sizing logic
- safe-area aware CSS
- responsive HUD anchor zones
- in-game menu overlay system

### Implementation Notes
- Use a fixed virtual resolution strategy such as a virtual width/height pair.
- Fit the game into screen bounds while preserving visibility.
- All menus should be overlays/scenes inside the game shell.
- Handle resize/orientation changes cleanly.
- Avoid browser scroll caused by canvas overflow or menu panels.

### Acceptance Criteria
- On narrow phone dimensions, the game fits without scroll.
- On landscape tablet/desktop dimensions, the game still fits.
- Menus remain usable in both orientations.

### Claude Prompt

```text
Implement Step 2 for turing-test-game-web only.

Goal:
Build a mobile-first responsive game shell for Phaser inside Next.js that:
- works in portrait and landscape,
- uses no page scrolling,
- calculates viewport scaling to fit the screen,
- supports safe areas,
- keeps menus in-game.

Output:
- changed directory structure
- changed files only
- full code for each changed file
- concise explanation of viewport strategy

Do not implement gameplay yet. Focus on shell, scaling, overlays, and orientation handling.
```

---

## Step 3 — Build Server Room and Match State Foundation

### Objective
Create the authoritative room model and core state containers on the server.

### Deliverables
- room manager
- player registry
- room creation/join flow
- shared game enums/types
- match phase enum
- socket event names
- server-side canonical room state

### Implementation Notes
- Keep state in memory for MVP.
- Separate transport events from state mutation logic.
- Add max player setting and pre-game join/leave behavior.
- Add room code generation.

### Acceptance Criteria
- Multiple clients can connect.
- A room can be created and joined.
- Room state exists on server and is broadcast safely.

### Claude Prompt

```text
Implement Step 3 in turing-test-game-server.

Goal:
Create the authoritative in-memory room and match-state foundation for the multiplayer game.

Requirements:
- modular TypeScript structure
- room create/join/leave support
- room code generation
- match phase enum
- typed server events
- canonical room state on server
- no gameplay logic yet beyond lobby foundation

Output full file contents for all created/changed files and include a directory tree.
```

---

## Step 4 — Connect Web Client to Lobby and Room Flow

### Objective
Connect the frontend to the server so players can create/join a room from the in-game menu.

### Deliverables
- socket client bootstrap
- lobby scene / overlay
- create room button
- join room form
- display name input
- room state sync to UI

### Implementation Notes
- Keep the room flow in-game.
- Avoid external form pages if possible.
- If using DOM-backed UI for forms, keep it inside a controlled fullscreen shell.
- Show basic lobby player list and readiness placeholder.

### Acceptance Criteria
- A player can create a room.
- Other players can join using a room code.
- Lobby UI reflects connected players.

### Claude Prompt

```text
Implement Step 4 across both repos.

Goal:
Connect the web client to the server so players can create and join rooms from the in-game menu/lobby UI.

Requirements:
- keep menus inside the game shell
- mobile-first input layout
- no page scrolling
- socket connection and room state sync
- basic player list in lobby

Output changed files only, with full code and updated directory structure.
```

---

## Step 5 — Add Match Start, Role Assignment, and Role Reveal

### Objective
Support match start from lobby, assign secret roles, and reveal each player’s role privately.

### Deliverables
- start match event
- role assignment service
- role counts configuration
- role reveal scene/overlay
- transition into active gameplay phase

### Implementation Notes
- Server assigns roles.
- Client only receives the local player’s private role and public-safe room state.
- Add a short reveal UI before entering active play.

### Acceptance Criteria
- Host can start match.
- Players receive appropriate role data.
- Role reveal appears privately before the match begins.

### Claude Prompt

```text
Implement Step 5 across both repos.

Goal:
Add match start, secret role assignment, and private role reveal.

Rules:
- server is authoritative
- only send private role data to the relevant player
- public room state must remain safe
- after reveal, transition to active phase scaffold

Return changed files only with full code.
```

---

## Step 6 — Implement Top-Down Movement and Real-Time Sync

### Objective
Enable players to move on the map and see each other move in real time.

### Deliverables
- simple top-down map scene
- player spawn points
- keyboard + mobile controls (virtual joystick or touch controls)
- movement event pipeline
- server-side position authority
- interpolation/smoothing on client

### Implementation Notes
- Mobile-first means touch control support is required.
- Preserve desktop keyboard input as secondary.
- Use server-authoritative updates to prevent divergence.
- Add camera behavior appropriate for map size.

### Acceptance Criteria
- Players can move on phone and desktop.
- Other players’ movement is visible.
- No page scroll or accidental browser drag behavior occurs.

### Claude Prompt

```text
Implement Step 6 across both repos.

Goal:
Create synced top-down movement for multiplayer play.

Requirements:
- mobile-first controls with touch/virtual joystick
- keyboard fallback for desktop
- authoritative server position sync
- Phaser map scene
- player labels visible
- stable no-scroll fullscreen experience

Return changed files only with full code and any setup notes.
```

---

## Step 7 — Add Core Interaction System and Task Nodes

### Objective
Create a reusable interaction framework for task stations and future sabotage repair nodes.

### Deliverables
- interactable entity model
- proximity detection
- interaction prompt/button
- task node registration
- task launch flow

### Implementation Notes
- Use a generic interaction framework so future systems reuse it.
- Touch interaction should be obvious on mobile.
- Prepare hooks for “fake tasks” for bots.

### Acceptance Criteria
- Human players can approach a station and open a task panel.
- Task nodes are visible and reusable.

### Claude Prompt

```text
Implement Step 7 across both repos.

Goal:
Build a reusable world interaction system for task stations.

Requirements:
- interactable nodes with IDs/types/positions
- mobile-friendly interaction affordance
- server-aware interaction validation
- launch task UI from main scene
- architecture must support future sabotage repair nodes

Output changed files only with full code.
```

---

## Step 8 — Implement MVP Task System and 3 Task Minigames

### Objective
Build the human task system and connect it to global progress.

### Deliverables
- task state model
- per-player task assignments
- task completion events
- global System Stability progress bar
- 3 minigames:
  1. CAPTCHA Verification
  2. Data Sorting
  3. Logic Chain Repair
- fake task visibility for bots

### Implementation Notes
- Humans contribute real progress.
- Bots may visually interact but must not add true progress.
- Keep minigames short and readable.
- Minigames should function inside the in-game overlay system.

### Acceptance Criteria
- Humans can complete assigned tasks.
- Global progress updates for real completions.
- Bots cannot advance system stability.

### Claude Prompt

```text
Implement Step 8 across both repos.

Goal:
Add the MVP task system with 3 task minigames and global task progress.

Rules:
- only Humans contribute real task progress
- Bots can fake task interaction visually but not affect system progress
- tasks must be short and mobile-friendly
- all task UIs must run in-game without page scrolling

Implement:
1. CAPTCHA Verification
2. Data Sorting
3. Logic Chain Repair

Return changed files only with full code and updated directory structure.
```

---

## Step 9 — Implement Sabotage System and Repair Flow

### Objective
Add bot sabotage actions and human repair responses.

### Deliverables
- sabotage state model
- sabotage trigger event
- repair interactables
- sabotage timers
- 2 sabotage types:
  1. Data Corruption
  2. Hallucination Injection

### Implementation Notes
- Keep sabotage effects legible in MVP.
- Data Corruption can block tasks until repaired.
- Hallucination Injection can distort labels/UI or create noisy task behavior.
- Critical sabotage timeout should support bot win logic.

### Acceptance Criteria
- Bots can trigger sabotage.
- Humans can repair sabotage.
- Sabotage affects active play and resolves cleanly.

### Claude Prompt

```text
Implement Step 9 across both repos.

Goal:
Add sabotage and repair gameplay.

Implement:
- sabotage state machine
- bot-triggered sabotage
- human repair flow
- Data Corruption
- Hallucination Injection
- server-authoritative timers/state

Requirements:
- sabotage should visibly affect gameplay
- mobile-friendly repair interactions
- architecture should support future sabotage types

Return changed files only with full code.
```

---

## Step 10 — Add Termination and Body Reporting Flow

### Objective
Enable bot elimination of humans (if MVP uses elimination) and allow players to report a body.

### Deliverables
- termination event
- alive/dead state update
- body entity / marker
- report action
- phase transition into discussion

### Implementation Notes
- Keep the implementation simple and readable.
- Dead players must be visually distinct.
- Disable actions as needed for dead players.
- If kill cooldown is used, keep it configurable.

### Acceptance Criteria
- A bot can terminate a player.
- Another player can report the body.
- The match transitions into discussion phase.

### Claude Prompt

```text
Implement Step 10 across both repos.

Goal:
Add termination and body reporting flow.

Requirements:
- server-authoritative alive/dead state
- reportable body markers
- transition into discussion phase on report
- dead-player restrictions where appropriate
- mobile-friendly interaction

Return changed files only with full code.
```

---

## Step 11 — Implement Structured Discussion System

### Objective
Build the game’s key differentiator: structured multiple-choice discussion instead of open chat.

### Deliverables
- prompt library (minimum 5 prompts)
- response option library (3–5 options each)
- timed discussion phase
- player selection submission
- summary generation from chosen options

### Implementation Notes
- No open text chat.
- The UI should feel thematic and readable on mobile.
- Use predefined prompts and response options.
- Summary can be deterministic and template-based.

### Acceptance Criteria
- Discussion starts after report.
- Players can answer a structured prompt.
- A summary screen appears before voting.

### Claude Prompt

```text
Implement Step 11 across both repos.

Goal:
Add the structured discussion system with predefined prompts and selectable responses.

Rules:
- no open text chat
- multiple-choice only
- at least 5 reusable prompts
- each prompt has 3 to 5 responses
- show a summary before voting
- mobile-first UI and no-scroll overlay design

Return changed files only with full code.
```

---

## Step 12 — Implement Voting and Decommission Resolution

### Objective
Allow players to vote after discussion and resolve elimination or skip.

### Deliverables
- voting UI
- vote submission event
- majority resolution logic
- tie/no-majority handling
- decommission result display
- return to active phase or end phase

### Implementation Notes
- Server resolves vote results.
- Client displays live waiting status.
- Respect dead/alive voting rules according to chosen MVP rules.

### Acceptance Criteria
- All players can vote.
- Majority removes the selected player.
- Tie/no-majority resolves correctly.

### Claude Prompt

```text
Implement Step 12 across both repos.

Goal:
Add voting and decommission resolution.

Requirements:
- server-authoritative vote collection and resolution
- majority eliminate, tie/no-majority skip
- clean UI transitions from discussion -> voting -> outcome
- maintain mobile-first usability

Return changed files only with full code.
```

---

## Step 13 — Implement Win Condition Engine and Match Result Flow

### Objective
Finish the core loop with reliable match-ending logic.

### Deliverables
- task-complete human win
- all-bots-eliminated human win
- parity bot win
- unresolved-critical-sabotage bot win
- result scene/overlay
- replay/back-to-lobby flow

### Implementation Notes
- Run win checks after all major state changes.
- Keep match-end payload clear for the UI.
- Show role reveal summary at the end if desired.

### Acceptance Criteria
- The game ends correctly for all MVP win paths.
- Result UI is understandable and stable.

### Claude Prompt

```text
Implement Step 13 across both repos.

Goal:
Add reliable MVP win condition evaluation and result flow.

Implement win conditions:
- Humans win when all tasks are complete
- Humans win when all bots are eliminated
- Bots win when bot count equals human count
- Bots win when critical sabotage remains unresolved

Return changed files only with full code.
```

---

## Step 14 — Production Hardening for MVP Deployment

### Objective
Polish the project so it is easier to deploy, test, and continue building.

### Deliverables
- environment variable documentation
- CORS config cleanup
- server/client deployment config notes
- simple reconnect messaging or disconnect handling notes
- mobile UX polish
- orientation change handling polish
- README updates for both repos

### Implementation Notes
- Reconnect can remain basic in MVP but should fail gracefully.
- Make deployment configuration explicit for Railway and Vercel.
- Ensure the web app can point at Railway WebSocket URL via env config.

### Acceptance Criteria
- Both repos are deployment-ready.
- Environment variables are documented.
- MVP can be hosted with minimal manual changes.

### Claude Prompt

```text
Implement Step 14 across both repos.

Goal:
Polish and harden the MVP for cloud deployment on Railway + Vercel.

Requirements:
- document env variables
- clean CORS/socket config
- ensure frontend can connect to Railway URL from env
- improve mobile/orientation UX edge cases
- update README files

Return changed files only with full code and deployment notes.
```

---

# 10. Cross-Step State Contract

When Claude starts from any later step, it must assume the project already contains these core concepts.

## Match Phases
Use a central phase enum similar to:
- `LOBBY`
- `ROLE_REVEAL`
- `ACTIVE`
- `DISCUSSION`
- `VOTING`
- `RESULT`

## Core Server State
A room state should conceptually contain:
- room id / room code
- host player id
- player list
- connection status
- match phase
- map state
- roles
- alive/dead state
- task assignments and completion state
- sabotage state
- report/discussion/voting data
- winner / result data

## Core Client Responsibilities
The client should:
- render current phase,
- render synced player data,
- show local private role,
- send player intent events,
- present task/discussion/voting overlays,
- stay responsive on mobile without scroll.

---

# 11. Prompting Template for New Chats

Use this exact structure when resuming work in a new Claude chat.

## Resume Template

```text
We are building Turing Test Game with 2 repos:
- turing-test-game-server (Railway, Node.js, TypeScript, Socket.IO, authoritative game state)
- turing-test-game-web (Vercel, Next.js, TypeScript, Phaser 3, mobile-first no-scroll fullscreen UI)

Global constraints:
- mobile-first
- portrait and landscape support
- responsive viewport scaling
- fit visible screen with no page scrolling
- menus are navigated in-game
- server authoritative for multiplayer state
- keep code modular and TypeScript-based

Current step:
[PASTE STEP NUMBER + STEP NAME]

What already exists:
[PASTE SHORT SUMMARY OF COMPLETED STEPS]

What I need from you:
- implement only this step
- keep architecture consistent with previous steps
- output full code for changed files only
- include directory structure for any new files
- keep app runnable after this step

Use the step instructions from the guide and generate production-quality MVP code.
```

---

# 12. Definition of Done per Step

Claude should consider a step complete only if:

1. The app still runs.
2. The new feature is visible/testable.
3. File structure remains organized.
4. No-scroll fullscreen behavior remains intact.
5. Mobile usage remains first-class.
6. The feature fits the game loop and does not contradict prior architecture.
7. The code is easy to continue in the next chat.

---

# 13. Anti-Drift Rules for Claude

To prevent architecture drift across chats, Claude must NOT:

- convert the project into a single repo,
- move real-time authority entirely to the frontend,
- replace structured discussion with open free chat,
- introduce runtime AI inference as a core dependency,
- create scroll-heavy web pages for core menu navigation,
- break mobile-first assumptions,
- bury all logic in one oversized file,
- change hosting targets away from Railway + Vercel unless explicitly asked.

---

# 14. Suggested MVP Milestone Checks

## Milestone A — Foundation
Completed when Steps 1–4 work.
- both repos run,
- no-scroll full-screen shell works,
- room create/join works.

## Milestone B — Core Playable Loop Skeleton
Completed when Steps 5–7 work.
- match starts,
- roles exist,
- movement works,
- interactions work.

## Milestone C — Social Deduction Gameplay
Completed when Steps 8–12 work.
- tasks,
- sabotage,
- report,
- discussion,
- voting.

## Milestone D — MVP Complete
Completed when Steps 13–14 work.
- win conditions,
- result flow,
- deployment readiness.

---

# 15. Final Instruction to Claude

When asked to implement a step, generate code that is:

- copy-paste ready,
- modular,
- compatible with the previous steps,
- mobile-first,
- no-scroll,
- cloud-ready for Railway + Vercel,
- and safe to continue in a brand-new chat later.

If any detail is ambiguous, choose the simplest implementation that preserves:
- the multiplayer social deduction loop,
- structured discussion instead of free chat,
- the 2-repo architecture,
- and a playable MVP path.
