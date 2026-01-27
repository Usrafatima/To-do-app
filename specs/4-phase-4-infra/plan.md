# Implementation Plan - Phase 4 Infrastructure

**Feature**: Phase 4 Infrastructure
**Status**: Planned
**Date**: 2026-01-27

## Technical Context

This phase focuses on containerizing the existing TaskPilot application. The goal is to create a reproducible, consistent development and production environment using Docker and Docker Compose, strictly adhering to a code freeze for the application logic.

### Knowns
- **Frontend**: Next.js application in `frontend/`. Requires Node.js. Serves on port 3000.
- **Backend**: FastAPI application in `backend/`. Requires Python 3.12+. Serves on port 8000.
- **Database**: SQLite currently (`test.db`), but production goal is PostgreSQL (managed via Neon, but local dev should use containerized Postgres or SQLite volume).
- **Constraints**: No changes to `frontend/src` or `backend/src`.

### Unknowns & Riskiest Assumptions
- **Assumption**: The current `requirements.txt` and `package.json` are complete and sufficient for a fresh install.
- **Assumption**: The frontend can accept the backend URL via build-time `NEXT_PUBLIC_` env var or runtime configuration without code changes. (Risk: Next.js often bakes env vars at build time).
- **Unknown**: Specific version compatibility between local Docker Postgres and Neon Serverless (if migration is tested).

## Constitution Check

| Principle | Check | Status | Notes |
| :--- | :--- | :--- | :--- |
| **1. Application Code Freeze** | Does this plan require modifying `src/`? | PASS | Plan operates strictly on `Dockerfile` and `docker-compose.yml`. |
| **2. Infrastructure Reproducibility** | Is the setup fully automated? | PASS | Uses standard Docker patterns. |
| **3. Container Isolation** | Are dependencies isolated? | PASS | Dockerfiles will install all deps inside. |
| **4. Backend Execution Standards** | Does it use `0.0.0.0`? | PASS | Explicitly defined in plan. |

## Phase 0: Research & Validation

*(Self-Correction/Research Steps)*

- [ ] **Verify Next.js Env Vars**: Confirm if `NEXT_PUBLIC_API_URL` can be injected at runtime or if we need a build-time ARG in Docker.
- [ ] **Verify Database Connection**: Determine if the backend currently hardcodes `sqlite:///test.db` or accepts a `DATABASE_URL` env var. (Crucial for Principle 1 compliance).

## Phase 1: Design & Contracts

### Data Model Changes
*None.* This is an infrastructure-only phase. No schema changes.

### API Contracts
*None.* Existing contracts remain unchanged.

### Infrastructure Design

**1. Backend Dockerfile (`backend/Dockerfile`)**
- Base: `python:3.12-slim`
- Workdir: `/app`
- Copy `requirements.txt` -> Install -> Copy `src/`
- Command: `uvicorn src.main:app --host 0.0.0.0 --port 8000` (path to be verified)

**2. Frontend Dockerfile (`frontend/Dockerfile`)**
- Base: `node:20-alpine`
- Builder Stage: Install deps -> `npm run build`
- Runner Stage: Copy `.next` -> Start with `npm start`
- Port: 3000

**3. Orchestration (`docker-compose.yml`)**
- Service `backend`:
  - Build context: `backend/`
  - Env: `DATABASE_URL`
- Service `frontend`:
  - Build context: `frontend/`
  - Env: `NEXT_PUBLIC_API_URL`
  - Depends on: `backend`

## Phase 2: Implementation Breakdown

### Tasks

1.  **Analyze Configuration Injection**:
    *   Check `backend/src/settings.py` (or similar) to see how `DATABASE_URL` is loaded.
    *   Check `frontend` config to see how API URL is loaded.
2.  **Create Backend Dockerfile**:
    *   Draft and test build locally.
3.  **Create Frontend Dockerfile**:
    *   Draft and test build locally.
4.  **Create Docker Compose**:
    *   Assemble services.
    *   Define network.
5.  **Validation**:
    *   Run `docker compose up`.
    *   Verify connectivity.

## Phase 3: Review & Handover
- Verify against Success Criteria SC-001 to SC-004.
- Commit to branch `4-phase-4-infra`.