# Tasks: Chatbot Frontend UI

**Input**: Design documents from `specs/1-chatbot-ui/`
**Prerequisites**: plan.md, spec.md

---

## Phase 1: Setup

**Purpose**: Create the file structure for the new chatbot component.

- [x] T001 Create new directory `frontend/src/components/chatbot/`
- [x] T002 Create main component file `frontend/src/components/chatbot/Chatbot.tsx`

---

## Phase 2: GROUP 1 - CHATBOT FOUNDATION

**Purpose**: Implement the root component, state management, and positioning logic.

- [x] T003 In `Chatbot.tsx`, create the main functional component skeleton with a root `div`.
- [x] T004 In `Chatbot.tsx`, add `useState` hooks for `isOpen`, `messages`, `isLoading`, and `conversationId`.
- [x] T005 Apply fixed positioning styles to the root `div` in `Chatbot.tsx` to ensure it is independent of page flow.

---

## Phase 3: GROUP 2 - LAUNCHER BUTTON

**Purpose**: Build the floating button that toggles the chat window.

- [x] T006 [P] In `Chatbot.tsx`, implement the JSX for the floating launcher button.
- [x] T007 [P] In `Chatbot.tsx`, apply Tailwind CSS classes for the circular shape, icon, shadow, and neon/glow effect on the launcher button.
- [x] T008 In `Chatbot.tsx`, create the `toggleChat` function and attach it to the button's `onClick` event to update the `isOpen` state.
- [x] T009 In `Chatbot.tsx`, add CSS for `focus` and `hover` states on the launcher button.

---

## Phase 4: GROUP 3 - CHAT WINDOW

**Purpose**: Create the main container for the chat conversation.

- [x] T010 In `Chatbot.tsx`, implement the chat window container `div`. Its visibility should be conditional based on the `isOpen` state.
- [x] T011 [P] In `Chatbot.tsx`, apply Tailwind CSS classes for the glassmorphism effect, rounded corners, and shadow.
- [x] T012 [P] In `Chatbot.tsx`, add a header section to the chat window containing the title "AI Assistant" and a close button.
- [x] T013 In `Chatbot.tsx`, create a main content area within the window that will serve as the scrollable message container.
- [x] T014 In `Chatbot.tsx`, implement the open/close animation using CSS transitions on the chat window container.

---

## Phase 5: GROUP 4 - MESSAGE SYSTEM

**Purpose**: Implement the rendering of the conversation history.

- [x] T015 [P] In `Chatbot.tsx`, create a `MessageBubble` sub-component that accepts `role` and `content` props.
- [x] T016 [P] In `Chatbot.tsx`, style the `MessageBubble` to have distinct appearances for 'user' and 'assistant' roles.
- [x] T017 In `Chatbot.tsx`, map over the `messages` state array and render a `MessageBubble` for each message.
- [x] T018 In `Chatbot.tsx`, implement the auto-scroll behavior for the message container using a `useRef` and `useEffect` hook.
- [x] T019 In `Chatbot.tsx`, add logic to show a default greeting message when the window is first opened.

---

## Phase 6: GROUP 5 - INPUT & SEND

**Purpose**: Build the user input form for sending messages.

- [x] T020 In `Chatbot.tsx`, create the `form` element containing the text `input` and "Send" `button` at the bottom of the chat window.
- [x] T021 [P] In `Chatbot.tsx`, wire the text input to an `inputValue` state variable.
- [x] T022 In `Chatbot.tsx`, implement the `handleSubmit` function that calls the `sendChatMessage` API, updates the `messages` state, and handles the `isLoading` state. Attach it to the form's `onSubmit` event.
- [x] T023 In `Chatbot.tsx`, add logic to the form or input to handle the "Enter" key press for message submission.

---

## Phase 7: GROUP 6 - LOADING & ERROR STATES

**Purpose**: Provide visual feedback to the user during API calls.

- [x] T024 In `Chatbot.tsx`, implement the logic to disable the input field and send button when `isLoading` is true.
- [x] T025 [P] In `Chatbot.tsx`, create and render a typing indicator/spinner animation within the message list when `isLoading` is true.
- [x] T026 In `Chatbot.tsx`, enhance the `handleSubmit` function to render an error message bubble if the API call fails.

---

## Phase 8: GROUP 7 - RESPONSIVE & ACCESSIBILITY

**Purpose**: Ensure the component is usable on all devices and is accessible.

- [x] T027 In `Chatbot.tsx`, apply responsive Tailwind CSS prefixes to transition the chat window from a fixed card on desktop to a full-width bottom sheet on mobile.
- [x] T028 [P] Add ARIA roles and labels to the launcher, chat window, and form controls in `Chatbot.tsx`.
- [x] T029 In `Chatbot.tsx`, verify and refine keyboard navigation (tab order, focus states) for all interactive elements.

---

## Phase 9: Integration

**Purpose**: Add the completed chatbot to the main application page.

- [x] T030 Import and render the `Chatbot` component in the main dashboard page at `frontend/src/app/dashboard/page.tsx`.

---

## Dependencies & Execution Order

- **Phase 1 (Setup)** must be completed first.
- **Phase 2 (Foundation)** depends on Phase 1.
- All subsequent phases (3-8) modify the same component and should generally be done in order, though tasks marked with `[P]` can be worked on in parallel within their phase.
- **Phase 9 (Integration)** is the final step and depends on all other phases being complete.

---

## Implementation Strategy

The implementation will follow the phases outlined above sequentially. Each phase builds upon the previous one, starting with the basic structure and progressively adding UI elements, interactivity, and polish. This ensures a stable foundation before complex logic is introduced.

---

This task list will be used to implement the chatbot frontend in a spec-driven workflow.
