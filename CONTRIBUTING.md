# Contributing to Civitas AI

Thank you for your interest in contributing to Civitas AI. This document outlines our development workflows, code standards, and verification procedures.

---

## 🛠️ Development Setup

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher
* **Google Gemini API Key**: Acquired from [Google AI Studio](https://aistudio.google.com/)
* **Firebase Project**: Firestore database and Firebase Authentication

### Initial Setup
1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/benneberg/idcardswarm.git
   cd idcardswarm
   npm install
   ```

2. Configure local environment:
   ```bash
   cp .env.example .env
   ```
   Populate `GEMINI_API_KEY` and client `VITE_FIREBASE_*` variables.

3. Start local development server:
   ```bash
   npm run dev
   ```
   The application binds to port 3000 at `http://localhost:3000`.

---

## 📜 Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Boots Express backend with Vite middleware in development mode |
| `npm test` | Runs the full Vitest unit and invariant test suite |
| `npm run lint` | Runs TypeScript compiler (`tsc --noEmit`) to verify static type soundness |
| `npm run build` | Compiles client assets to `dist/` and bundles `server.ts` to `dist/server.cjs` via esbuild |
| `npm start` | Launches the compiled production server (`node dist/server.cjs`) |
| `npm run clean` | Removes compiled artifacts in `dist/` |

---

## 🧪 Testing Standards & Guidelines

We maintain a high-confidence automated testing suite using **Vitest** and **React Testing Library**.

### Running Tests
```bash
# Run all tests once
npm test

# Run tests in watch mode
npx vitest

# Run a specific test suite
npx vitest run src/test/SecurityInvariants.test.ts
```

### Test Suites Structure (`src/test/`)
* **`AgentCardItem.test.tsx`**: UI rendering, event dispatching, and badge representation.
* **`CapabilityEngine.test.ts`**: Pure mathematical calculations for capability deltas and clamp bounds $[0.05, 0.95]$.
* **`SocialDynamics.test.ts`**: Interaction bonding chances, environmental stress modifiers, and mean-reverting trust decay.
* **`Inheritance.test.ts`**: Generational inheritance math (30% parent weighting, stochastic mutation, generation counters).
* **`SecurityInvariants.test.ts`**: Enforces the "Dirty Dozen" security invariants and access control rejections.
* **`SwarmExecution.test.ts`**: DAG task dependency resolution, cycle breaking, and status tracking.
* **`DecomposeSchema.test.ts`**: Zod and API schema contract validation for AI proxy endpoints.
* **`CollectiveIntelligenceAndInstitutions.test.ts`**: Autonomous peer delegation, institutional cultural DNA buffs, and market bidding.

### Testing Rules
1. **No Code Without Tests**: Any modification to capability calculations, relationship dynamics, security rules, or server endpoints must be accompanied by unit tests.
2. **Deterministic Assertions**: Tests must not rely on live network connectivity or active Firebase project states; use mocked Firebase instances (`vi.mock('firebase/firestore')`) and deterministic fixtures.
3. **Bound Verification**: All mathematical formulas that modify capabilities, trust, or currency must assert boundary clamping.

---

## 📐 Architecture & Coding Standards

1. **Security First**:
   * Never expose `GEMINI_API_KEY` or third-party secret keys to client code (`src/`). Secrets belong exclusively in server runtime (`server.ts` and `src/lib/gemini.ts`).
   * Do not introduce `VITE_` prefixed variables for sensitive API tokens.

2. **TypeScript & Type Safety**:
   * Keep shared types in `src/types.ts`.
   * Standard TypeScript `enum` or union types must be used for finite state machines (e.g. task statuses, agent modes, environment types).
   * Strict compiler checks: Code must compile with zero errors under `npm run lint`.

3. **Styling & User Interface**:
   * Style components using Tailwind CSS 4 utility classes.
   * Avoid custom CSS files or inline `style` tags (except dynamic coordinate math in SVG/D3 charts).
   * Icons must be imported from `lucide-react`.
   * Animations must be imported from `motion/react`.

4. **Data Persistence & Concurrency**:
   * All mutations to task claiming or progression must be performed inside atomic Firestore transactions (`runTransaction`) to guard against race conditions.
   * Timestamps must use `serverTimestamp()` on document creation and update.

---

## 📋 Pull Request Verification Checklist

Before submitting a pull request, ensure all of the following checks pass:

- [ ] `npm run lint` completes with zero TypeScript errors.
- [ ] `npm test` runs and all 53+ test cases pass.
- [ ] `npm run build` succeeds without bundle or compilation warnings.
- [ ] No secrets or `.env` files are committed.
- [ ] Any new architectural invariants or schemas are reflected in `ARCHITECTURE.md`.
