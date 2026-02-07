# Event Schemas

This document defines the CloudEvents schema for asynchronous communication between services in the TaskPilot application.

## 1. Task Lifecycle Events

Topic: `tasks.lifecycle`

### `TaskCreated`

Published when a new task is successfully created.

```json
{
  "specversion": "1.0",
  "type": "com.taskpilot.task.created",
  "source": "task-service",
  "id": "uuid-v4",
  "time": "2023-10-27T10:00:00Z",
  "datacontenttype": "application/json",
  "data": {
    "task_id": "uuid-v4",
    "user_id": "user-123",
    "text": "Buy groceries",
    "description": "Milk, Eggs, Bread",
    "created_at": "2023-10-27T10:00:00Z"
  }
}
```

### `TaskCompleted`

Published when a task is marked as complete.

```json
{
  "specversion": "1.0",
  "type": "com.taskpilot.task.completed",
  "source": "task-service",
  "id": "uuid-v4",
  "time": "2023-10-27T12:00:00Z",
  "datacontenttype": "application/json",
  "data": {
    "task_id": "uuid-v4",
    "user_id": "user-123",
    "completed_at": "2023-10-27T12:00:00Z"
  }
}
```

## 2. Reminder Events

Topic: `reminders.lifecycle`

### `ReminderTriggered`

Published by the Reminder Service when a scheduled reminder time is reached.

```json
{
  "specversion": "1.0",
  "type": "com.taskpilot.reminder.triggered",
  "source": "reminder-service",
  "id": "uuid-v4",
  "time": "2023-10-27T14:00:00Z",
  "datacontenttype": "application/json",
  "data": {
    "reminder_id": "uuid-v4",
    "task_id": "uuid-v4",
    "user_id": "user-123",
    "trigger_time": "2023-10-27T14:00:00Z"
  }
}
```

## 3. Recurring Task Events

Topic: `recurring.lifecycle`

### `RecurringTaskGenerated`

Published by the Recurring Service when a new task instance is generated from a template.

```json
{
  "specversion": "1.0",
  "type": "com.taskpilot.recurring.generated",
  "source": "recurring-service",
  "id": "uuid-v4",
  "time": "2023-10-28T09:00:00Z",
  "datacontenttype": "application/json",
  "data": {
    "original_task_id": "uuid-v4", // The template task
    "new_task_id": "uuid-v4",      // The newly created task instance
    "user_id": "user-123",
    "generated_at": "2023-10-28T09:00:00Z"
  }
}
```
