<!-- 
Sync Impact Report
Version change: 4.0.0 → 5.0.0
Reason: Transition to Phase 4 (Infrastructure). Governance focus shifts from feature development to infrastructure stability, containerization, and reproducibility. Application code is now frozen.
Modified principles:
- "Google Authentication" → "Principle 1: Application Code Freeze"
- "Authenticated Task Endpoints" → "Principle 2: Infrastructure Reproducibility"
- "Security & Best Practices" → "Principle 3: Container Isolation"
- "Data Models" → "Principle 4: Backend Execution Standards"
Added sections:
- Scope (Infrastructure focus)
Removed sections:
- "Deliverables" (Superseded by standard phase artifacts)
- "Restrictions" (Merged into Principles)
Templates requiring updates:
- ✅ .specify/templates/plan-template.md (Constitution Check will align with new principles)
- ✅ .specify/templates/spec-template.md (Requirements will align with infrastructure)
-->
# TaskPilot: Project Constitution

**Version**: 5.0.0 | **Ratified**: 2026-01-02 | **Last Amended**: 2026-01-27

## 1. Project Overview
This constitution governs **Phase 4** of the TaskPilot application. The focus is strictly on establishing clean, reproducible infrastructure using Docker and Kubernetes. The application logic is considered stable and frozen; no feature development is permitted.

### Primary Goal
To deliver a fully containerized, reproducible, and deployable version of TaskPilot without modifying the underlying application source code.

## 2. Core Principles

### Principle 1: Application Code Freeze
**Rule:** The application source code (`frontend/src/**`, `backend/src/**`, `backend/main.py`) is **READ-ONLY**. No logical changes, bug fixes, or feature additions are permitted during this phase. Any required configuration changes must be handled via environment variables or external configuration files, not by modifying source code.

### Principle 2: Infrastructure Reproducibility
**Rule:** All infrastructure MUST be reproducible from scratch. A fresh `git clone` followed by documented build commands (e.g., `docker compose up --build`) MUST result in a fully functional environment without manual intervention or "magic" fixes. All setup steps MUST be codified (Dockerfile, helm charts, compose files).

### Principle 3: Container Isolation
**Rule:** Containers MUST be self-contained. All runtime dependencies (Python packages, Node modules, system libraries) MUST be installed *inside* the Docker images. The application MUST NOT rely on tools or libraries installed on the host system (other than the container runtime itself).

### Principle 4: Backend Execution Standards
**Rule:** The backend container MUST bind to `0.0.0.0` to allow external access. It MUST use a production-ready server (e.g., `uvicorn` with appropriate workers) defined in the `CMD` or `ENTRYPOINT`. Port mappings and environment variables MUST be explicitly defined in the orchestration layer (Docker Compose / Helm).

## 3. Infrastructure Stack
- **Container Engine:** Docker
- **Orchestration:** Docker Compose (Local), Kubernetes/Helm (Production)
- **Base Images:** Official Python (Backend), Official Node/Alpine (Frontend)
- **Database:** PostgreSQL (Containerized for local, External for prod)

## 4. Success Criteria
- `docker compose up` brings up the full stack (Frontend, Backend, DB) successfully.
- Frontend can communicate with Backend via container networking.
- Backend can connect to the Database.
- No "works on my machine" issues; the setup is strictly defined in code.

## 5. Governance
- **Amendment Procedure:** Amendments to this constitution require a new specification and approval.
- **Versioning Policy:** The constitution follows semantic versioning. MAJOR changes are required for backward-incompatible governance or principle removals, MINOR for new principles or material expansions, and PATCH for clarifications or typo fixes.
- **Compliance Review:** All specifications and implementations must be reviewed for compliance with this constitution.
