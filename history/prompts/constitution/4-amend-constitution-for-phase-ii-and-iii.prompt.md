---
id: 20260112181500
title: Amend Constitution for Phase II & III
stage: constitution
date: 2026-01-12
surface: CLI
model: gemini-1.5-pro
feature: 
branch: 
user: 
command: /sp.constitution
labels: []
links:
  spec: 
  ticket: 
  adr: 
  pr: 
files:
  - .specify/memory/constitution.md
  - .specify/templates/plan-template.md
  - README.md
tests:
files_summary: 3
---

## Prompt

/sp.constitution

Project: Hackathon II – Phase II & Phase III Todo Application

SOURCE OF TRUTH:
- Phase 2 Frontend is the authoritative reference for:
  - UI behavior
  - Task structure
  - User interactions
  - Feature availability

GLOBAL RULES:
1. Backend MUST conform to the existing Phase 2 frontend
2. No frontend refactors unless explicitly specified
3. Phase 1 console logic is historical reference only
4. Backend APIs must support frontend flows exactly
5. Phase III chatbot MUST reuse Phase 2 backend APIs
6. No duplicate logic across layers
7. All auth is JWT-based (Better Auth compatible)
8. All state is stored in Neon PostgreSQL
9. Server must be stateless
10. All deleted or superseded work goes to:
    history/phase2backend
11. Specs drive ALL changes (Spec-Kit Plus only)
12. No manual coding outside agent instructions

## Response snapshot

I have updated the project constitution to version 3.0.0 based on the new global rules provided. The constitution has been written to `.specify/memory/constitution.md`.

I have also updated the following files to be consistent with the new constitution:
- `.specify/templates/plan-template.md`
- `README.md`

I have also created a PHR for this interaction.

## Outcome

- ✅ Impact: The project constitution has been updated to version 3.0.0, and all dependent files have been updated to be consistent with the new constitution.
- 🧪 Tests: No tests were run.
- 📁 Files: 3 files were modified.
- 🔁 Next prompts: None.
- 🧠 Reflection: The user provided a clear set of global rules that I was able to use to create a new constitution. The process of updating the dependent files was straightforward.
