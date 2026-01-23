# Data Model: TaskPilot FastAPI Google Authentication

This document outlines the data models for the backend of TaskPilot, specifically for user management and tasks, integrated with Google Authentication.

## User Model

Represents a user authenticated via Google.

| Field               | Type     | Description                      | Constraints          |
|---------------------|----------|----------------------------------|----------------------|
| `google_user_id`    | String   | Unique identifier from Google.   | Primary Key, Unique  |
| `name`              | String   | User's full name.                | Not Null             |
| `email`             | String   | User's email address.            | Not Null, Unique     |
| `profile_picture_url`| String   | URL to user's profile picture.   | Nullable             |
| `created_at`        | DateTime | Timestamp of user creation.      | Auto-generated       |
| `updated_at`        | DateTime | Timestamp of last update.        | Auto-generated       |

## Task Model

Represents a to-do item owned by a user.

| Field         | Type     | Description                         | Constraints                      |
|---------------|----------|-------------------------------------|----------------------------------|
| `task_id`     | String   | Unique identifier for the task.     | Primary Key, Auto-generated      |
| `user_id`     | String   | Reference to the owning user's ID.  | Foreign Key (`Users.google_user_id`), Not Null |
| `title`       | String   | The title/description of the task.  | Not Null, Max length 255         |
| `description` | String   | Optional detailed task description. | Nullable                         |
| `is_completed`| Boolean  | Completion status of the task.      | Not Null, Default: `false`       |
| `created_at`  | DateTime | Timestamp of task creation.         | Auto-generated                   |
| `updated_at`  | DateTime | Timestamp of last update.           | Auto-generated                   |

## Relationships

- **User to Task**: One-to-Many (`User` can have many `Tasks`, but each `Task` belongs to one `User`). This relationship is enforced by the `user_id` foreign key in the `Task` model referencing the `google_user_id` in the `User` model.
