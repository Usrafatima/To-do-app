# Tasks: TaskPilot Frontend

**Input**: Design documents from `specs/2-phase-2-frontend/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api.md

## Phase 1: Setup (Shared Infrastructure)
**Purpose**: Project initialization and basic structure.

- [X] T001 Initialize Next.js project in `frontend/`
- [X] T002 Create directory structure per `plan.md` in `frontend/src/` (app, components, styles, lib)
- [X] T003 Create `frontend/history/` directory for deprecated artifacts.

---

## Phase 2: Foundational (Blocking Prerequisites)
**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

- [X] T004 Configure global styles in `frontend/src/styles/globals.css`
- [X] T005 Create root layout in `frontend/src/app/layout.tsx`
- [X] T006 Implement the main app shell (Header, Content Area) in `frontend/src/app/page.tsx`
- [ ] T007 [P] Update `frontend/src/lib/apiClient.ts` to interact with the **real authenticated backend** endpoints (not mock). This includes sending Google ID tokens and managing JWTs.

---

## Phase 3: Google Authentication (Frontend)
**Goal**: Enable users to log in securely with Google.
**Independent Test**: User can successfully sign in with Google and access their dashboard.

### Implementation for Google Authentication
- [ ] T008 [US1] Create a "Sign in with Google" button component in `frontend/src/components/auth/GoogleSignInButton.tsx`.
- [ ] T009 [US1] Implement Google OAuth initiation (e.g., redirect to Google's auth URL) when the button is clicked.
- [ ] T010 [US1] Handle the OAuth callback from Google, extract the ID token.
- [ ] T011 [US1] Send the Google ID token to the backend's `/auth/google` endpoint for verification and JWT issuance.
- [ ] T012 [US1] Store the received JWT securely (e.g., in HTTP-only cookies or local storage) and use it for subsequent authenticated requests.
- [ ] T013 [US1] Implement a basic authentication context/provider (`frontend/src/contexts/AuthContext.tsx`) to manage user authentication state globally.

---

## Phase 4: User Story 2 - View and Manage Authenticated Tasks (Priority: P1) 🎯 MVP
**Goal**: Allow authenticated users to see, add, edit, delete, and toggle completion for their tasks via the real backend.
**Independent Test**: An authenticated user can perform all CRUD operations on *their own* tasks, and the UI updates instantly. Attempts to access/modify other users' tasks MUST fail. The empty state is shown when no tasks are present.

### Implementation for User Story 2
- [ ] T014 [US2] Create the main task UI container component in `frontend/src/components/tasks/TaskContainer.tsx`.
- [ ] T015 [US2] Create the task list component in `frontend/src/components/tasks/TaskList.tsx`.
- [ ] T016 [US2] Create the individual task item component in `frontend/src/components/tasks/TaskItem.tsx`.
- [ ] T017 [US2] Implement the "Add Task" component and its logic in `frontend/src/components/tasks/AddTask.tsx`, sending requests to the authenticated backend.
- [ ] T018 [US2] Integrate the `TaskContainer` and its children into the main page (or dashboard page) at `frontend/src/app/dashboard/page.tsx`, ensuring all data fetching uses the authenticated `apiClient`.
- [ ] T019 [US2] Implement the empty state UI within `frontend/src/components/tasks/TaskList.tsx` for authenticated users.
- [ ] T020 [US2] Implement the "edit task" functionality within `frontend/src/components/tasks/TaskItem.tsx`, sending requests to the authenticated backend.
- [ ] T021 [US2] Implement the "delete task" functionality within `frontend/src/components/tasks/TaskItem.tsx`, sending requests to the authenticated backend.
- [ ] T022 [US2] Implement the "toggle completion" functionality within `frontend/src/components/tasks/TaskItem.tsx`, sending requests to the authenticated backend.

---

## Phase 5: User Story 3 - Use the Focus Timer (Priority: P2)
**Goal**: Provide a functional focus timer for authenticated users to manage work sessions.
**Independent Test**: The timer is displayed below the task container. The user can start, stop, and adjust the timer's duration.

### Implementation for User Story 3
- [ ] T023 [US3] Create the focus timer container component in `frontend/src/components/timer/FocusTimer.tsx`.
- [ ] T024 [US3] Create the timer controls (start, end, +/-) in `frontend/src/components/timer/TimerControls.tsx`.
- [ ] T025 [US3] Implement the countdown logic and state management within `frontend/src/components/timer/FocusTimer.tsx`.
- [ ] T026 [US3] Integrate the `FocusTimer` component into the main page (or dashboard page) at `frontend/src/app/dashboard/page.tsx`.

---

## Phase 6: Polish & Cross-Cutting Concerns
**Purpose**: Improvements that affect multiple user stories.

- [ ] T027 Implement responsive design for mobile, tablet, and desktop layouts for all components.
- [ ] T028 Add smooth UI transitions for hover, toggle, and add/delete actions.
- [ ] T029 Perform an accessibility check (focus states, semantic HTML, ARIA attributes).
- [ ] T030 Review the UI for consistency in spacing, color, and typography.
- [ ] T031 Run `quickstart.md` validation to ensure the project runs as expected.

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion.
- **Google Authentication (Phase 3)**: Depends on Foundational completion. This is a critical prerequisite for all authenticated user features.
- **User Story 2 (Phase 4)**: Depends on Google Authentication (Phase 3) and Foundational (Phase 2) completion.
- **User Story 3 (Phase 5)**: Depends on Google Authentication (Phase 3) and Foundational (Phase 2) completion. It is independent of User Story 2.
- **Polish (Phase 6)**: Depends on all user stories being complete.

### User Story Dependencies
- **User Story 1 (Google Auth)**: Must be completed first.
- **User Story 2 (Authenticated Tasks)**: Depends on User Story 1.
- **User Story 3 (Focus Timer)**: Depends on User Story 1. It is independent of User Story 2.

### Parallel Opportunities
- Once the Foundational phase is complete, the implementation of Google Authentication can begin.
- Once Google Authentication is complete, User Story 2 and User Story 3 can be developed in parallel.
- Within User Story 2, components can be developed in parallel before integration.
- Within User Story 3, components can be developed in parallel.
- All Polish tasks can be worked on in parallel after the feature implementation is complete.

## Implementation Strategy
The strategy is to build the application incrementally, starting with a solid foundation, then implementing core authentication, followed by the main MVP feature (Authenticated Task Management), and finally the secondary feature (Focus Timer). Each user story is a deliverable, testable increment, with authentication now a primary foundational step.
