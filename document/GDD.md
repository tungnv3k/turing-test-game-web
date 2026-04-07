
# Turing Test Game

## 1. Game Overview
**Turing Test Game** is a multiplayer social deduction game in which players are secretly assigned to one of two teams: **Humans** or **AI Bots**. The experience is built around deception, observation, teamwork, and accusation inside an AI-themed setting. Rather than relying on runtime-generated AI behavior, the game simulates the AI fantasy through predefined roles, fixed interaction systems, and structured choices.

## 2. High Concept
Players share a common space and must interpret each other’s behavior while progressing through a match. Humans attempt to stabilize the system by completing tasks and responding to crises, while AI Bots blend in, fake legitimate behavior, sabotage the environment, and mislead the group. The central dramatic question is whether players can correctly identify who is truly human and who is only pretending.

## 3. Player Roles

### 3.1 Human
Humans are the cooperative team. Their responsibilities include completing assigned tasks, resolving sabotage, reporting bodies, participating in discussion, and voting to remove suspected AI Bots.

### 3.2 AI Bot
AI Bots are the hidden opposing team. Their responsibilities include faking task participation, sabotaging the system, deceiving other players during group phases, and surviving long enough to trigger a bot victory condition. Bots may also be able to terminate players as part of the MVP gameplay loop.

## 4. Core Gameplay Loop
The match flow follows a structured social deduction loop built around active play and periodic group resolution.

### 4.1 Active Play
Players move around a shared map, complete or fake tasks, observe each other, and react to emerging threats. This is the primary phase for behavioral deduction.

### 4.2 Sabotage / Crisis
AI Bots can disrupt normal play by triggering sabotage events that create urgency, split player attention, and interfere with team progress.

### 4.3 Report
If a player discovers a body, they can report it to stop active play and force the group into the next decision-making phase.

### 4.4 Discussion
Following a report, players enter a structured discussion phase where they respond to predefined prompts rather than using freeform chat.

### 4.5 Voting
After discussion, players vote to decommission a suspect or skip elimination. This determines whether someone is removed from the match or play continues.

### 4.6 Resolution
The game either returns to active play or ends if one of the win conditions has been met.

## 5. Game Scope
The MVP version includes multiplayer room play, one shared map, two player roles, top-down movement, three tasks, two sabotage types, body reporting, structured discussion, voting, and win-condition resolution.

## 6. Tasks System
Tasks represent the Human team’s primary objective and are the main non-social gameplay component during active play. Humans complete real tasks that contribute toward overall victory progress, while bots may appear to interact with tasks without generating actual value.

### 6.1 MVP Tasks
- **CAPTCHA Verification**
- **Data Sorting**
- **Logic Chain Repair**

### 6.2 Fake Task Behavior
Bots can visually fake task interactions to create uncertainty and manipulate player perception, but they do not contribute to real system progress.

## 7. Sabotage System
Sabotage is the AI Bot team’s main pressure mechanic. It interrupts the Human team’s workflow, creates urgency, and forces players into reactive behavior that can be exploited socially.

### 7.1 MVP Sabotage Types
- **Data Corruption** — a sabotage state that can block or interfere with task activity until repaired.
- **Hallucination Injection** — a sabotage effect that can distort labels, UI, or task readability to create confusion.

### 7.2 Design Purpose
Sabotage is designed to create tension, divide players, hide malicious intent, and support a bot win condition if critical systems remain unresolved.

## 8. Elimination and Reporting
The design includes a body-reporting flow tied to the social deduction loop. If elimination is enabled in the MVP, bots can terminate players, bodies become reportable world events, and a successful report moves the game into the discussion phase. Dead players are intended to be visually distinct and restricted from certain actions.

## 9. Discussion System
The discussion phase is a key differentiator of the game. Instead of allowing open text chat, the design uses a **structured multiple-choice discussion system** made of predefined prompts and selectable response options. This keeps discussion readable, thematic, controlled, and easier to balance while still supporting deduction and accusation.

### 9.1 Discussion Characteristics
- No open text chat is used.
- Prompts are predefined and reusable.
- Each prompt offers multiple selectable responses.
- A summary is generated from chosen options before voting begins.

## 10. Voting System
Voting is the group’s primary method of social resolution. After the discussion phase, players choose whether to decommission a suspect or skip. The result may eliminate a player, produce no elimination in the case of a tie or no majority, or return the match to active play if the game is not over.

## 11. Win Conditions

### 11.1 Human Victory
Humans win if all tasks are completed or if all AI Bots are eliminated.

### 11.2 AI Bot Victory
AI Bots win if bot count equals human count or if critical sabotage remains unresolved.

## 12. Design Pillars
- **Behavioral Deception** — suspicion is driven by player actions, positioning, timing, and visible interactions rather than generated dialogue.
- **Structured Social Deduction** — discussion and accusation are intentionally guided through prompts and selectable responses.
- **Readable Multiplayer Tension** — tasks, sabotage, reports, and votes all support a clear and observable deduction loop.
- **Focused MVP Scope** — the design centers on one map, a limited set of systems, and a short, playable social loop.

## 13. Intended Player Experience
The intended experience is a compact, replayable multiplayer session where players constantly interpret suspicious behavior under pressure. Humans should feel uncertain but purposeful as they manage tasks and crises, while bots should feel empowered to manipulate timing, misdirect blame, and exploit confusion. The result should be a tense but readable social deduction experience with a distinctive AI theme.
