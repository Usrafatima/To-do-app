---
id: 1
title: fastapi-google-auth-plan
stage: plan
date: 2026-01-18
surface: CLI
model: gemini-1.5-flash
feature: 1-fastapi-google-auth
branch: 1-fastapi-google-auth
user: yuri
command: /sp.plan /sp.plan – TaskPilot FastAPI Backend with Google Authentication
labels: [plan, backend, authentication]
links:
  spec: specs/1-fastapi-google-auth/spec.md
  ticket: 
  adr: 
  pr: 
  plan: specs/1-fastapi-google-auth/plan.md
files:
  - specs/1-fastapi-google-auth/plan.md
  - specs/1-fastapi-google-auth/data-model.md
  - specs/1-fastapi-google-auth/contracts/api.yaml
tests:

## Prompt

/sp.plan /sp.plan – TaskPilot FastAPI Backend with Google Authentication

Goal:
Build a secure, scalable FastAPI backend for TaskPilot that uses real
Google authentication and enforces strict task ownership for every API request.

Phase 1: Foundation Setup
- Create FastAPI project structure
- Set up virtual environment
- Install and configure dependencies
- Configure environment variables using .env file
- Initialize database connection and ORM setup

Phase 2: Authentication Layer
- Design authentication dependency for FastAPI
- Extract Google ID token from Authorization header
- Verify token using Google OAuth public keys
- Decode and validate token claims
- Handle authentication failures with proper HTTP responses

Phase 3: User Lifecycle Management
- Define User database schema
- Implement logic to:
  - Check if authenticated user exists
  - Create user on first login
  - Update user metadata if needed
- Ensure user uniqueness using Google user ID

Phase 4: Task Data Modeling
- Define Task database schema
- Establish relationship between users and tasks
- Apply constraints to enforce ownership at database level

Phase 5: Task API Implementation
- Implement task CRUD endpoints:
  - List tasks
  - Create task
  - Get task details
  - Update task
  - Delete task
  - Toggle task completion
- Secure all endpoints with authentication dependency
- Validate that URL user_id matches authenticated user

Phase 6: Authorization and Data Isolation
- Enforce user-level access control on every query
- Filter all database queries by authenticated user ID
- Reject unauthorized access attempts
- Prevent cross-user data exposure

Phase 7: Error Handling and Validation
- Add Pydantic schemas for request and response validation
- Implement consistent error responses
- Handle edge cases such as:
  - Invalid tokens
  - Missing authorization headers
  - Nonexistent tasks
  - Unauthorized task access

Phase 8: Security Hardening
- Ensure stateless authentication
- Avoid storing tokens server-side
- Validate token expiry and issuer
- Return appropriate HTTP status codes (401, 403, 404)

Phase 9: Testing and Verification
- Test authentication flow with valid and invalid Google tokens
- Test all task endpoints with authenticated users
- Verify task isolation across different users
- Validate API behavior without authorization

Phase 10: Integration Readiness
- Document Authorization header format
- Provide example API requests
- Ensure backend is ready to connect with frontend
- Keep code clean, readable, and well-commented

## Response snapshot

I have created the plan file `specs/1-fastapi-google-auth/plan.md`.

Now, I will update the todo list.

## Outcome

- ✅ Impact: Created detailed implementation plan, data model, and API contract for FastAPI Google Authentication.
- 🧪 Tests: No tests were created during this planning phase.
- 📁 Files: 
  - specs/1-fastapi-google-auth/plan.md
  - specs/1-fastapi-google-auth/data-model.md
  - specs/1-fastapi-google-auth/contracts/api.yaml
- 🔁 Next prompts: Create tasks for implementation based on the new plan.
- 🧠 Reflection: The plan is comprehensive and addresses all aspects of the spec. PowerShell script for updating agent context failed but was deemed not critical as GEMINI.md was already updated with the broader tech stack.

## Evaluation notes (flywheel)

- Failure modes observed: `pwsh` not found for updating agent context.
- Graders run and results (PASS/FAIL): 
- Prompt variant (if applicable): 
- Next experiment (smallest change to try): 
