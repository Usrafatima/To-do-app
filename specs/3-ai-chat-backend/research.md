# Research: Phase III AI Chat Backend

**Summary**: This research document outlines the best practices and integration patterns for the selected technology stack for the AI Chat Backend.

## 1. OpenAI Assistants SDK Integration

- **Decision**: We will use the `openai` Python library, specifically the Assistants API. An `Assistant` object will be created at startup, configured with a model (e.g., `gpt-4-turbo`), instructions, and tool definitions.
- **Rationale**: The Assistants API is designed for building stateful, multi-turn conversational agents with tool-calling capabilities, which perfectly matches our requirements. It handles thread management and context persistence internally.
- **Alternatives Considered**: Building a custom agent loop using the basic Chat Completions API. This was rejected as it would require manually managing conversation history and tool-calling state, re-implementing functionality already provided by the Assistants API.

## 2. MCP SDK Integration for Tools

- **Decision**: Each MCP tool (`add_task`, `list_tasks`, etc.) will be implemented as a separate Python function. These functions will be registered as tools for the OpenAI Assistant. Inside these functions, we will call the existing Phase 2 backend logic (e.g., via service layer functions) to perform the actual task operations.
- **Rationale**: This approach creates a clear separation of concerns. The AI Agent's "tool" is a lightweight wrapper that delegates to the robust, already-tested business logic of the main application. This aligns with the "Chatbot Reuses Backend APIs" and "No Duplicate Logic" principles.
- **Alternatives Considered**: Implementing the task database logic directly inside the tool functions. This was rejected because it would violate the "No Duplicate Logic" principle.

## 3. Persistent Conversations using PostgreSQL

- **Decision**: We will create two new SQLModel tables: `Conversation` and `Message`. When a chat request comes in, we will either fetch the OpenAI `Thread ID` from our `Conversation` table or create a new one if it's a new conversation. All incoming user messages and outgoing assistant messages will be stored in our `Message` table for logging, debugging, and durability.
- **Rationale**: While the OpenAI Assistants API persists the thread, we cannot rely on a third-party service as our primary datastore. Storing conversation metadata and messages locally gives us full control, auditability, and data ownership, aligning with the "State Stored in Neon PostgreSQL" principle.
- **Alternatives Considered**: Relying solely on the OpenAI API for conversation history. This was rejected due to a lack of direct data ownership, control, and the risk of vendor lock-in for our core application data.
