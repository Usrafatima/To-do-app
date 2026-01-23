# Phase 4 Specification: Advanced Features & Dockerization

## 1. Overview
Phase 4 transforms the Todo application into a professional-grade productivity tool by adding advanced task management features, improving search/filter capabilities, and introducing a robust containerization strategy for local development and future cloud deployment.

## 2. User Stories
- **US.1: Task Organization:** As a user, I want to assign priorities (High, Medium, Low) and tags to my tasks so I can categorize them effectively.
- **US.2: Enhanced Search:** As a user, I want to search for tasks by text content so I can find specific items quickly.
- **US.3: Filtering & Sorting:** As a user, I want to filter tasks by priority or status and sort them by due date so I can view my workload clearly.
- **US.4: Deadline Notifications:** As a user, I want to see alerts for tasks that are approaching their due date.
- **US.5: Dockerized Development:** As a developer, I want to run the entire stack (Frontend, Backend, DB) using a single command to ensure environment parity.

## 3. Functional Requirements
- **FR.1: Priority Management:** Support for `Low`, `Medium`, `High`, `Critical` levels.
- **FR.2: Tagging System:** Multi-tag support per task stored as a JSON array.
- **FR.3: Server-side Search/Filter:** API must support query parameters for filtering and full-text search.
- **FR.4: Health Check API:** `/healthz` endpoint for monitoring service status.
- **FR.5: Docker Multi-stage Builds:** Optimized Dockerfiles for both Frontend (Next.js) and Backend (FastAPI).

## 4. Acceptance Criteria
- Tasks can be filtered by priority in the UI.
- Searching for a keyword in the search bar returns matching tasks from the database.
- A background process logs a "Notification" when a task is due within 15 minutes.
- `docker-compose up` starts both services and they can communicate with each other.
