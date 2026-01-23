# Mock API Client Contract

This document defines the contract for the mock API client located at `src/lib/apiClient.ts`. This client will simulate the backend logic for managing tasks in memory.

## Functions

### `getTasks(): Promise<Task[]>`
- **Description**: Retrieves the current list of all tasks.
- **Returns**: A promise that resolves to an array of `Task` objects.

### `addTask(text: string): Promise<Task>`
- **Description**: Adds a new task to the list.
- **Parameters**:
  - `text`: The content of the new task.
- **Returns**: A promise that resolves to the newly created `Task` object.

### `updateTask(id: string, updates: { text?: string; isCompleted?: boolean }): Promise<Task>`
- **Description**: Updates an existing task.
- **Parameters**:
  - `id`: The ID of the task to update.
  - `updates`: An object containing the fields to update (`text` and/or `isCompleted`).
- **Returns**: A promise that resolves to the updated `Task` object.

### `deleteTask(id: string): Promise<void>`
- **Description**: Deletes a task from the list.
- **Parameters**:
  - `id`: The ID of the task to delete.
- **Returns**: A promise that resolves when the operation is complete.
