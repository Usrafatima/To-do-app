# Implementation Plan: TaskPilot Frontend

**Branch**: `feature/homepage-ui` | **Date**: 2026-01-18 | **Spec**: [specs/2-phase-2-frontend/spec.md](specs/2-phase-2-frontend/spec.md)
**Input**: Feature specification from `specs/2-phase-2-frontend/spec.md` (which is now aligned with the broader project constitution)

## Summary
This plan details the implementation of a modern, responsive frontend for the TaskPilot project, now integrating with a backend that features Google Authentication and robust task management. The technical approach remains Next.js (React/TypeScript) for the UI, ensuring seamless interaction with the newly defined backend capabilities while adhering to principles of clean architecture and user experience.

## Technical Context

**Language/Version**: TypeScript (latest stable)
**Primary Dependencies**: Next.js, React, Tailwind CSS
**Storage**: N/A (Frontend is stateless regarding user data, which is managed by the backend)
**Testing**: Jest, React Testing Library
**Target Platform**: Web (Modern Browsers)
**Project Type**: Web Application (Frontend)
**Performance Goals**: First Contentful Paint (FCP) < 1.8s, interactive UI with no jank.
**Constraints**: Must adhere to the backend API contracts defined by the new constitution for authentication and task management. Must be fully responsive.
**Scale/Scope**: Multi-user (via backend auth), comprehensive task management UI, ~5-10 components for the core task features.

## Constitution Check

*GATE: Must pass before proceeding.*

- [X] **Principle 1: Google Authentication**: The frontend plan accounts for user interaction with Google login and sending ID tokens to the backend.
- [X] **Principle 2: Authenticated Task Endpoints**: The frontend design assumes and will interact with authenticated task endpoints requiring user IDs.
- [X] **Principle 3: Security & Best Practices**: The frontend handles JWTs and respects backend security responses (e.g., 401 Unauthorized).
- [X] **Principle 4: Data Models**: The frontend will consume data models (Users, Tasks) as defined by the backend constitution.
- [X] **Principle 5: Deliverables**: The frontend plan contributes to the overall project deliverables, including integration instructions.
- [X] **Spec-Driven Development**: This plan originates from an approved spec and the overarching constitution.
- [X] **Agentic Workflow**: This plan will be broken down into tasks for AI implementation.
- [X] **No Manual Coding**: This plan relies on AI-generated code.
- [X] **In-Memory Data**: The design avoids direct file/database persistence on the frontend.
- [X] **Scope Control**: The scope is limited to frontend UI that integrates with the new backend features.
- [X] **Clean Code**: The proposed structure promotes clean code standards.
- [X] **Required Features**: This plan addresses the frontend implementation of features requiring the new authentication and task management.
- [X] **Documentation Discipline**: The output will be documented according to the constitution.
- [X] **Evaluation Criteria**: The plan includes steps to meet the evaluation criteria from the spec.

## Project Structure

### Documentation (this feature)

```text
specs/2-phase-2-frontend/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (created by /sp.tasks)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── tasks/
│   │   │   ├── TaskContainer.tsx
│   │   │   ├── TaskList.tsx
│   │   │   ├── TaskItem.tsx
│   │   │   └── AddTask.tsx
│   │   └── timer/
│   │       ├── FocusTimer.tsx
│   │       └── TimerControls.tsx
│   ├── styles/
│   │   └── globals.css
│   └── lib/
│       └── apiClient.ts # Mock client for Phase 1 logic
└── tests/
    └── unit/
        ├── TaskContainer.test.tsx
        └── FocusTimer.test.tsx
```

**Structure Decision**: The structure is a standard Next.js application. `apiClient.ts` will initially contain mock implementations, but will be updated to interact with the new authenticated backend endpoints.

## Complexity Tracking
No violations of the constitution were necessary.
