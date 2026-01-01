# Tasks: In-Memory Todo Console Application

**Input**: Design documents from `/specs/1-todo-cli-app/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), data-model.md

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---
## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project structure: `src/models`, `src/services`, `src/cli`, `tests/unit`, `tests/integration`
- [X] T002 Create empty `__init__.py` files in `src`, `src/models`, `src/services`, `src/cli`, `tests`, `tests/unit`, `tests/integration`
- [X] T003 Create `src/main.py` as the main entry point for the application.
- [X] T004 Create `src/models/task.py` to define the `Task` class.
- [X] T005 Create `src/services/task_manager.py` to handle the business logic.
- [X] T006 Create `src/cli/menu.py` to handle the user interface and interactions.

---

## Phase 2: User Story 1 - Add a new task (Priority: P1) 🎯 MVP

**Goal**: As a user, I want to add a new task with a title and an optional description so that I can keep track of my to-dos.

**Independent Test**: The user can add a task and see it in the list of all tasks.

### Implementation for User Story 1

- [X] T007 [US1] In `src/models/task.py`, define the `Task` class with `id`, `title`, `description`, and `completed` attributes.
- [X] T008 [US1] In `src/services/task_manager.py`, implement the `TaskManager` class with an in-memory list to store tasks.
- [X] T009 [US1] In `src/services/task_manager.py`, implement the `add_task` method.
- [X] T010 [US1] In `src/cli/menu.py`, implement the `add_task_menu` function to get user input for the new task.
- [X] T011 [US1] In `src/main.py`, integrate the `add_task_menu` into the main application loop.

---

## Phase 3: User Story 2 - View all tasks (Priority: P1)

**Goal**: As a user, I want to view all my tasks in a clear list so that I know what I need to do.

**Independent Test**: The user can see all the tasks that have been added.

### Implementation for User Story 2

- [X] T012 [US2] In `src/services/task_manager.py`, implement the `get_all_tasks` method.
- [X] T013 [US2] In `src/cli/menu.py`, implement the `view_all_tasks_menu` function to display the tasks.
- [X] T014 [US2] In `src/main.py`, integrate the `view_all_tasks_menu` into the main application loop.

---

## Phase 4: User Story 3 - Update a task (Priority: P2)

**Goal**: As a user, I want to update the title and/or description of an existing task so that I can correct mistakes or add more details.

**Independent Test**: The user can update a task and see the changes when viewing all tasks.

### Implementation for User Story 3

- [X] T015 [US3] In `src/services/task_manager.py`, implement the `update_task` method.
- [X] T016 [US3] In `src/cli/menu.py`, implement the `update_task_menu` function to get user input for the task update.
- [X] T017 [US3] In `src/main.py`, integrate the `update_task_menu` into the main application loop.

---

## Phase 5: User Story 4 - Delete a task (Priority: P2)

**Goal**: As a user, I want to delete a task so that I can remove completed or unnecessary items.

**Independent Test**: The user can delete a task and it will no longer appear in the list of all tasks.

### Implementation for User Story 4

- [X] T018 [US4] In `src/services/task_manager.py`, implement the `delete_task` method.
- [X] T019 [US4] In `src/cli/menu.py`, implement the `delete_task_menu` function to get user input for the task to delete.
- [X] T020 [US4] In `src/main.py`, integrate the `delete_task_menu` into the main application loop.

---

## Phase 6: User Story 5 - Mark a task as complete/incomplete (Priority: P2)

**Goal**: As a user, I want to mark a task as complete or incomplete so that I can track my progress.

**Independent Test**: The user can mark a task as complete and see the updated status when viewing all tasks.

### Implementation for User Story 5

- [X] T021 [US5] In `src/services/task_manager.py`, implement the `toggle_task_completion` method.
- [X] T022 [US5] In `src/cli/menu.py`, implement the `mark_task_menu` function to get user input for which task to mark.
- [X] T023 [US5] In `src/main.py`, integrate the `mark_task_menu` into the main application loop.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T024 Add error handling for invalid user inputs in all menu functions in `src/cli/menu.py`.
- [X] T025 Refine the user interface and output formatting in `src/cli/menu.py`.
- [X] T026 Add docstrings to all functions and classes.
- [X] T027 Add type hints to all function signatures.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **User Story 1 (Phase 2)**: Depends on Setup.
- **User Story 2 (Phase 3)**: Depends on User Story 1.
- **User Story 3 (Phase 4)**: Depends on User Story 1.
- **User Story 4 (Phase 5)**: Depends on User Story 1.
- **User Story 5 (Phase 6)**: Depends on User Story 1.
- **Polish (Phase 7)**: Depends on all other phases.

### Implementation Strategy

### MVP First (User Story 1 & 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: User Story 1
3. Complete Phase 3: User Story 2
4. **STOP and VALIDATE**: Test adding and viewing tasks.

### Incremental Delivery

1. Complete MVP.
2. Add User Story 3 (Update).
3. Add User Story 4 (Delete).
4. Add User Story 5 (Mark Complete).
5. Complete Polish phase.
