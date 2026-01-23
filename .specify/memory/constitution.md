<!-- 
Sync Impact Report
Version change: 3.0.0 → 4.0.0
Reason: Major revision for implementing real Google authentication and backend requirements for TaskPilot.
Modified principles: All previous frontend-focused principles replaced with new backend authentication and task management principles.
Added sections: 
- Primary Goal (updated for backend authentication)
- Google Authentication Principle
- Authenticated Task Endpoints Principle
- Security & Best Practices Principle
- Data Models Principle
- Deliverables Principle
Removed sections: All previous principles related to chatbot frontend UI.
Templates requiring updates:
- ✅ .specify/templates/plan-template.md (will be updated as part of consistency propagation)
- ✅ .specify/templates/spec-template.md (will be updated as part of consistency propagation)
- ✅ .specify/templates/tasks-template.md (will be updated as part of consistency propagation)
- ✅ README.md (will be updated as part of consistency propagation)
-->
# TaskPilot: Project Constitution

**Version**: 4.0.0 | **Ratified**: 2026-01-02 | **Last Amended**: 2026-01-18

## 1. Project Overview
This constitution governs the development of the TaskPilot application, focusing on the implementation of real Google authentication and the secure management of user tasks via a FastAPI backend.

### Primary Goal
To implement real Google authentication in the backend, verify Google ID tokens, manage users, and allow only authenticated users to access and modify their tasks.

## 2. Core Principles

### Principle 1: Google Authentication
**Rule:** Users MUST be able to log in via Google on the frontend. The frontend MUST send the Google ID token to the backend in the `Authorization: Bearer <token>` header. The backend MUST verify the token signature using Google's public keys and decode it to extract user information (Google user ID, name, email, profile picture). A new user MUST be created in the database if it is the first login.

### Principle 2: Authenticated Task Endpoints
**Rule:** All task endpoints (`GET /api/{user_id}/tasks`, `POST /api/{user_id}/tasks`, `GET /api/{user_id}/tasks/{task_id}`, `PUT /api/{user_id}/tasks/{task_id}`, `DELETE /api/{user_id}/tasks/{task_id}`, `PATCH /api/{user_id}/tasks/{task_id}/toggle`) MUST only return tasks for the authenticated user and MUST verify ownership before allowing access or modification.

### Principle 3: Security & Best Practices
**Rule:** Requests without a valid Google ID token MUST return `401 Unauthorized`. Users CANNOT access or modify tasks of other users. Secure database storage MUST be used for user info and tasks. Stateless authentication MUST be implemented by verifying the Google token on each request. Proper HTTP status codes for errors (401, 403, 404, 500) MUST be used.

### Principle 4: Data Models
**Rule:** The `Users` table/model MUST store Google user ID, name, email, profile picture, and timestamps. The `Tasks` table/model MUST store task details with a reference to the user ID. All queries MUST filter by authenticated user ID.

### Principle 5: Deliverables
**Rule:** Deliverables MUST include FastAPI backend code for all task endpoints, Google token verification logic using Python libraries (e.g., `google-auth` or `Authlib`), database models for users and tasks, comments explaining authentication flow and security measures, and instructions for integrating frontend Google login with backend verification.

## 3. Tech Stack (Fixed)
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **API:** The existing Gemini API endpoint must be used.

## 4. Restrictions
- Do NOT implement any Gemini or AI logic on the frontend.
- Do NOT change the existing API contracts.
- Do NOT create any unused components or files.

## 5. Success Criteria
- The chatbot window opens and closes smoothly via the floating button.
- User and bot messages render correctly in their distinct bubbles.
- A visible loading state is displayed while waiting for the bot's response.
- The UI is fully responsive and usable on mobile, tablet, and desktop.
- The final component feels premium, modern, and polished.

## 6. Governance
- **Amendment Procedure:** Amendments to this constitution require a new specification and approval.
- **Versioning Policy:** The constitution follows semantic versioning. MAJOR changes are required for backward-incompatible governance or principle removals, MINOR for new principles or material expansions, and PATCH for clarifications or typo fixes.
- **Compliance Review:** All specifications and implementations must be reviewed for compliance with this constitution.