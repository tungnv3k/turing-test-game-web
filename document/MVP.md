# Turing Test Game — 3-Day MVP

## Overview

**Turing Test Game** is a fast, mobile web-based **social deduction** prototype where players are secretly assigned as either **Humans** or **Bots**.

This MVP is intentionally scoped for a **3-day build**. The goal is to prove the core loop:

**join room → start match → move → do/fake task → kill → report → discuss → vote → win/lose**

The project uses **2 repos**:

- **`turing-test-game-web`** — Vercel-hosted mobile web client (Next.js SPA)
- **`turing-test-game-server`** — Railway-hosted authoritative game server (Node.js + Socket.IO)

---

## MVP Goal

Build the **smallest playable version** of the game that demonstrates:

- hidden roles
- suspicious behavior in a shared map
- one simple task for Humans
- fake task behavior for Bots
- kill + report loop
- structured discussion (no free chat)
- voting and win conditions

This MVP is focused on validating the **social deduction loop**, not content depth or polish.

---

## Core Player Experience

### Humans
- Move around the map
- Complete a real task
- Observe suspicious behavior
- Report bodies
- Discuss via structured prompts
- Vote out suspected Bots

### Bots
- Blend in with Humans
- Fake task interaction
- Kill a player
- Avoid suspicion
- Survive to reach parity or mislead the group during voting

---

## Final 3-Day MVP Scope

### Included

#### Lobby
- Create room
- Join room by code
- Ready/start flow

#### Match
- Secret role assignment: **Human** or **Bot**
- One small shared map
- Top-down movement
- One interaction button

#### Task System
- **1 real task** only
- Recommended task: **CAPTCHA Verification**
- Humans can complete it for progress
- Bots can fake interaction visually but add no progress

#### Elimination / Report
- Bot can kill nearby target
- Dead body remains on map
- Any living player can report body

#### Discussion
- No open text chat
- Structured discussion only
- **2 predefined prompts max** per meeting
- Players choose from fixed responses

#### Voting
- Vote a player or skip
- Tie = no elimination

#### Win Conditions
- **Humans win** if:
  - all tasks are completed, or
  - all Bots are eliminated
- **Bots win** if:
  - number of Bots alive is equal to or greater than Humans alive

---

## Features Explicitly Cut for MVP

To keep the project finishable in **3 days**, the following are **out of scope**:

- multiple maps
- more than 1 real task
- more than 1 sabotage
- advanced UI distortion / hallucination effects
- polished animation system
- account/login system
- matchmaking
- persistent database
- reconnect recovery
- host migration
- advanced summaries for discussion
- dead-player ghost gameplay
- art polish / production assets

### Optional Stretch Goal
If time remains on Day 3:
- add **1 sabotage** that temporarily disables tasks until repaired

If schedule is tight, sabotage should be cut **before** the core accusation loop.

---

## Why This Scope

This prototype is not trying to ship the full GDD.
It is trying to prove the most important question:

> Is the hidden-role accusation loop fun on mobile web?

That means the MVP should prioritize:
- readable movement
- visible task/fake-task behavior
- body report tension
- quick structured discussion
- meaningful vote outcomes

---

## Core Gameplay Loop

1. Players join a room
2. Host starts the match
3. Server assigns secret roles
4. Players spawn into one map
5. Humans do 1 real task
6. Bots fake task or kill
7. A body is discovered and reported
8. Meeting starts
9. Players answer simple structured prompts
10. Players vote
11. Eliminate target or skip
12. Check win conditions
13. Continue or end match

---

## Technical Stack

## Repo 1 — `turing-test-game-web`
**Purpose:** mobile-first web client

### Stack
- **Next.js**
- **React**
- **Socket.IO client**
- **CSS / simple DOM-based map rendering**
- mobile full-screen layout

### Why this approach
For a 3-day MVP, use a **simple CSS/DOM map** instead of a full game engine unless Phaser is already familiar. This keeps implementation fast and reduces setup overhead.

### Responsibilities
- room join/create UI
- lobby screen
- full-screen gameplay UI
- render player positions on a small map
- action buttons (`Use`, `Report`, `Kill`)
- task modal
- discussion modal
- voting modal
- endgame screen

---

## Repo 2 — `turing-test-game-server`
**Purpose:** authoritative real-time game server

### Stack
- **Node.js**
- **Socket.IO**
- optional **TypeScript** if already set up quickly
- **in-memory room state only**

### Responsibilities
- room creation/joining
- lobby state
- match start
- secret role assignment
- authoritative player positions
- task completion validation
- fake task state
- kill validation
- body report handling
- meeting/voting phase changes
- vote tallying
- win condition resolution

### Important rule
The server is the **source of truth** for gameplay.
Clients should only send **intent** (move, interact, kill, vote), while the server validates and broadcasts the real state.

---

## Mobile UX Target

The game should feel like a **full-screen mobile web game**, not a traditional website.

### Recommended UI layout
- **Top-left:** role / status
- **Top-right:** phase / task progress
- **Bottom-left:** movement controls
- **Bottom-right:** action buttons
- **Full-screen overlays:** task, discussion, voting, result

### Design principles
- large touch targets
- minimal text density
- one-screen interactions
- no scrolling during gameplay
- fast readable meetings

---

## Suggested Minimal Map

Use **one tiny map** only.

Recommended layout:
- central room / meeting area
- one task station
- one side corridor or corner for kills
- one sabotage/repair point only if stretch goal is added

The map should be small enough to build quickly, but large enough to allow:
- separation
- observation
- suspicion
- report discovery

---

## Minimal Task Design

### Recommended task: CAPTCHA Verification
Simple version:
- show 1 prompt
- player picks the correct option from 3–4 choices
- server marks task complete

Why this task:
- fast to implement
- easy to understand on mobile
- easy to validate server-side

---

## Structured Discussion Design

No free text chat.

For MVP, use only **2 prompts** per meeting.

### Example prompts
1. **Where were you?**
   - Near task
   - Near center
   - Near corridor
   - I was alone

2. **Who do you suspect?**
   - Player A
   - Player B
   - Player C
   - Skip

This is enough to test whether structured discussion works without building a full chat system.

---

## Simplified Game State Model

Keep the server flow minimal:

```text
LOBBY
ACTIVE
MEETING
VOTING
END
```

This is enough for a 3-day prototype.

---

## Suggested Socket Events

### Client → Server
```text
room:create
room:join
lobby:ready
game:start
player:move
player:interact
player:kill
body:report
discussion:answer
vote:cast
```

### Server → Client
```text
room:update
game:start
game:state
meeting:start
voting:start
vote:result
game:end
error
```

Keep payloads small and implementation simple.

---

## 3-Day Build Plan

## Day 1 — foundation
### Server
- room create/join
- lobby ready/start
- role assignment
- basic room state
- movement sync

### Web
- landing page
- join room flow
- lobby screen
- full-screen game screen
- simple map + player rendering
- movement controls

### Goal
Players can join the same room, start a match, and move around.

---

## Day 2 — deduction loop
### Server
- task interaction
- fake task interaction
- kill logic
- dead body state
- report flow
- phase switch to meeting

### Web
- task modal
- kill button
- report button
- body rendering
- meeting overlay

### Goal
A complete report cycle works: move → task/fake task → kill → report.

---

## Day 3 — resolution
### Server
- vote tally
- elimination
- win checks
- optional sabotage if time remains

### Web
- voting UI
- endgame screen
- role reveal
- restart/rematch button (optional)

### Goal
A full match can be played from room join to final result.

---

## Success Criteria

The MVP is successful if, by the end of Day 3, players can:
- join one room on mobile web
- get secret roles
- move in one shared map
- do or fake one task
- kill and report
- participate in a structured meeting
- vote
- see a correct win/lose result

If all of the above works, the prototype is good enough to validate the game concept.

---

## Recommended Build Priorities

If time becomes tight, keep this priority order:

1. room + lobby
2. role assignment
3. movement
4. task / fake task
5. kill + report
6. discussion
7. voting
8. win conditions
9. sabotage (optional)
10. polish

---

## Bottom Line

For this 3-day MVP:
- keep **2 repos**
- keep the **server authoritative**
- keep the **client simple and mobile-first**
- build the **accusation loop first**
- cut anything that does not directly support suspicion, reporting, discussion, and voting

The prototype should be **ugly but fully playable**.
That is the fastest path to learning whether the game works.
