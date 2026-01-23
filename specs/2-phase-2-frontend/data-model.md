# Frontend Data Model

This document defines the data structures used within the frontend application.

## Task

Represents a single to-do item.

**Fields**:
- `id`: `string` (Unique identifier, e.g., a UUID)
- `text`: `string` (The content of the task)
- `isCompleted`: `boolean` (The completion status of the task)

**State Transitions**:
- A Task is created with `isCompleted: false`.
- The `isCompleted` status can be toggled between `true` and `false`.
