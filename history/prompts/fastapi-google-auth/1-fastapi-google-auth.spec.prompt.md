---
id: 1
title: fastapi-google-auth
stage: spec
date: 2026-01-18
surface: CLI
model: gemini-1.5-flash
feature: 1-fastapi-google-auth
branch: 1-fastapi-google-auth
user: yuri
command: /sp.specify – TaskPilot FastAPI Google Authentication Purpose: Define the functional and technical specifications for the backend of TaskPilot with real Google authentication. 1. Authentication Specification - Type: Google OAuth 2.0 authentication - Token: Google ID Token passed from frontend in Authorization: Bearer <token> - Verification: Backend verifies token using Google public keys (google-auth library or similar) - User Info Extracted: Google user ID, name, email, profile picture - Session: Stateless – verify token on every request - Unauthorized Requests: Return HTTP 401 if token is missing or invalid - User Isolation: Only allow users to access their own tasks 2. Task API Specification Endpoint: /api/{user_id}/tasks Method: GET Request: Header – Google ID token Response: List of tasks for authenticated user Behavior: Only tasks belonging to authenticated user Endpoint: /api/{user_id}/tasks Method: POST Request: Header – Google ID token, task data Response: Created task info Behavior: Task automatically associated with authenticated user Endpoint: /api/{user_id}/tasks/{task_id} Method: GET Request: Header – Google ID token Response: Task details Behavior: Only if task belongs to authenticated user Endpoint: /api/{user_id}/tasks/{task_id} Method: PUT Request: Header – Google ID token, updated task data Response: Updated task info Behavior: Only if task belongs to authenticated user Endpoint: /api/{user_id}/tasks/{task_id} Method: DELETE Request: Header – Google ID token Response: Success/failure Behavior: Only if task belongs to authenticated user Endpoint: /api/{user_id}/tasks/{task_id}/toggle Method: PATCH Request: Header – Google ID token Response: Task completion updated Behavior: Only if task belongs to authenticated user 3. Database Specification Users Table/Model: - google_user_id (Primary Key) - name - email - profile_picture_url - created_at - updated_at Tasks Table/Model: - task_id (Primary Key) - user_id (Foreign Key → Users) - title - description - is_completed - created_at - updated_at 4. Security Specification - Token verified on every request - Only allow task operations for the authenticated user - Return 401 Unauthorized for missing/invalid tokens - Proper HTTP status codes for all errors - Stateless authentication; no server-side session storage required 5. Functional Behavior 1. User logs in on frontend → receives Google ID token 2. Frontend sends ID token to backend in Authorization header 3. Backend verifies token → extracts user info 4. If user exists in DB → fetch tasks. If new user → create user entry 5. All task CRUD operations scoped to authenticated user 6. Unauthorized access → reject with 401 6. Deliverables - FastAPI endpoints as specified - Google token verification logic - Database models for users and tasks - Clear inline comments explaining token verification and user isolation - Ready-to-run example for integration with frontend Google login
labels: [spec, backend, authentication]
links:
  spec: specs/1-fastapi-google-auth/spec.md
  ticket: 
  adr: 
  pr: 
files:
  - specs/1-fastapi-google-auth/spec.md
  - specs/1-fastapi-google-auth/checklists/requirements.md
tests:

## Prompt

/sp.specify – TaskPilot FastAPI Google Authentication Purpose: Define the functional and technical specifications for the backend of TaskPilot with real Google authentication. 1. Authentication Specification - Type: Google OAuth 2.0 authentication - Token: Google ID Token passed from frontend in Authorization: Bearer <token> - Verification: Backend verifies token using Google public keys (google-auth library or similar) - User Info Extracted: Google user ID, name, email, profile picture - Session: Stateless – verify token on every request - Unauthorized Requests: Return HTTP 401 if token is missing or invalid - User Isolation: Only allow users to access their own tasks 2. Task API Specification Endpoint: /api/{user_id}/tasks Method: GET Request: Header – Google ID token Response: List of tasks for authenticated user Behavior: Only tasks belonging to authenticated user Endpoint: /api/{user_id}/tasks Method: POST Request: Header – Google ID token, task data Response: Created task info Behavior: Task automatically associated with authenticated user Endpoint: /api/{user_id}/tasks/{task_id} Method: GET Request: Header – Google ID token Response: Task details Behavior: Only if task belongs to authenticated user Endpoint: /api/{user_id}/tasks/{task_id} Method: PUT Request: Header – Google ID token, updated task data Response: Updated task info Behavior: Only if task belongs to authenticated user Endpoint: /api/{user_id}/tasks/{task_id} Method: DELETE Request: Header – Google ID token Response: Success/failure Behavior: Only if task belongs to authenticated user Endpoint: /api/{user_id}/tasks/{task_id}/toggle Method: PATCH Request: Header – Google ID token Response: Task completion updated Behavior: Only if task belongs to authenticated user 3. Database Specification Users Table/Model: - google_user_id (Primary Key) - name - email - profile_picture_url - created_at - updated_at Tasks Table/Model: - task_id (Primary Key) - user_id (Foreign Key → Users) - title - description - is_completed - created_at - updated_at 4. Security Specification - Token verified on every request - Only allow task operations for the authenticated user - Return 401 Unauthorized for missing/invalid tokens - Proper HTTP status codes for all errors - Stateless authentication; no server-side session storage required 5. Functional Behavior 1. User logs in on frontend → receives Google ID token 2. Frontend sends ID token to backend in Authorization header 3. Backend verifies token → extracts user info 4. If user exists in DB → fetch tasks. If new user → create user entry 5. All task CRUD operations scoped to authenticated user 6. Unauthorized access → reject with 401 6. Deliverables - FastAPI endpoints as specified - Google token verification logic - Database models for users and tasks - Clear inline comments explaining token verification and user isolation - Ready-to-run example for integration with frontend Google login

## Response snapshot

Created spec file for feature `1-fastapi-google-auth` at `specs/1-fastapi-google-auth/spec.md`.
Created checklist file `specs/1-fastapi-google-auth/checklists/requirements.md`.
Generated PHR file `history/prompts/fastapi-google-auth/1-fastapi-google-auth.spec.prompt.md`.
Checked out new branch `1-fastapi-google-auth`.

## Outcome

- ✅ Impact: Created new feature branch, spec file, and checklist for FastAPI Google Authentication.
- 🧪 Tests: No tests were created.
- 📁 Files: 
  - specs/1-fastapi-google-auth/spec.md
  - specs/1-fastapi-google-auth/checklists/requirements.md
  - history/prompts/fastapi-google-auth/1-fastapi-google-auth.spec.prompt.md
- 🔁 Next prompts: Create a plan for the spec.
- 🧠 Reflection: The detailed user input allowed for a comprehensive spec without needing clarifications. The branch name and number were automatically derived.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): 
- Prompt variant (if applicable): 
- Next experiment (smallest change to try): 
