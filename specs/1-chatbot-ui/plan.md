# Implementation Plan: Chatbot Frontend UI

**Feature Branch**: `1-chatbot-ui`  
**Specification**: `spec.md`  
**Created**: 2026-01-17
**Status**: Draft

---

## 1. Technical Context

- **Feature:** Create a responsive, reusable, and accessible floating chatbot UI component using the existing project tech stack.
- **Domain:** Frontend UI Development
- **Key Technologies:**
  - `Next.js (App Router)`: Provides the React framework and component structure.
  - `TypeScript`: Ensures type safety for state and props.
  - `Tailwind CSS`: Used for all styling to maintain consistency with the project's design system.
- **Dependencies & Integrations:**
  - `apiClient.ts`: The plan assumes the existing API client will be used to communicate with the black-box backend.
- **Assumptions:**
  - The backend API endpoint for the chatbot is available and functional.
  - The project is already set up for Next.js development.

---

## 2. Constitution Check

- **Principle Check**: This plan adheres to all principles in the [Project Constitution v3.0.0](../../.specify/memory/constitution.md).
  - `Principle 1: UI-Only Responsibility`: ✅ Adhered. The plan is strictly confined to frontend UI components and state.
  - `Principle 2: Backend as a Black Box`: ✅ Adhered. The plan makes no assumptions about or modifications to the backend.
  - `Principle 3: Clean Component-Based Architecture`: ✅ Adhered. The plan outlines a component-first approach.
  - `Principle 4: State-Driven UI`: ✅ Adhered. The plan's steps are based on managing and reacting to state changes.
  - `Principle 5: Accessibility First`: ✅ Adhered. Accessibility is a dedicated phase of the plan.
  - `Principle 6: Mobile-First Design`: ✅ Adhered. Responsiveness is a dedicated phase of the plan.
- **Gate Evaluation**:
  - `Gate: No backend changes`: ✅ Pass
  - `Gate: No new production dependencies`: ✅ Pass
  - **Overall Status**: ✅ Plan is compliant.

---

## 3. Implementation Plan

This implementation will be broken into sequential phases, starting with the foundational container and progressively adding functionality and polish.

### Phase 0: Component Scaffolding
- **P0-1**: Create the main container component file: `Chatbot.tsx`. This component will encapsulate all chatbot functionality.
- **P0-2**: Establish the basic state variables using `useState` for `isOpen`, `messages`, `isLoading`, and `error`.

### Phase 1: Launcher and Container UI
- **P1-1**: Implement the floating launcher button. Position it fixed to the bottom-right of the viewport. Style it with a circular shape, neon/glow effects, and an icon.
- **P1-2**: Implement the main chat window container. Style it with the specified glassmorphism effect, rounded corners, and shadow. Its visibility will be toggled by the `isOpen` state.
- **P1-3**: Implement the open/close click handler on the launcher button to toggle the `isOpen` state. Add smooth fade/scale animations for the container's appearance and disappearance.

### Phase 2: Message Display
- **P2-1**: Create a `MessageBubble` sub-component that accepts a message object (`role`, `content`) and renders it with a distinct style based on the `role` (e.g., user messages on the right, bot on the left).
- **P2-2**: Implement the message history area within the chat window. It will map over the `messages` state array and render a `MessageBubble` for each message.
- **P2-3**: Ensure the message history area is scrollable when content overflows. Implement an auto-scroll mechanism to show the latest message.
- **P2-4**: Implement the initial state logic to display a hardcoded welcome message from the 'assistant' when the message list is empty and the window is first opened.

### Phase 3: Input and Interaction Logic
- **P3-1**: Implement the message input form, including a text input and a "Send" button with an icon.
- **P3-2**: Wire the input to a state variable.
- **P3-3**: Create the `handleSubmit` function. This function will:
    - Add the user's message to the `messages` state array.
    - Set `isLoading` to true.
    - Call the backend API using the `apiClient`.
    - On success, add the bot's response to the `messages` array and set `isLoading` to false.
    - On failure, set an error state and display an error message bubble.
- **P3-4**: Add logic to handle "Enter" key press in the input field to trigger form submission.
- **P3-5**: Implement the disabled state for the input and send button when `isLoading` is true. Display a loading indicator (e.g., pulsing dots) in a new message bubble.

### Phase 4: Responsiveness & Accessibility
- **P4-1**: Use Tailwind's responsive modifiers to change the chat window's style based on viewport size. On mobile, it will be a full-width bottom sheet; on desktop, a fixed card.
- **P4-2**: Ensure all interactive elements are touch-friendly with sufficiently large tap targets.
- **P4-3**: Add ARIA labels to the launcher and send button. Ensure the input has a proper label.
- **P4-4**: Implement and verify keyboard navigation (tabbing between launcher, input, and send button). Add clear focus-visible styles.

This plan enables clean, agentic implementation of the chatbot frontend.

---

## 4. Follow-up Actions

- **Next Step**: Break this plan into detailed tasks using `/sp.tasks`.