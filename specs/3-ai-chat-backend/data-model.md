# Data Model: Phase III AI Chat Backend

This document defines the new database entities required for persisting conversation history. These models are in addition to the existing `User` and `Task` models from Phase 2.

## Entity: Conversation

Represents a single, continuous chat session between a user and the AI agent. It links our internal user model to the conversation thread managed by the OpenAI Assistants API.

| Field | Type | Description | Constraints |
|---|---|---|---|
| `id` | UUID | Primary key. | Required, Unique |
| `user_id` | UUID | Foreign key to the `User` table. | Required, Indexed |
| `openai_thread_id` | String | The ID of the thread from the OpenAI Assistants API. | Required, Unique, Indexed |
| `created_at` | DateTime | Timestamp of when the conversation was initiated. | Required |
| `updated_at` | DateTime | Timestamp of the last message in the conversation. | Required |

## Entity: Message

Represents a single message sent by either the user or the assistant within a conversation. This provides a durable log of the interaction.

| Field | Type | Description | Constraints |
|---|---|---|---|
| `id` | UUID | Primary key. | Required, Unique |
| `conversation_id` | UUID | Foreign key to the `Conversation` table. | Required, Indexed |
| `role` | String | The role of the message sender. | Required, Enum("user", "assistant") |
| `content` | Text | The textual content of the message. | Required |
| `openai_message_id` | String | The ID of the message from the OpenAI Assistants API. | Required, Unique |
| `created_at` | DateTime | Timestamp of when the message was sent. | Required |
