# Feature Specification: TaskPilot Frontend

**Feature Branch**: `feature/homepage-ui`
**Created**: 2026-01-11
**Last Amended**: 2026-01-18
**Status**: Draft
**Input**: User description: "/sp.specify TaskPilot Frontend Specification, integrating with authenticated backend"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Google Authentication (Priority: P1)
As a user, I want to securely log in to TaskPilot using my Google account, so that I can access my personalized tasks.

**Why this priority**: Google authentication is now a core requirement for user access and data security.

**Independent Test**: A user can click a "Sign in with Google" button, complete the Google OAuth flow, and be redirected to their authenticated dashboard.

**Acceptance Scenarios**:
1. **Given** I am on the TaskPilot homepage, **When** I click "Login" or "Get Started" and choose to "Sign in with Google", **Then** I am redirected to the Google login page.
2. **Given** I successfully authenticate with Google, **When** I am redirected back to TaskPilot, **Then** I am logged in and presented with my personal dashboard.
3. **Given** I am logged in, **When** I refresh the page, **Then** I remain authenticated.

---

### User Story 2 - View and Manage Authenticated Tasks (Priority: P1)
As an authenticated user, I want to see my existing tasks and interact with them by marking them complete, editing, or deleting them, so that I can manage my personal to-do list securely.

**Why this priority**: This is the core functionality of a to-do application, now with an explicit authentication context.

**Independent Test**: An authenticated user can view their list of tasks, toggle the completion status of *their own* task, edit *their own* task's text, and delete *their own* task. Attempts to access/modify other users' tasks MUST fail.

**Acceptance Scenarios**:
1. **Given** I am an authenticated user with a list of tasks, **When** I access my dashboard, **Then** I see a vertically stacked list of *my* tasks in the central container.
2. **Given** I am an authenticated user and *my* task is in an incomplete state, **When** I click the toggle control, **Then** *my* task is visually marked as complete (e.g., with a strikethrough and dimmed text) and the toggle state changes.
3. **Given** I am an authenticated user and *my* task is in a complete state, **When** I click the toggle control, **Then** *my* task returns to its incomplete visual state.
4. **Given** I am an authenticated user and I see *my* task, **When** I click the 'edit' icon, **Then** I can modify *my* task's text and save the changes.
5. **Given** I am an authenticated user and I see *my* task, **When** I click the 'delete' icon, **Then** *my* task is immediately removed from the list.
6. **Given** I am an authenticated user, **When** I attempt to access a task belonging to another user, **Then** I receive an appropriate unauthorized/forbidden error.

---

### User Story 3 - Add a New Authenticated Task (Priority: P1)
As an authenticated user, I want to easily add a new task to *my* list so that I can capture new to-do items as they come up, associated with my account.

**Why this priority**: Adding tasks is a fundamental authenticated action.

**Independent Test**: An authenticated user can click a prominent 'add' button, enter text into an input field, and press Enter to add a new task. The new task immediately appears in *their* task list and is correctly associated with *their* user ID in the backend.

**Acceptance Scenarios**:
1. **Given** I am an authenticated user on the main task view, **When** I click the plus (+) button, **Then** an input field appears for me to enter a new task.
2. **Given** I am an authenticated user and have entered text into the new task input, **When** I press the 'Enter' key, **Then** the new task appears in *my* task list.
3. **Given** I am an authenticated user with a list of zero tasks, **When** I open the application, **Then** I see an empty state message "Add a new task" and a prominent plus (+) icon.

---

### User Story 4 - Use the Focus Timer (Priority: P2)
As an authenticated user, I want to use a focus timer so that I can work on my tasks in timed, focused sessions. (Note: Timer state does not need to persist for this phase).

**Why this priority**: This feature adds significant value beyond a basic to-do list and is a key differentiator.

**Independent Test**: An authenticated user can see the timer, adjust its duration, start the countdown, and stop/reset it.

**Acceptance Scenarios**:
1. **Given** I am an authenticated user and the timer is at its default value (20:00), **When** I click the 'Start Timer' button, **Then** the timer begins to count down second-by-second.
2. **Given** I am an authenticated user and the timer is running, **When** I click the 'End Timer' button, **Then** the timer stops and resets to its default value.
3. **Given** I am an authenticated user and the timer has not been started, **When** I click the plus (+) or minus (-) buttons, **Then** the timer's duration increases or decreases accordingly.

### Edge Cases
- **Task Text**: What happens if a user enters a very long task name? The UI must handle text overflow gracefully (e.g., with truncation and a tooltip).
- **Task List**: How does the application behave with a very large number of tasks? The container must scroll vertically without breaking the layout.
- **Authentication Failure**: If Google authentication fails or the ID token is invalid, the user MUST be shown an informative error message.
- **Expired Session**: If the user's session expires, API requests MUST result in re-authentication prompt or automatic redirection to login.

## Functional Requirements
- **FR-001**: The system MUST allow users to authenticate securely using their Google account via the frontend.
- **FR-002**: Upon successful Google authentication, the frontend MUST send the Google ID token to the backend for verification.
- **FR-003**: The system MUST display all of an *authenticated user's* tasks in a central, scrollable container.
- **FR-004**: The system MUST provide controls for each of an *authenticated user's* tasks to toggle completion, edit text, and delete the task.
- **FR-005**: The system MUST provide a mechanism to add a new task, which appears instantly in the list and is associated with the *authenticated user*.
- **FR-006**: The system MUST display an empty state view when no tasks are present for the authenticated user.
- **FR-007**: The system MUST provide a fully functional focus timer with start, stop, and time adjustment controls for an *authenticated user*.
- **FR-008**: The entire UI MUST be responsive and functional across mobile, tablet, and desktop screen sizes.
- **FR-009**: The system MUST communicate with the new authenticated FastAPI backend for all user and task related operations.
- **FR-010**: All UI controls MUST be functional ("no fake UI").
- **FR-011**: The system MUST create and use a `frontend/history` directory to store deprecated frontend artifacts.

## Success Criteria *(mandatory)*

### Measurable Outcomes
- **SC-001**: A new user can successfully register and log in using Google authentication.
- **SC-002**: 100% of authenticated user's task CRUD functionality is present and functional in the UI.
- **SC-003**: The application layout MUST NOT break or exhibit horizontal scrolling on screen widths from 320px to 1920px.
- **SC-004**: All interactive elements (buttons, toggles, inputs) MUST provide visual feedback on hover and click within 100ms.
- **SC-005**: A new authenticated user can understand and perform all primary tasks (add, edit, delete, complete, start timer) without instruction.
- **SC-006**: The focus timer's countdown is accurate to within one second per minute.
