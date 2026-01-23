# Phase 4 Tasks: Advanced Implementation

## 1. Backend Development
- [ ] **TASK-401:** Update `models.py` with `Priority` enum and new `Task` fields (`priority`, `tags`, `due_date`).
- [ ] **TASK-402:** Update `task_service.py` to support dynamic filtering in `get_all_tasks`.
- [ ] **TASK-403:** Implement `/healthz` endpoint in `main.py`.
- [ ] **TASK-404:** Implement background notification logger in FastAPI lifespan.

## 2. Docker Setup
- [ ] **TASK-420:** Create `backend/Dockerfile` using multi-stage build.
- [ ] **TASK-421:** Create `frontend/Dockerfile` with production optimization.
- [ ] **TASK-422:** Create root `docker-compose.yml` with proper networking and environment variables.

## 3. Frontend Development
- [ ] **TASK-407:** Update `apiClient.ts` interfaces and `getTasks` method to support query params.
- [ ] **TASK-408:** Create `FilterControls.tsx` component with search and priority select.
- [ ] **TASK-409:** Update `TaskItem.tsx` to display priority badges and tags.
- [ ] **TASK-410:** Connect `TaskContainer.tsx` state to `FilterControls` and trigger API calls.

## 4. AI & Polish
- [ ] **TASK-411:** Update AI Agent system prompt to understand and use priority/tags when creating tasks.
- [ ] **TASK-412:** Add visual animations (framer-motion) for task filtering transitions.
