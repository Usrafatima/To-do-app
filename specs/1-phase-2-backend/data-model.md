# Data Model: Phase II Backend

## User

Represents a user of the application.

**Fields**:
- `id` (integer, primary key)
- `email` (string, unique)
- `hashed_password` (string)

**Relationships**:
- Has many `Task`s

## Task

Represents a single to-do item.

**Fields**:
- `id` (integer, primary key)
- `text` (string)
- `is_completed` (boolean, default: `false`)
- `due_date` (datetime, nullable)
- `priority` (string, nullable, one of: "High", "Medium", "Low")
- `tags` (array of strings, nullable)
- `recurrence` (json, nullable, e.g., `{"type": "daily"}`)
- `user_id` (integer, foreign key to `User.id`)

**Relationships**:
- Belongs to one `User`
