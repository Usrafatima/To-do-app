<!-- 
Sync Impact Report
Version change: 1.0.0 → 2.0.0
Reason: Complete rewrite of the constitution. Changed from a principles-based document for a CLI application to a full-stack project design document for Phase 2.
Modified principles: All principles from v1.0.0 have been removed and replaced with new specification sections.
Added sections: Project Overview, Problem Statement, Solution Overview, Target Users, Core Features, Technology Stack Explanation, System Architecture, Frontend Specification, Authentication Specification, Data Management Specification, RESTful API Specification, Future Scope.
Removed sections: All previous principle sections (I-X).
Templates requiring updates:
- ⚠ .specify/templates/plan-template.md - Requires review to align with the new design-document structure.
- ⚠ .specify/templates/spec-template.md - Requires review to align with new architectural sections.
- ⚠ .specify/templates/tasks-template.md - Requires review as task categories may change based on the new architecture (e.g., `frontend`, `backend`, `api`, `db`).
-->
This document serves as the single source of truth for the
design and implementation of the Hackathon 2 – Phase 2 project.

# Hackathon 2 - Phase 2: Project Constitution

**Version**: 2.0.0 | **Ratified**: 2026-01-02 | **Last Amended**: 2026-01-09

## 1. Project Overview
This project is a full-stack Todo Application. Phase 1 was completed as a simple, in-memory console application. This document outlines Phase 2, which involves transforming the application into a robust, multi-user web application with a persistent database, a RESTful API backend, and a modern frontend interface. The purpose of this phase is to demonstrate proficiency in full-stack development using a specified, modern technology stack.

## 2. Problem Statement
Simple, single-user todo applications fail to address the collaborative and accessibility needs of modern users. They lack data persistence, security, and the ability to access tasks from multiple devices. This project addresses the need for a secure, multi-user, web-based task management solution where users can safely manage their own tasks without interference from others.

## 3. Solution Overview
The solution is a decoupled, three-tier application:
- **Frontend:** A responsive Next.js web application provides the user interface. It communicates with the backend via RESTful API calls and manages user authentication state using JWTs.
- **Backend:** A Python FastAPI application serves as the API backend. It handles business logic, user authentication, and data manipulation, interacting with the database via an ORM.
- **Database:** A Neon Serverless PostgreSQL database provides persistent, scalable, and secure data storage for user accounts and their associated tasks.
- **Authentication:** Better Auth is used to handle user sign-up and sign-in, issuing JWTs that are used to secure API endpoints and ensure data isolation between users.

## 4. Target Users
The target users are individuals seeking a personal task management tool that is accessible from any web browser. They expect a clean, intuitive, and fast interface to create, manage, and track their personal to-do items securely.

## 5. Core Features (Basic Level)
- **User Authentication:** Users can sign up for a new account and sign in to an existing account.
- **User-specific Task Isolation:** A user can only view, create, update, or delete their own tasks.
- **Task Creation:** An authenticated user can create a new task with a title and optional due date.
- **Task Viewing:** An authenticated user can view a list of all their tasks.
- **Task Updating:** An authenticated user can edit the content and due date of an existing task.
- **Task Deletion:** An authenticated user can delete a task.
- **Task Completion Toggle:** An authenticated user can mark a task as complete or incomplete. The visual state of the task will reflect this change.

## 6. Technology Stack Explanation
- **Frontend (Next.js):** Chosen for its powerful App Router, server-side rendering capabilities for fast initial loads, and rich ecosystem. It enables the creation of a modern, high-performance, and responsive user interface.
- **Backend (Python FastAPI):** Chosen for its high performance, ease of use, and automatic interactive API documentation. Its asynchronous nature is well-suited for I/O-bound operations like database and API calls.
- **ORM (SQLModel):** Built on Pydantic and SQLAlchemy, it provides a simple and intuitive way to define data models with Python type hints, reducing boilerplate and ensuring data validation.
- **Database (Neon Serverless PostgreSQL):** Chosen for its serverless architecture, which offers scalability, cost-efficiency, and ease of management. It provides a robust, reliable, and fully-managed PostgreSQL database.
- **Authentication (Better Auth):** A JWT-based solution chosen for its simplicity and robust security features, enabling stateless and secure communication between the frontend and backend.

## 7. System Architecture (High-Level)
- **Frontend Responsibilities:** Render the UI, manage client-side state, handle user input, and make authenticated API requests to the backend. Store JWT securely in the client.
- **Backend Responsibilities:** Expose RESTful API endpoints, validate incoming data, handle user authentication and authorization by validating JWTs, execute business logic, and perform CRUD operations on the database.
- **Database Responsibilities:** Store user accounts and task data. Enforce data integrity through schema definitions and relationships (e.g., a one-to-many relationship between users and tasks).
- **Authentication Flow:**
    1. User signs up or signs in via the frontend.
    2. Frontend sends credentials to the backend's `/auth` endpoint.
    3. Backend uses Better Auth to verify credentials and generates a JWT.
    4. Backend sends the JWT back to the frontend.
    5. Frontend stores the JWT and includes it in the `Authorization` header for all subsequent API requests.
    6. Backend protects endpoints by requiring a valid JWT, which it decodes to identify the user for each request, ensuring they can only access their own data.

## 8. Frontend Specification (UI / UX)
This section details the structure and behavior of the user interface. The design philosophy is modern, clean, cool, and professional, aiming for a premium, sponsor-worthy feel.

### Overall Design Philosophy
- **Modern & Clean:** Minimalist aesthetic, generous use of whitespace, and clear typography.
- **Dashboard-Style:** A persistent navigation element with a main content area for focused work.
- **Intuitive:** User flows should be simple and predictable. Actions should have clear and immediate feedback.

### Layout Structure
- **Desktop:** A fixed left sidebar for navigation and a main content area for displaying task lists and forms.
- **Mobile:** A top header with a hamburger menu that reveals a navigation drawer, with a single-column layout for content. A Floating Action Button (FAB) is used for the primary "Create Task" action.

### Navigation System
- **Desktop:** Navigation links (Dashboard, Filters) are always visible in the sidebar. Logout is accessible from a user profile dropdown in the header.
- **Mobile:** Navigation links are housed in a slide-out drawer, accessible via the hamburger icon.

### Responsive Behavior
- The layout fluidly transitions from the sidebar-based desktop view to the single-column mobile view.
- Modals on desktop become full-screen views on mobile for better usability.
- Hover-based interactions on desktop are replaced with tap-friendly, always-visible controls on mobile.

### Screens
- **Login/Signup:** Centered forms focused on a single task. Clean inputs, a clear primary action button, and a link to switch between the two forms. Error states are displayed inline.
- **Dashboard:** The main view. Displays the title of the current view (e.g., "All Tasks") and the list of tasks.
- **Task List:** A collection of individual task items.
    - **Task Item:** Each task is a card-like element with a checkbox, the task title, and any metadata like a due date. Completed tasks are visually distinct (e.g., dimmed with a strikethrough). Edit and delete actions are available on each item.
- **Create/Edit Task:** Handled within a modal (desktop) or full-screen view (mobile). Contains a text input for the task name, a date picker for the due date, and "Save" and "Cancel" actions.
- **Empty States:** When a task list is empty, a helpful message and a clear "Create Task" button are displayed instead of a blank space.
- **Error States:** If data fails to load, an error message with a "Retry" option is shown.

### Sidebar Details
- **Navigation Items:**
    - Dashboard (All Tasks)
    - Today
    - Upcoming
- **Task Filters:** The navigation items also act as filters for the task list.
- **Logout:** A logout button is located within the user profile menu, accessed from the main header area.

### Visual Hierarchy
- Clear headings establish the context of each screen.
- Primary Call-to-Action (CTA) buttons are visually prominent.
- The visual difference between pending and completed tasks is immediate and obvious.

### UX Polish
- Smooth transitions between views and when modals appear.
- Subtle animations on actions like adding or completing a task provide positive feedback.
- Loading indicators are shown during data fetching to manage user expectations.

## 9. Authentication Specification
- **Frontend Usage:** The frontend will use a library like `axios` to manage API calls. An interceptor will be configured to automatically attach the stored JWT to the `Authorization: Bearer <token>` header of every request to a protected endpoint.
- **JWT Handling:** Upon successful login, the JWT received from the backend is stored securely in the client (e.g., in an HttpOnly cookie or secure local storage). Upon logout, this token is cleared.
- **Backend Verification:** All backend endpoints (except for login/signup) are protected. They will have a dependency that inspects the incoming request for a valid JWT. If the token is missing, invalid, or expired, the API will return a `401 Unauthorized` status.
- **User Isolation:** The JWT payload contains the `user_id`. When the backend decodes a valid token, it extracts the `user_id` and uses it in all database queries (e.g., `SELECT * FROM tasks WHERE owner_id = :user_id`). This ensures a user can never access another user's data.

## 10. Data Management Specification
- **Conceptual Database Schema:**
    - `users` table:
        - `id` (Primary Key)
        - `email` (Unique)
        - `hashed_password`
        - `full_name`
    - `tasks` table:
        - `id` (Primary Key)
        - `title` (Text)
        - `is_completed` (Boolean, default: false)
        - `due_date` (Timestamp, nullable)
        - `owner_id` (Foreign Key to `users.id`)
- **User-Task Relationship:** A one-to-many relationship exists between `users` and `tasks`. One user can have many tasks, but each task belongs to exactly one user.
- **Data Ownership:** The `owner_id` on the `tasks` table is non-negotiable and enforces data ownership at the database level.
- **Why Neon Serverless PostgreSQL:** It provides the robustness of PostgreSQL with the benefits of serverless, including auto-scaling, pausing when not in use (cost-saving), and simplified database management, which is ideal for a hackathon project.

## 11. RESTful API Specification (Conceptual)
All endpoints under `/api/tasks` require authentication.

- **Authentication:**
    - `POST /api/auth/signup`: Creates a new user.
    - `POST /api/auth/login`: Authenticates a user and returns a JWT.
- **Tasks:**
    - `GET /api/tasks`: Get all tasks for the authenticated user.
    - `POST /api/tasks`: Create a new task for the authenticated user.
    - `GET /api/tasks/{task_id}`: Get a single task by ID.
    - `PUT /api/tasks/{task_id}`: Update a task's title or due date.
    - `PATCH /api/tasks/{task_id}`: Partially update a task (e.g., toggle completion status).
    - `DELETE /api/tasks/{task_id}`: Delete a task.

## 12. Future Scope
- **Advanced Task Features:** Add support for task descriptions (longer text), priorities, and subtasks.
- **Projects/Lists:** Allow users to group tasks into different projects or lists.
- **Collaboration:** Enable sharing of task lists between users.
- **Real-time Updates:** Implement WebSockets for real-time updates across multiple clients.
- **Profile Management:** A dedicated screen for users to update their name and password.
