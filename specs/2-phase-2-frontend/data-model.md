# Data Model for Hackathon 2

This document outlines the data models for the application, as specified in the project constitution.

## User Model

| Field             | Type   | Description               |
|-------------------|--------|---------------------------|
| `id`              | PK     | Unique identifier for the user. |
| `email`           | string | User's email address (unique). |
| `hashed_password` | string | User's hashed password.   |
| `full_name`       | string | User's full name.         |

## Task Model

| Field         | Type      | Description                   |
|---------------|-----------|-------------------------------|
| `id`          | PK        | Unique identifier for the task. |
| `title`       | string    | The title of the task.        |
| `is_completed`| boolean   | Whether the task is completed or not (default: false). |
| `due_date`    | timestamp | The due date of the task (nullable). |
| `owner_id`    | FK        | Foreign Key to `users.id`.    |