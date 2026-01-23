# Implementation Plan: TaskPilot FastAPI Google Authentication

**Branch**: `1-fastapi-google-auth` | **Date**: 2026-01-18 | **Spec**: [specs/1-fastapi-google-auth/spec.md](specs/1-fastapi-google-auth/spec.md)
**Input**: Feature specification from `specs/1-fastapi-google-auth/spec.md`

## Summary
This plan outlines the steps for implementing Google authentication in the backend of TaskPilot using FastAPI. The primary goal is to secure the AI chatbot endpoint, requiring users to authenticate with Google to use it. All other endpoints for task management (CRUD operations) will be publicly accessible without authentication. The implementation will include verifying Google ID tokens, issuing internal JWTs, and applying authentication dependencies to the chatbot endpoint.

## Technical Context

**Language/Version**: Python 3.12+  
**Primary Dependencies**: FastAPI, SQLModel, python-jose[cryptography], google-auth, requests, uvicorn  
**Storage**: Neon Serverless PostgreSQL (via SQLModel)  
**Testing**: pytest  
**Target Platform**: Linux server (Docker/Kubernetes deployment environment)  
**Project Type**: Web API (Backend)  
**Performance Goals**: Google login and JWT issuance under 500ms; Task CRUD operations under 200ms.  
**Constraints**: Must integrate with existing FastAPI structure, use SQLModel for database interaction, and respect the frontend's method of sending Google ID tokens.  
**Scale/Scope**: Supports multi-user authentication; handles user creation/linking based on Google accounts; secures all existing task CRUD endpoints.

## Constitution Check

*GATE: Must pass before proceeding.*

- [X] **Principle 1: Google Authentication**: The plan details how to implement Google ID token verification and user management.
- [X] **Principle 2: Authenticated Task Endpoints**: The plan outlines securing task endpoints with user authentication.
- [X] **Principle 3: Security & Best Practices**: The plan includes token verification, user isolation, and appropriate error handling.
- [X] **Principle 4: Data Models**: The plan specifies updating existing user and task data models for Google integration.
- [X] **Principle 5: Deliverables**: The plan aims to produce FastAPI code, verification logic, updated models, and integration instructions.
- [X] **Specs Drive All Changes**: This plan originates directly from the approved feature specification.
- [X] **No Manual Coding**: The implementation will be done by an agent.

## Project Structure

### Documentation (this feature)

```text
specs/1-fastapi-google-auth/
├── plan.md              # This file (output)
├── spec.md              # Feature specification
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── auth.py          # Existing authentication utilities (will be modified)
│   ├── database.py      # Database engine setup
│   ├── main.py          # FastAPI app, router includes (will be modified)
│   ├── models.py        # SQLModel definitions (will be modified for User/Task)
│   ├── settings.py      # Application settings (will be modified for Google OAuth config)
│   ├── api/
│   │   ├── auth.py      # API routes for authentication (will be modified/extended)
│   │   └── tasks.py     # API routes for tasks (will be modified for authentication dependency)
│   └── services/
│       ├── task_service.py # Task business logic (might need minor auth context)
│       └── chat_service.py # Chat service (likely unaffected, but depends on auth context)
└── tests/
    ├── unit/
    ├── integration/
    └── auth/            # New directory for auth-related tests
        └── test_google_auth.py # New tests for Google authentication
```

**Structure Decision**: The plan extends the existing `backend/src` structure. New authentication logic will be integrated into `auth.py` and `api/auth.py`. Models will be updated in `models.py`. New tests will be placed under a dedicated `backend/tests/auth/` directory.

## Implementation Tasks

### Phase 1: Environment Setup & Dependencies
- [ ] T001 Install necessary Python libraries: `google-auth`, `requests`, `python-jose[cryptography]`.
- [ ] T002 Add Google OAuth configuration parameters to `settings.py` (e.g., `GOOGLE_CLIENT_ID`).

### Phase 2: Public Task Endpoints
- [ ] T003 Create public endpoints for all CRUD operations on tasks in `api/tasks.py`. These endpoints should not require authentication.
- [ ] T004 Create integration tests for the public task endpoints in `tests/integration/test_tasks.py`.

### Phase 3: Google ID Token Verification & User Management
- [ ] T005 Create a new utility function in `auth.py` to verify Google ID tokens.
- [ ] T006 Implement logic in `api/auth.py` for a new endpoint `POST /auth/google` to receive the Google ID token and return an internal JWT.
- [ ] T007 Create unit tests for the Google ID token verification utility in `tests/auth/test_google_auth.py`.
- [ ] T008 Create integration tests for the `POST /auth/google` endpoint in `tests/auth/test_google_auth.py`.

### Phase 4: Secure Chatbot Endpoint
- [ ] T009 Create a dependency function in `auth.py` (`get_current_active_user`) to verify the internal JWT.
- [ ] T010 Apply the `get_current_active_user` dependency to the chatbot endpoint.

### Phase 5: Error Handling & Security Best Practices
- [ ] T011 Ensure the chatbot endpoint returns a `401 Unauthorized` status for requests with missing or invalid authentication tokens.
- [ ] T012 Add comprehensive logging for authentication events.

### Phase 6: Testing
- [ ] T013 Create integration tests for the secured chatbot endpoint.

## Dependencies & Execution Order

### Phase Dependencies
- **Phase 1 (Environment Setup)**: Must be completed first.
- **Phase 2 (Database Model Updates)**: Depends on Phase 1.
- **Phase 3 (Google ID Token Verification)**: Depends on Phase 1 and 2.
- **Phase 4 (Public API Endpoint)**: Depends on Phase 1 and 2.
- **Phase 5 (Secure Task Endpoints)**: Depends on Phase 1, 2, 3, and 4.
- **Phase 6 (Error Handling)**: Can be integrated throughout other phases but finalized after core logic.
- **Phase 7 (Testing)**: Depends on all previous phases for the respective components being tested.

### Parallel Opportunities
- Database model updates (Phase 2) can be done in parallel with setting up Google OAuth configuration (part of Phase 1 if settings are just added).
- Once token verification is implemented (Phase 3), the securing of individual task endpoints (Phase 5) can be modularized and potentially worked on concurrently for different endpoints.
- Error handling (Phase 6) can be developed iteratively alongside core features.
- Testing (Phase 7) should run continuously throughout development but dedicated tasks are for final test suite completion.

## Implementation Strategy
The strategy is to implement the core authentication layer first, ensuring secure user identification. Then, integrate this authentication layer with the existing task management features, ensuring data isolation and authorization at every step. Testing will be continuous and comprehensive, focusing on security and functional correctness.
