# Tasks: TaskPilot FastAPI Google Authentication

**Feature**: `1-fastapi-google-auth`
**Spec**: [./spec.md](./spec.md)
**Version**: 2.0

This document outlines the implementation tasks for the TaskPilot FastAPI Google Authentication feature.

## Phase 1: Setup
- [X] T001 Install necessary Python libraries in `backend/requirements.txt`: `google-auth`, `requests`, `python-jose[cryptography]`.
- [X] T002 Add Google OAuth configuration parameters to `backend/src/settings.py` (e.g., `GOOGLE_CLIENT_ID`).

## Phase 2: Public Task Endpoints
**Goal**: As any user, I want to be able to create, view, update, and delete tasks without logging in.
**Independent Test**: A user can perform all CRUD operations on tasks without providing any authentication.

- [X] T003 [US1] Create public endpoints for all CRUD operations on tasks in `backend/src/api/tasks.py`.
- [X] T004 [US1] [P] Create integration tests for the public task endpoints in `backend/tests/integration/test_tasks.py`.

## Phase 3: User Story 2 - Authenticated Chatbot Access
**Goal**: As a user, I want to log in with my Google account to access the AI chatbot.
**Independent Test**: A user can log in with Google, receive a JWT, and use it to access the chatbot endpoint.

- [X] T005 [US2] Create a utility function in `backend/src/auth.py` to verify Google ID tokens.
- [X] T006 [US2] Implement a new endpoint `POST /auth/google` in `backend/src/api/auth.py` to handle Google login and JWT issuance.
- [X] T007 [US2] Create a dependency function `get_current_active_user` in `backend/src/auth.py` to verify the internal JWT.
- [X] T008 [US2] Apply the `get_current_active_user` dependency to the chatbot endpoint.
- [ ] T009 [US2] [P] Create unit tests for the Google ID token verification utility in `backend/tests/auth/test_google_auth.py`.
- [ ] T010 [US2] [P] Create integration tests for the `POST /auth/google` endpoint and the secured chatbot endpoint in `backend/tests/auth/test_google_auth.py`.

## Phase 4: Polish & Cross-Cutting Concerns
- [ ] T011 Ensure the chatbot endpoint returns a `401 Unauthorized` status for requests with missing or invalid authentication tokens.
- [ ] T012 Add comprehensive logging for authentication events.

## Dependencies

- **User Story 1** (Public Tasks) can be implemented independently.
- **User Story 2** (Authenticated Chatbot) can be implemented independently.

## Implementation Strategy
The two user stories can be implemented in parallel. The public task endpoints can be implemented and tested first, followed by the implementation of the Google authentication for the chatbot.