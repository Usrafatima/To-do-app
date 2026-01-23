# Implementation Plan: Phase III AI Chat Backend

**Branch**: `3-ai-chat-backend` | **Date**: 2026-01-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/3-ai-chat-backend/spec.md`

## Summary

This plan outlines the steps to implement a stateless, AI-powered chat backend using FastAPI. The backend will leverage the OpenAI Assistants API to provide a conversational interface for task management, with all state persisted in a Neon PostgreSQL database. The agent's capabilities will be defined as reusable, tool-based skills that interact with the existing application's business logic.

## Technical Context

**Language/Version**: Python 3.11+
**Primary Dependencies**: FastAPI, SQLModel, Alembic, OpenAI Python SDK v2
**Storage**: Neon Serverless PostgreSQL
**Testing**: Pytest
**Target Platform**: Cloud (Linux server)
**Project Type**: Backend service augmenting an existing web application.
**Constraints**: Must be stateless; must integrate with existing Phase 2 authentication and task logic.

## Constitution Check

*GATE: All principles are adhered to.*

- [X] **Frontend is Source of Truth**: N/A. This is a backend-only feature with no UI changes.
- [X] **No Unauthorized Frontend Refactors**: N/A.
- [X] **Phase 1 is Historical Reference**: Yes, all logic will be new or from Phase 2.
- [X] **Backend Conforms to Frontend**: N/A. The chat API is a new addition and does not alter existing frontend-backend contracts.
- [X] **Chatbot Reuses Backend APIs**: Yes, the plan explicitly states that Agent Skills will wrap existing business logic.
- [X] **No Duplicate Logic**: Yes, a core part of the design is to reuse existing task management logic.
- [X] **JWT-Based Authentication**: Yes, the new chat endpoint will be protected by the existing `get_current_user` dependency.
- [X] **State in Neon PostgreSQL**: Yes, new models for conversations and messages will be stored in the database.
- [X] **Stateless Server**: Yes, the entire chat flow is designed to be stateless.
- [X] **Superseded Work to History**: N/A. No work is being superseded.
- [X] **Specs Drive All Changes**: Yes, this plan is derived directly from `spec.md`.
- [X] **No Manual Coding**: Yes, the implementation will be executed by an AI agent.
- [X] **AI Logic via OpenAI Agents SDK**: Yes, this is the core AI dependency.
- [X] **Tool-Based Task Management via MCP SDK**: Yes, the plan uses this pattern.
- [X] **Reusable Intelligence via Agent Skills**: Yes, tools are designed as reusable skills.
- [X] **Production-Ready Folder Structure**: Yes, the plan defines a clean structure.

## Project Structure

### Documentation (this feature)

```text
specs/3-ai-chat-backend/
├── plan.md              # This file
├── research.md          # Completed
├── data-model.md        # Completed
├── contracts/           # Completed
│   └── openapi.yml
└── tasks.md             # To be created by /sp.tasks
```

### Source Code (repository root)

```text
backend/
└── src/
    ├── api/
    │   └── v1/
    │       └── chat.py        # New chat API endpoint
    ├── core/
    │   └── config.py      # Add OpenAI API key
    ├── models/
    │   └── chat.py        # New Conversation and Message models
    ├── services/
    │   └── chat_service.py  # Core logic for interacting with OpenAI Assistant
    └── agent/
        ├── assistant.py   # Logic to create/load the OpenAI Assistant
        └── skills.py      # Python functions for the agent's tools (e.g., add_task)
```

**Structure Decision**: The plan will augment the existing `backend/` directory, adding new modules for the chat functionality in a way that is isolated and maintainable.

## Implementation Steps

This plan is broken into atomic steps, executable by an AI agent.

### Step 1: Environment and Configuration
1.  Add `openai` to the `backend/requirements.txt`.
2.  Update `backend/src/core/config.py` to load the `OPENAI_API_KEY` from environment variables.

### Step 2: Database Schema
1.  Create `backend/src/models/chat.py`.
2.  Implement the `Conversation` and `Message` SQLModel classes as defined in `data-model.md`.
3.  Generate a new Alembic migration script to create the `conversation` and `message` tables.
4.  Apply the migration to the database.

### Step 3: Agent and Skills
1.  Create `backend/src/agent/assistant.py`. Inside, write a function to get or create the OpenAI Assistant, providing it with instructions ("You are a helpful task management assistant..."), the model, and tool definitions.
2.  Create `backend/src/agent/skills.py`.
3.  In `skills.py`, implement Python functions for each MCP tool (`add_task`, `list_tasks`, `update_task`, `delete_task`).
4.  These functions should accept parameters as defined by the tool schema (e.g., `add_task(text: str, priority: str)`).
5.  Inside the functions, import and use the existing Phase 2 task service layer to perform the database operations. Do not write new database logic.

### Step 4: Chat Service Layer
1.  Create `backend/src/services/chat_service.py`.
2.  Implement the main `handle_chat_message` function that orchestrates the entire stateless chat flow:
    a.  Accepts `user_id`, `message`, and optional `conversation_id`.
    b.  Loads the user's `Conversation` from the DB or creates a new one (along with a new OpenAI Thread).
    c.  Adds the user's message to the OpenAI Thread.
    d.  Runs the Assistant on the Thread.
    e.  Enters a loop to handle `requires_action` status: executes the corresponding skill from `skills.py` and submits the output back to the run.
    f.  Once the run is `completed`, retrieves the assistant's latest message.
    g.  Saves the user and assistant messages to the `message` table in the database.
    h.  Returns the `conversation_id` and the final response text.

### Step 5: API Endpoint
1.  Create `backend/src/api/v1/chat.py`.
2.  Define a new FastAPI `APIRouter`.
3.  Create the `POST /api/v1/chat` endpoint as defined in `contracts/openapi.yml`.
4.  Protect the endpoint with the existing `get_current_user` dependency.
5.  In the endpoint, call the `chat_service.handle_chat_message` function, passing the necessary data.
6.  Update `backend/src/main.py` to include the new `chat.router`.

### Step 6: Finalization
1.  Add comprehensive error handling to the `chat_service` and `chat` API endpoint.
2.  Implement structured logging to trace a request's journey through the service and agent interactions.
3.  Write unit and integration tests for the new service and API endpoint, mocking the OpenAI API calls.

---
This plan enables a scalable, cloud-native AI backend.
