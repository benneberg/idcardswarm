# Civitas AI: Strategic Purpose & Vision

## PRODUCT SUMMARY
Civitas AI is a **Persona Swarm Registry and Orchestrator**. It provides a persistent ecosystem for managing autonomous AI entities (Agents) characterized by evolving "Capability Vectors" (DNA). The system allows users to decompose high-level Jobs into granular SwarmTasks, which are then processed by specialized agents whose skills and reputation grow through successful execution.

**Confidence: High** (Directly observed in `App.tsx`, `agentService.ts`, and `swarm-logic.ts`)

---

## PROBLEM STATEMENT
Modern LLM interactions are often transient and lack long-term specialization. Civitas AI solves the problem of **agentic persistence and collaborative scaling**. Instead of single-prompt interactions, it allows for a "digital workforce" that retains identity, evolves its strengths based on performance, and can be managed as a collective "swarm" to solve complex multi-step problems.

**Confidence: High** (Inferred from the existence of the `CapabilityVector` evolution logic and `Succession` protocols)

---

## TARGET AUDIENCE

### 1. AI System Architects & Researchers
*   **Profile**: Technical users building multi-agent systems who need a registry to track "sub-brain" specializations.
*   **Usage**: Mapping capability deltas and observing mutation rates across agent generations.
*   **Pain Points**: Tracking state across hundreds of autonomous interactions.
*   **Confidence: Medium** (Evidence: `ARCHITECTURE.md`, `capabilityEngine.ts` complexity)

### 2. Operational Leads (Digital Workforce)
*   **Profile**: Users automating business/tech workflows that require persistent agent identity (non-technical or semi-technical).
*   **Usage**: High-level job monitoring via the `SwarmBoard`.
*   **Pain Points**: Lack of observability in autonomous task routing.
*   **Confidence: Medium** (Evidence: `SwarmTask` status tracking and `Benchmark` references)

### 3. Narrative & Game Designers
*   **Profile**: Creative users building persistent NPCs or personalities.
*   **Usage**: Utilizing the "Succession" protocol to maintain long-term character ethos.
*   **Pain Points**: Inconsistent character behavior across sessions.
*   **Confidence: Medium** (Evidence: `PersonaMetadata` including fields like `personality` and `narrative` stubs)

---

## VALUE PROPOSITION
*   **Agentic Persistence**: Agents are not just prompts; they are Firestore-backed entities with life cycles (Leveling, XP, Reputation).
*   **Specialization Engine**: The `CapabilityEngine` performs mathematically grounded DNA shifts based on task outcomes, ensuring agents actually "learn" their roles.
*   **Collaborative Orchestration**: Real-time swarm synchronization allows multiple agents (and potentially multiple users) to observe a single job flow.

---

## CORE FEATURES

### Verified (In Codebase)
*   **DNA Registry**: Full CRUD for Agents with radar-chart visualization of capabilities.
*   **Task Decomposition**: AI-driven breakdown of "Jobs" into "SwarmTasks" via Gemini-backed Express proxies.
*   **Real-time Swarm Sync**: Firebase-backed state management for task progress and agent load.
*   **Evolutionary Logic**: `capabilityEngine.ts` calculates XP and DNA shifts on task completion.

### Inferred (Partial/Fragmented)
*   **Sociometric Mapping**: The `relationships` schema exists, but the interactive "Trust Network" graph is partially implemented as a visualizer.
*   **Legacy Succession**: Inheritance logic exists in `agentService.ts` (`spawnHeir`) but lacks a fully automated UI triggering system.

### Future (From Roadmap)
*   **Autonomous Feedback Loop**: Writing trust/reputation updates back to Firestore based on human-in-the-loop validation.
*   **Modular State Architecture**: Moving logic out of the `App.tsx` monolith.
