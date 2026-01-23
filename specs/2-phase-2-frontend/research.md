# Frontend Implementation Research

## Decision: Component-Based Architecture with State Hoisting

**Rationale**: A standard component-based architecture will be used, as is idiomatic for React/Next.js applications. State will be managed at the highest necessary level and passed down as props to child components (`State Hoisting`). For this application, the main `TaskContainer` will manage the list of tasks and the timer state. This avoids the need for a more complex state management library (like Redux or Zustand) for a project of this scale, keeping the implementation clean and simple.

**Alternatives considered**:
- **Global State Management (e.g., Context API, Zustand)**: Rejected as overly complex for the current scope. If the application were to grow significantly, this could be reconsidered.

## Decision: Real Authenticated API Client

**Rationale**: To ensure the UI is fully functional as per the new constitution, the `src/lib/apiClient.ts` will be responsible for integrating with the *real authenticated FastAPI backend*. This client will handle sending Google ID tokens for authentication, managing JWTs for subsequent requests, and making calls to the authenticated task management endpoints. This approach ensures secure and robust communication between the frontend and the backend.

**Alternatives considered**:
- **Mock Client**: Rejected as the project now requires integration with a real authenticated backend as per the updated constitution.
- **Directly embedding API calls in components**: Rejected because it mixes concerns and makes API logic harder to manage and test. The `apiClient.ts` provides a clean abstraction layer.
