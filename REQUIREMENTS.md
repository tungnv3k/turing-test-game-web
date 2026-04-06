# Turing Test Game 🎮
## Concise GDD + MVP Checklist

## 1. Game Summary

**Turing Test Game** is a multiplayer social deduction game where **Humans** must complete AI-themed tasks and identify infiltrating **AI Bots**, while bots attempt to sabotage the system, deceive players, and win through elimination or system failure.

The game is inspired by:
- social deduction gameplay,
- AI infiltration themes,
- Turing Test / Terminator-style identity paranoia,
- and structured discussion instead of free chat.

> **Core rule:** No real AI is required at runtime.  
> All AI behavior is simulated with predefined roles, prompts, and response options.

---

## 2. Core Concept

### Player Fantasy
- **Humans** feel like system operators trying to detect machine infiltrators.
- **AI Bots** feel like deceptive impostors pretending to be human.
- The match revolves around **tasks, sabotage, suspicion, discussion, and voting**.

### Core Loop
1. Players move around the map
2. Humans complete tasks
3. Bots fake tasks and trigger sabotage
4. A terminated player is reported
5. Discussion phase begins
6. Players vote to decommission a suspect
7. Repeat until one side wins

---

## 3. Theme and Setting

The entire game uses **AI/system terminology** instead of classic spaceship language.

### Theme Mapping
- Crew → Humans
- Impostors → AI Bots
- Tasks → AI Verification Challenges
- Sabotage → Data Corruption / Hallucination Injection / Network Outage
- Emergency Meeting → System Audit
- Vote Out → Decommission
- Kill → Terminate Process
- Vent → Network Port Fast Travel

### Tone
- Futuristic
- Suspicious
- Technical but playful
- Strong “human vs machine” identity conflict

---

## 4. Target Experience

### Intended Feel
- Fast rounds
- Easy to understand
- Strong deception tension
- Clear AI-themed identity
- Minimal moderation complexity

### Design Goals
- Keep the rules simple
- Make the AI theme obvious in every mechanic
- Avoid runtime AI and open text chat
- Keep the prototype feasible for a short build timeline

---

## 5. Roles

## 5.1 Humans
### Goal
- Complete all tasks
- Fix sabotage
- Identify and vote out AI Bots

### Actions
- Move
- Do tasks
- Report bodies
- Fix sabotage
- Join discussion
- Vote

---

## 5.2 AI Bots
### Goal
- Sabotage the system
- Blend in with humans
- Mislead players
- Reduce humans until bots gain parity

### Actions
- Move
- Fake tasks
- Trigger sabotage
- Participate in discussion with deceptive options
- Terminate humans *(if enabled)*

### Fake Task Rule
Bots can visually pretend to do tasks, but:
- do not contribute to system progress,
- only simulate participation.

---

## 5.3 Optional Special Roles
These are optional and should not block MVP development.

### Hacker
- Can scan one player per round
- Gets a simple suspicion hint based on recent behavior or discussion pattern

### System Admin
- Can instantly fix one sabotage once per game
- Can receive simplified system log hints

### Analyst
- Gets improved discussion hints or extra answer context

---

## 6. Tasks

Tasks are human-only objectives used to fill the **System Stability** bar.

### Task Types
- **CAPTCHA Verification**  
  Click correct images

- **Confidence Calibration**  
  Match a meter to a target zone

- **Data Sorting**  
  Sort items into `Valid Data` vs `Noise`

- **Bias Cleanup**  
  Remove outliers from a list

- **Logic Chain Repair**  
  Reorder shuffled logic steps

### Task Design Rules
- Short and readable
- Easy to implement in web UI
- Thematically AI-related
- Suitable for repeatable multiplayer flow

---

## 7. Sabotage

Bots can disrupt the match through AI-themed system failures.

### Sabotage Types
- **Hallucination Injection**  
  Distorts task UI or labels

- **Data Corruption**  
  Blocks or disrupts tasks until repaired

- **Network Outage**  
  Slows movement or delays player interaction

- **Identity Spoofing** *(optional)*  
  Makes bot logs appear more human

### Sabotage Purpose
- Break human coordination
- Force urgent responses
- Create suspicion and chaos
- Give bots windows for deception

---

## 8. Discussion System

This is the game’s main differentiator.

Instead of open-ended chat, players use a **structured multiple-choice discussion system**.

### Why
- Avoid toxic free chat
- Reduce moderation burden
- Maintain AI theme
- Avoid needing runtime AI text generation

### Example Prompt Types
- “Who showed inconsistent confidence patterns?”
- “Who avoided CAPTCHA tasks?”
- “Who stayed near corrupted data nodes?”
- “Who displayed hallucination-like behavior?”

### Example Response Styles
- Neutral
- Accusing
- Defending
- Statistical
- Emotional
- Robotic

### Discussion Flow
1. Prompt appears
2. Players choose from 3–5 responses
3. Results are summarized
4. Voting begins

---

## 9. Voting

After discussion, all players vote to **decommission** one player.

### Rules
- Majority vote eliminates the selected player
- No majority = no elimination
- Eliminated players are removed from active play
- The match then resumes or ends if win conditions are met

---

## 10. Win Conditions

## Humans Win If
- All tasks are completed
- All AI Bots are eliminated

## AI Bots Win If
- Bots equal humans
- A major sabotage is not fixed in time
- Humans lose control of the system

---

## 11. Game Flow

### Match Start
- Players join room
- Roles are assigned secretly
- Match begins

### Active Phase
- Humans complete tasks
- Bots fake tasks or sabotage
- Players move around map

### Report / Audit Phase
- A terminated player is reported
- Discussion prompt is triggered

### Discussion Phase
- Players select responses
- Summary is shown

### Voting Phase
- Players vote to decommission someone

### End Phase
- Win conditions checked
- Match ends or returns to active phase

---

## 12. Technical Scope

## Recommended Stack
### Frontend
- **Phaser 3**
- Best for a quick 2D multiplayer prototype

### Backend
- **Node.js**
- **Socket.io** for real-time multiplayer

### Synced State
- Player positions
- Alive/dead state
- Role state
- Task progress
- Sabotage state
- Discussion prompt state
- Voting results
- Match outcome

---

## 13. Core Systems

The prototype should include these systems:

### Required
- Room / match session
- Role assignment
- Player movement
- Task interaction
- Sabotage triggering
- Report body event
- Discussion prompt flow
- Voting flow
- Win condition check

### Suggested Internal State Machines
- Player FSM
- Task FSM
- Sabotage FSM
- Meeting FSM
- Voting FSM

---

## 14. MVP Scope

The MVP should focus only on the smallest fun playable version.

### MVP Features
- 1 map
- 2 role types:
  - Human
  - AI Bot
- 3 task minigames
- 2 sabotage types
- Body reporting
- Structured discussion prompts
- Voting
- Basic win conditions
- Multiplayer room support

### Out of Scope for MVP
- Special roles
- Terminator mode
- Identity spoofing
- Multiple maps
- Deep animation polish
- Cosmetic systems
- Complex progression
- Matchmaking service
- Reconnect handling
- Voice chat
- Open text chat

---

## 15. MVP Checklist

## Game Setup
- [ ] Create multiplayer room system
- [ ] Support player join/leave before match start
- [ ] Assign secret roles at match start
- [ ] Spawn players into map

## Movement
- [ ] Implement top-down movement
- [ ] Sync movement across all players
- [ ] Show player identity/display name

## Tasks
- [ ] Implement Task 1: CAPTCHA Verification
- [ ] Implement Task 2: Data Sorting
- [ ] Implement Task 3: Logic Chain Repair
- [ ] Track task completion per player
- [ ] Update global System Stability bar
- [ ] Prevent bots from adding real task progress

## Sabotage
- [ ] Implement Sabotage 1: Data Corruption
- [ ] Implement Sabotage 2: Hallucination Injection
- [ ] Allow humans to repair sabotage
- [ ] Apply sabotage effects globally or locally

## Elimination / Reporting
- [ ] Allow bots to terminate players *(if elimination is enabled in MVP)*
- [ ] Mark terminated players clearly
- [ ] Allow live players to report a body
- [ ] Transition from report to discussion phase

## Discussion
- [ ] Build prompt-based discussion UI
- [ ] Add at least 5 reusable discussion prompts
- [ ] Add 3–5 selectable responses per prompt
- [ ] Show discussion summary before voting

## Voting
- [ ] Build voting UI
- [ ] Collect all votes
- [ ] Resolve majority result
- [ ] Eliminate selected player or skip if tied/no majority

## Win Conditions
- [ ] Humans win when all tasks are complete
- [ ] Humans win when all bots are eliminated
- [ ] Bots win when bot count equals human count
- [ ] Bots win if critical sabotage remains unresolved

## UI / UX
- [ ] Show role privately to each player
- [ ] Show task list for humans
- [ ] Show fake task list for bots
- [ ] Show sabotage alert
- [ ] Show meeting/discussion/voting transitions
- [ ] Show win/lose screen

## Networking
- [ ] Sync player movement
- [ ] Sync task completion
- [ ] Sync sabotage events
- [ ] Sync report/discussion/voting states
- [ ] Sync eliminations and match result

---

## 16. Success Criteria for MVP

The MVP is successful if:
- players can join a match,
- move around a map,
- complete tasks,
- sabotage can interrupt play,
- a body can be reported,
- discussion and voting can happen,
- and one side can win using the intended rules.

If those systems work reliably, the core game loop is validated.

---

## 17. Post-MVP Expansion Ideas

After MVP is stable, consider adding:

- Hacker / Admin / Analyst roles
- Terminator variant
- Identity spoofing
- More sabotage types
- More task variations
- Multiple maps
- Better visual feedback
- Better session flow and polish
- Match settings / custom rules
- Spectator mode
- Replay or event log

---

## 18. Short Summary

**Turing Test Game** is a web-based multiplayer social deduction game where:
- **Humans** complete AI-themed tasks and expose infiltrators,
- **AI Bots** sabotage systems and fake human behavior,
- and discussion is handled through **structured choices** instead of free chat.

The MVP should prioritize:
- simple movement,
- task completion,
- sabotage,
- report/discussion/voting flow,
- and reliable win conditions.
