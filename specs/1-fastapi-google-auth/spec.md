# Feature Specification: TaskPilot FastAPI Google Authentication

**Feature Branch**: `1-fastapi-google-auth`  
**Created**: 2026-01-18  
**Status**: Draft  
**Input**: User description: "/sp.specify – TaskPilot FastAPI Google Authentication Purpose: Define the functional and technical specifications for the backend of TaskPilot with real Google authentication. 1. Authentication Specification - Type: Google OAuth 2.0 authentication - Token: Google ID Token passed from frontend in Authorization: Bearer <token> - Verification: Backend verifies token using Google public keys (google-auth library or similar) - User Info Extracted: Google user ID, name, email, profile picture - Session: Stateless – verify token on every request - Unauthorized Requests: Return HTTP 401 if token is missing or invalid - User Isolation: Only allow users to access their own tasks

2. Task API Specification
Endpoint: /api/tasks
Method: GET
Request: (No authentication)
Response: List of all tasks from all users
Behavior: Publicly accessible endpoint.

Endpoint: /api/tasks
Method: POST
Request: Task data
Response: Created task info
Behavior: Publicly accessible endpoint.

Endpoint: /api/tasks/{task_id}
Method: GET
Request: (No authentication)
Response: Task details
Behavior: Publicly accessible endpoint.

Endpoint: /api/tasks/{task_id}
Method: PUT
Request: Updated task data
Response: Updated task info
Behavior: Publicly accessible endpoint.

Endpoint: /api/tasks/{task_id}
Method: DELETE
Request: (No authentication)
Response: Success/failure
Behavior: Publicly accessible endpoint.

Endpoint: /api/tasks/{task_id}/toggle
Method: PATCH
Request: (No authentication)
Response: Task completion updated
Behavior: Publicly accessible endpoint. 3. Database Specification Users Table/Model: - google_user_id (Primary Key) - name - email - profile_picture_url - created_at - updated_at Tasks Table/Model: - task_id (Primary Key) - user_id (Foreign Key → Users) - title - description - is_completed - created_at - updated_at 4. Security Specification - Token verified on every request - Only allow task operations for the authenticated user - Return 401 Unauthorized for missing/invalid tokens - Proper HTTP status codes for all errors - Stateless authentication; no server-side session storage required 5. Functional Behavior 1. User logs in on frontend → receives Google ID token 2. Frontend sends ID token to backend in Authorization header 3. Backend verifies token → extracts user info 4. If user exists in DB → fetch tasks. If new user → create user entry 5. All task CRUD operations scoped to authenticated user 6. Unauthorized access → reject with 401 6. Deliverables - FastAPI endpoints as specified - Google token verification logic - Database models for users and tasks - Clear inline comments explaining token verification and user isolation - Ready-to-run example for integration with frontend Google login"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Public Task Management (Priority: P1)

As any user (anonymous or authenticated), I want to be able to create, view, update, and delete tasks, so that I can manage a to-do list without needing to log in.

**Why this priority**: This is the core functionality of the application and is publicly accessible.

**Independent Test**: A user can perform all CRUD operations on tasks without providing any authentication.

**Acceptance Scenarios**:

1. **Given** I am any user, **When** I send a `GET /api/tasks` request, **Then** I receive a list of all tasks.
2. **Given** I am any user, **When** I send a `POST /api/tasks` request with task data, **Then** a new task is created.
3. **Given** a task exists, **When** I send a `PUT /api/tasks/{task_id}` request with updated data, **Then** the task is updated.
4. **Given** a task exists, **When** I send a `DELETE /api/tasks/{task_id}` request, **Then** the task is deleted.

---

### User Story 2 - Authenticated Chatbot Access (Priority: P1)

As a user, I want to log in with my Google account to access the AI chatbot, so that I can use its advanced features.

**Why this priority**: This is the primary feature that requires authentication.

**Independent Test**: A user can log in with Google and receive a JWT. This JWT can then be used to access the chatbot endpoint.

**Acceptance Scenarios**:

1. **Given** I am a user, **When** I log in with Google, **Then** I receive an internal JWT.
2. **Given** I have a valid JWT, **When** I send a request to the chatbot endpoint with the token, **Then** I receive a valid response.
3. **Given** I do not have a valid JWT, **When** I send a request to the chatbot endpoint, **Then** I receive a `401 Unauthorized` error.

As an authenticated user, I want to create, view, update, and delete my tasks securely, ensuring that only I can access and modify my own tasks.

**Why this priority**: Core task functionality, now enforced with authentication and authorization.

**Independent Test**: An authenticated user can perform all CRUD operations (Create, Read, Update, Delete) on tasks. Each operation confirms ownership. Attempts to modify/access other users' tasks fail with appropriate authorization errors.

**Acceptance Scenarios**:

1. **Given** I am an authenticated user, **When** I send a `POST /api/{user_id}/tasks` request with task data and my Google ID token, **Then** a new task is created and associated with my `user_id`.
2. **Given** I am an authenticated user, **When** I send a `GET /api/{user_id}/tasks` request with my Google ID token, **Then** I receive a list of only the tasks associated with my `user_id`.
3. **Given** I am an authenticated user, **When** I send a `GET /api/{user_id}/tasks/{task_id}` request for a task I own, **Then** I receive the details of that specific task.
4. **Given** I am an authenticated user, **When** I send a `PUT /api/{user_id}/tasks/{task_id}` request with updated data for a task I own, **Then** the task is updated successfully.
5. **Given** I am an authenticated user, **When** I send a `DELETE /api/{user_id}/tasks/{task_id}` request for a task I own, **Then** the task is successfully deleted.
6. **Given** I am an authenticated user, **When** I send a `PATCH /api/{user_id}/tasks/{task_id}/toggle` request for a task I own, **Then** the task's completion status is toggled.
7. **Given** I am an authenticated user, **When** I attempt any task operation (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`) on a `task_id` that does not belong to me, **Then** the backend returns a `403 Forbidden` or `404 Not Found` status.
8. **Given** I am not authenticated or have an invalid token, **When** I attempt any task operation, **Then** the backend returns a `401 Unauthorized` status.

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

- What happens if Google's token verification service is unreachable? (Backend should handle gracefully, e.g., temporary error, retry mechanism).
- How is user data (name, email, profile picture) handled if Google changes its API or the user updates their Google profile? (Backend should resync or handle updates on subsequent logins).
- What if a user de-authorizes TaskPilot from their Google account? (Backend should handle session invalidation appropriately).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The backend MUST expose an endpoint (`/auth/google` or similar) to receive Google ID tokens from the frontend.
- **FR-002**: The backend MUST verify the authenticity and validity of incoming Google ID tokens.
- **FR-003**: The backend MUST issue an internal JWT to the frontend upon successful Google authentication.
- **FR-004**: The backend MUST provide public, unauthenticated endpoints for all CRUD operations on tasks (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`).
- **FR-005**: Access to the AI Chatbot functionality MUST require a valid authentication token (internal JWT).
- **FR-006**: The backend MUST return a `401 Unauthorized` status for requests to the chatbot endpoint with missing or invalid authentication tokens.
- **FR-007**: The backend MUST use a stateless authentication mechanism.

### Key Entities *(if data involved)*

- **Users**: Represents a user account. Key attributes: `google_user_id` (Primary Key), `name`, `email`, `profile_picture_url`, `created_at`, `updated_at`.
- **Tasks**: Represents a to-do item. Key attributes: `task_id` (Primary Key), `user_id` (Foreign Key → Users), `title`, `description`, `is_completed`, `created_at`, `updated_at`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Google login from the frontend successfully authenticates with the backend and returns an internal JWT within 3 seconds.
- **SC-002**: A new user can create an account and log in via Google.
- **SC-003**: Authenticated users can perform all task CRUD operations (Create, Read, Update, Delete) on their own tasks with a response time under 500ms for each operation.
- **SC-004**: Attempts by an authenticated user to access or modify another user's tasks are consistently rejected with appropriate HTTP status codes (403 or 404).
- **SC-005**: Unauthenticated requests to protected endpoints are consistently rejected with a `401 Unauthorized` status.
- **SC-006**: User information from Google (name, email, profile picture) is correctly stored and updated in the backend database upon login.
