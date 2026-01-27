# Tasks: Phase 4 Infrastructure

**Feature**: Phase 4 Infrastructure
**Branch**: `4-phase-4-infra`
**Status**: Planned

## Dependencies

1.  **Phase 1 (Setup)**: Completed before any other tasks.
2.  **Phase 2 (Foundational)**: Completed before User Stories.
3.  **Phase 3 (One-Command Deployment)**: Must complete to satisfy MVP (US1).
4.  **Phase 4 (Container Isolation)**: Refinement for strict isolation (US2).
5.  **Phase 5 (Polish)**: Final validation.

## Phase 1: Setup

*Goal: Initialize branch and confirm environment variable handling.*

- [x] T001 Verify `DATABASE_URL` injection support in `backend/src/settings.py` (or similar).
- [x] T002 Verify `NEXT_PUBLIC_API_URL` usage in frontend source to confirm injection strategy (runtime vs. build time).

## Phase 2: Foundational

*Goal: Create base configuration files for infrastructure.*

- [x] T003 Create `.dockerignore` for Backend to exclude `__pycache__`, `.venv`, `.git`.
- [x] T004 Create `.dockerignore` for Frontend to exclude `node_modules`, `.next`, `.git`.
- [x] T005 [P] Create initial `backend/Dockerfile` using `python:3.12-slim`.
- [x] T006 [P] Create initial `frontend/Dockerfile` using `node:20-alpine` (multi-stage build).

## Phase 3: User Story 1 - One-Command Local Deployment

*Goal: `docker compose up` brings the full stack online (MVP).*

- [x] T007 [US1] Create `docker-compose.yml` defining `backend` and `frontend` services.
- [x] T008 [US1] Configure `backend` service in compose (port 8000, `DATABASE_URL`, volume mount for `test.db` if sqlite).
- [x] T009 [US1] Configure `frontend` service in compose (port 3000, `NEXT_PUBLIC_API_URL` pointing to backend).
- [x] T010 [US1] Define shared bridge network in `docker-compose.yml` for service discovery.
- [x] T011 [US1] Implement `CMD` in Backend Dockerfile to run `uvicorn src.main:app --host 0.0.0.0 --port 8000`.
- [x] T012 [US1] Implement startup script/CMD in Frontend Dockerfile to serve production assets.

## Phase 4: User Story 2 - Containerized Isolation

*Goal: Ensure no host dependencies are required.*

- [x] T013 [P] [US2] Verify Backend Dockerfile installs all dependencies from `backend/requirements.txt` *inside* image.
- [x] T014 [P] [US2] Verify Frontend Dockerfile performs `npm ci` and `npm run build` *inside* builder stage.
- [x] T015 [US2] Add healthcheck to Backend service in `docker-compose.yml` (curl `/docs` or `/health`).
- [x] T016 [US2] Add healthcheck to Frontend service in `docker-compose.yml` (wget/curl `/`).

## Phase 5: Polish & Cross-Cutting Concerns

*Goal: Final validation and cleanup.*

- [x] T017 Create `infra-validation.sh` script to verify 200 OK from both services (smoke test).
- [x] T018 Run full `docker compose up --build` on fresh context to verify <15s startup (SC-001).
- [x] T019 Document usage in `README.md` (how to start, environment vars).

## Implementation Strategy
- **Parallel Execution**: Dockerfiles (T005, T006) can be written simultaneously.
- **Incremental Testing**: Test `docker build` for each service individually before testing `docker compose up`.
- **Key Risk**: Frontend connecting to Backend (CORS or network addressing) - address in T009/T010.
