---
id: 20260127-01
title: phase-4-infra-constitution
stage: constitution
date: 2026-01-27
surface: cli
model: gemini
feature: phase-4-infra
branch: main
user: yuri
command: /sp.constitution TASKPILOT – PHASE 4 INFRASTRUCTURE CONSTITUTION
labels: [constitution, governance, infrastructure]
links:
  spec: 
  ticket: 
  adr: 
  pr: 
files:
  - .specify/memory/constitution.md
tests: []
---

## Prompt

/sp.constitution TASKPILOT – PHASE 4 INFRASTRUCTURE CONSTITUTION

Purpose
-------
Phase 4 exists solely to create clean, reproducible infrastructure for TaskPilot.
The application logic is considered frozen and must not be modified in this phase.

Scope
-----
This phase covers:
- Dockerfiles
- Containerization
- docker-compose
- Environment configuration
- Runtime commands

This phase explicitly excludes:
- Feature development
- UI changes
- Backend logic changes
- API contract changes
- Database schema changes

Non-Negotiable Rules
--------------------
1. Application source code MUST NOT be edited.
   - frontend/src/** is read-only
   - backend/app/** and backend/main.py are read-only

2. All infrastructure must be reproducible from scratch.
   - A fresh clone + documented commands must work without manual fixes

3. Containers must be self-contained.
   - All runtime dependencies must be installed inside Docker images
   - No reliance on global/system packages

4. Backend execution rules:

## Response snapshot

Updated constitution to v5.0.0 for Phase 4 Infrastructure, establishing principles for code freeze, reproducibility, and containerization.

## Outcome

- ✅ Impact: Constitution updated to enforce code freeze and infrastructure focus.
- 🧪 Tests: N/A
- 📁 Files: .specify/memory/constitution.md
- 🔁 Next prompts: /sp.plan
- 🧠 Reflection: User provided explicit rules which were directly mapped to principles. Rule 4 was inferred as standard backend execution requirements given the infrastructure context.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
