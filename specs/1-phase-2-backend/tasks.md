# Tasks: Phase II Backend

**Input**: Design documents from `/specs/1-phase-2-backend/`

## Phase 1: Setup

**Purpose**: Project initialization and basic structure

- [x] T001 [P] Create backend folder structure (`backend/src`, `backend/tests`)
- [x] T002 [P] Initialize FastAPI project in `backend/`
- [x] T003 [P] Add dependencies to `backend/requirements.txt`: `fastapi`, `uvicorn`, `sqlmodel`, `psycopg2-binary`, `python-jose[cryptography]`, `passlib[bcrypt]`, `python-multipart`
- [x] T004 [P] Configure environment variable handling for database connection and JWT secret.

---

## Phase 2: Database

**Purpose**: Core infrastructure for data persistence.

- [x] T005 [P] Implement Neon PostgreSQL integration in `backend/src/database.py`.
- [x] T006 [P] Define SQLModel schemas for `User` and `Task` in `backend/src/models.py` based on `data-model.md`.
- [x] T007 Add timestamp fields (`created_at`, `updated_at`) to the base model.

---

## Phase 3: Authentication

**Purpose**: User authentication and authorization.

- [x] T008 [P] Implement JWT validation middleware in `backend/src/auth.py`.
- [x] T009 [P] Create a service to extract `user_id` from JWT.
- [x] T010 [P] Implement request scoping to enforce user-scoped access.

---

## Phase 4: API Endpoints

**Purpose**: Implement the core API endpoints.

- [x] T011 [US1] Implement signup and login endpoints in `backend/src/api/auth.py`.
- [x] T012 [US2] Implement GET tasks endpoint in `backend/src/api/tasks.py`.
- [x] T013 [US2] Implement POST task endpoint in `backend/src/api/tasks.py`.
- [x] T014 [US2] Implement PUT task endpoint in `backend/src/api/tasks.py`.
- [x] T015 [US2] Implement DELETE task endpoint in `backend/src/api/tasks.py`.
- [x] T016 [US3] Implement PATCH task completion endpoint in `backend/src/api/tasks.py`.

---

## Phase 5: Frontend Compatibility

**Purpose**: Ensure the backend is compatible with the frontend.

- [x] T017 Match all response shapes to the frontend's expectations.
- [x] T018 Implement predictable error handling and validation responses.
- [x] T019 Ensure no breaking changes are introduced.
- [x] T020 Ensure the server is stateless.
- [x] T021 Ensure all endpoints are tool-ready for agentic implementation.
- [x] T022 Freeze API contracts for Phase III.
- [x] T023 Move all planning history to `history/phase2backend`.
