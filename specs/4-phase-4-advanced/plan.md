# Phase 4 Implementation Plan: Advanced Features & Docker

## 1. Architecture Update
The system remains a Decoupled Three-Tier architecture but introduces a container orchestration layer using Docker Compose.

### Backend Refactoring
- Implement a `FilterService` to handle dynamic SQL query generation.
- Implement a `lifespan` event handler in FastAPI for the notification background task.

### Docker Strategy
- **Backend:** Python 3.12-slim base. Uses `uv` for dependency management if available, otherwise `pip`.
- **Frontend:** Node.js 20-alpine. Multi-stage build to reduce image size (Build -> Production).
- **Orchestration:** `docker-compose.yml` defining `frontend`, `backend`, and `db` services.

## 2. Component Design

### Notification Stub
- A background loop that runs every 60 seconds.
- Queries the database for `Task.due_date` between `now` and `now + 15 minutes`.
- Logs a mock notification to the console.

### Enhanced Search UI
- A `FilterBar` component placed above the task list.
- Debounced search input (300ms delay).
- Select dropdowns for Priority and Sort order.

## 3. Sequence Diagrams
**Search Flow:**
1. User types "Meeting" in search bar.
2. Frontend waits 300ms (debounce).
3. Frontend calls `GET /tasks?q=Meeting`.
4. Backend executes `SELECT * FROM task WHERE text LIKE '%Meeting%'`.
5. Frontend updates TaskList state.
