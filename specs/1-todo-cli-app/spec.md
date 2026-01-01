# Feature Specification: In-Memory Todo Console Application

**Feature Branch**: `1-todo-cli-app`  
**Created**: 2026-01-02  
**Status**: Draft  
**Input**: User description: "PROJECT SPECIFICATION Phase I: In-Memory Todo Console Application Objective: Build a Python-based command-line Todo application that stores tasks in memory only. The application must allow users to manage a list of todo items during runtime without any database or file persistence. Scope: This project covers only Phase I (Basic Level Functionality). Advanced features such as persistence, authentication, or UI are explicitly out of scope. Core Features: 1. Add Task - Each task must have: - A unique ID (auto-generated) - Title (required) - Description (optional) - Completion status (default: incomplete) 2. View Tasks - Display all tasks in a readable list format - Each task should show: - ID - Title - Description - Completion status (Completed / Pending) 3. Update Task - Allow updating task title and/or description by task ID - Task ID must be validated before updating 4. Delete Task - Allow deleting a task by its ID - Show a clear message if task does not exist 5. Mark Task Complete / Incomplete - Toggle task completion status using task ID Constraints: - All data must remain in memory (no files, no databases) - Python version: 3.13+ - Must run as a console application - Code must follow clean architecture and modular structure - No manual coding; code must be generated via AI instructions Error Handling: - Invalid inputs must be handled gracefully - User-friendly messages must be shown for errors Project Structure: - /src directory containing Python source code - Entry point must be a runnable Python file - Logical separation between: - Task model - Task manager logic - User interaction / CLI Non-Functional Requirements: - Code must be readable and well-structured - Functions and classes must have clear responsibilities - Application must be easy to extend in future phases Acceptance Criteria: - User can add, view, update, delete, and mark tasks - Application runs without errors - All features work correctly during a single runtime session"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add a new task (Priority: P1)

As a user, I want to add a new task with a title and an optional description so that I can keep track of my to-dos.

**Why this priority**: This is the most fundamental feature of a todo application.

**Independent Test**: The user can add a task and see it in the list of all tasks.

**Acceptance Scenarios**:

1. **Given** the application is running, **When** the user chooses to add a task and provides a title "Buy milk" and description "From the store", **Then** the task "Buy milk" is added to the list with a "Pending" status.
2. **Given** the application is running, **When** the user chooses to add a task and provides only a title "Walk the dog", **Then** the task "Walk the dog" is added to the list with a "Pending" status and an empty description.

### User Story 2 - View all tasks (Priority: P1)

As a user, I want to view all my tasks in a clear list so that I know what I need to do.

**Why this priority**: This is essential for the user to see what they have to do.

**Independent Test**: The user can see all the tasks that have been added.

**Acceptance Scenarios**:

1. **Given** that I have added the tasks "Buy milk" and "Walk the dog", **When** I choose to view all tasks, **Then** I see a list containing both tasks with their IDs, titles, descriptions, and "Pending" status.

### User Story 3 - Update a task (Priority: P2)

As a user, I want to update the title and/or description of an existing task so that I can correct mistakes or add more details.

**Why this priority**: This allows the user to manage their tasks more effectively.

**Independent Test**: The user can update a task and see the changes when viewing all tasks.

**Acceptance Scenarios**:

1. **Given** I have a task with ID 1 and title "Buy milk", **When** I choose to update task 1 with the new title "Buy groceries", **Then** the task's title is updated to "Buy groceries".
2. **Given** I have a task with ID 1, **When** I try to update a task with a non-existent ID 99, **Then** I see an error message "Task with ID 99 not found".

### User Story 4 - Delete a task (Priority: P2)

As a user, I want to delete a task so that I can remove completed or unnecessary items.

**Why this priority**: This is a basic feature for managing a list of tasks.

**Independent Test**: The user can delete a task and it will no longer appear in the list of all tasks.

**Acceptance Scenarios**:

1. **Given** I have a task with ID 1, **When** I choose to delete task 1, **Then** the task is removed from the list.
2. **Given** I have no task with ID 99, **When** I choose to delete task 99, **Then** I see an error message "Task with ID 99 not found".

### User Story 5 - Mark a task as complete/incomplete (Priority: P2)

As a user, I want to mark a task as complete or incomplete so that I can track my progress.

**Why this priority**: This is a core feature for a todo application.

**Independent Test**: The user can mark a task as complete and see the updated status when viewing all tasks.

**Acceptance Scenarios**:

1. **Given** I have a task with ID 1 and "Pending" status, **When** I choose to mark task 1 as complete, **Then** the task's status is updated to "Completed".
2. **Given** I have a task with ID 1 and "Completed" status, **When** I choose to mark task 1 as incomplete, **Then** the task's status is updated to "Pending".

### Edge Cases

- What happens when the user tries to update or delete a task with an ID that does not exist?
- How does the system handle empty input for the title when adding a task?
- How does the system handle very long titles or descriptions?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to add a task with a title and an optional description.
- **FR-002**: System MUST automatically generate a unique ID for each new task.
- **FR-003**: System MUST display all tasks with their ID, title, description, and completion status.
- **FR-004**: System MUST allow users to update the title and/or description of a task by its ID.
- **FR-005**: System MUST allow users to delete a task by its ID.
- **FR-006**: System MUST allow users to toggle the completion status of a task between "Pending" and "Completed".
- **FR-007**: System MUST handle invalid inputs gracefully and provide user-friendly error messages.

### Key Entities *(include if feature involves data)*

- **Task**: Represents a single todo item.
  - `id` (integer, unique)
  - `title` (string, required)
  - `description` (string, optional)
  - `completed` (boolean, default: false)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can successfully add, view, update, and delete tasks in a single session.
- **SC-002**: The application correctly toggles the completion status of a task.
- **SC-003**: The application provides clear error messages for invalid operations (e.g., updating a non-existent task).
- **SC-004**: The application exits gracefully without errors.