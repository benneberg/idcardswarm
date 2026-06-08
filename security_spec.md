# Security Specification - idCard Personas Swarm

## data Invariants
1. **Agents** can only be created, updated, or deleted by their `ownerId`.
2. **Jobs** are owned by the `userId` who created them.
3. **Tasks** belong to a parent `Job`. Access to tasks is derived from the parent job's ownership.
4. **Evaluations** belong to a parent `Task`. Access is derived from the job ownership hierarchy.
5. All IDs must match `^[a-zA-Z0-9_\-]+$`.
6. Timestamps (`createdAt`, `updatedAt`) must be strictly validated using `request.time`.

## The "Dirty Dozen" Payloads (Denial Expected)
1. **Agent Spoofing**: Create an agent with someone else's `ownerId`.
2. **Infinite Skills**: Create an agent with 10,000 skills (Denial of Wallet).
3. **Job Hijacking**: Update a `Job` owned by another user.
4. **Task Injection**: Create a `Task` under a `Job` you don't own.
5. **Score Poisoning**: Set an `Evaluation` score to 999.
6. **Ghost Fields**: Add an `isAdmin: true` field to an `Agent` card.
7. **Timestamp Fraud**: Set `createdAt` to a date in the past.
8. **ID Poisoning**: Use a 2KB string for `agentId`.
9. **Role Escalation**: Change an agent's `mode` to `admin` (not in enum).
10. **Orphaned Task**: Create a `Task` with a non-existent `jobId`.
11. **Outcome Locking Bypass**: Update a `Job` once its status is `completed`.
12. **Mass Scrape**: Attempt to `list` all jobs without a `userId` filter.

## Test Runner Plan
- Use `@firebase/rules-unit-testing` or similar patterns to verify these.
- For this environment, we will focus on robust rule generation based on these invariants.
