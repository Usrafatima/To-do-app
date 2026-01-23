# Data Model: Chatbot Frontend UI

This feature is frontend-only and does not define or interact with the backend database schema. The data model refers to the client-side entities required to manage the UI state.

## Entities

### `Message`
Represents a single message object within the chat history array.

- **`role`** (string): The author of the message.
  - **Values**: Must be either `'user'` or `'assistant'`.
- **`content`** (string): The plain text content of the message.

## State Transitions

The primary state managed by the component is an array of `Message` objects: `Message[]`.

- **User Message**: A new `Message` object with `role: 'user'` is added to the array when the user submits the input form.
- **Assistant Message**: A new `Message` object with `role: 'assistant'` is added to the array upon successful response from the backend API.
- **Error Message**: A new `Message` object with `role: 'assistant'` and error-specific content is added to the array if the API call fails.
