# Feature Specification: Chatbot Frontend UI

**Feature Branch**: `1-chatbot-ui`  
**Created**: 2026-01-17
**Status**: Draft  
**Input**: User description: "Using the chatbot frontend constitution as the ONLY source of truth, define the complete frontend specification for the chatbot UI. FUNCTIONAL REQUIREMENTS: - Floating chatbot launcher (bottom-right) - Click toggles chat window open/close - Auto greeting message on first open - Message input field - Send button - Press Enter to send - Scrollable message history - Distinct user and bot message styles - Loading indicator while waiting for response - Disable input while loading UI & DESIGN REQUIREMENTS: - Glassmorphism chat container - Rounded corners - Shadow + glow effect - Smooth animations - Compact but readable layout STATE HANDLING: - Open / closed state - Message list state - Loading state - Error display state RESPONSIVENESS: - Full-width bottom sheet on mobile - Fixed card on desktop - Touch-friendly interactions ACCESSIBILITY: - Keyboard navigation - Focus states - ARIA labels where needed OUTPUT RULES: - No code - No implementation steps - No backend explanation - Only WHAT the chatbot frontend must do"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View and Greet (Priority: P1)

As a user, I want to open the chat window and be greeted with a welcome message so I know the chatbot is ready to help.

**Why this priority**: This is the primary entry point for any user interaction with the chatbot and establishes its availability.

**Independent Test**: The floating launcher button is visible. Clicking it opens the chat window, and a welcome message from the assistant is displayed.

**Acceptance Scenarios**:

1. **Given** the application is loaded, **When** the user clicks the floating chatbot launcher button for the first time, **Then** the chat window animates open and displays a pre-defined greeting message from the "assistant".
2. **Given** the chat window is open, **When** the user clicks the chatbot launcher button again (or a close icon), **Then** the chat window animates closed.

---

### User Story 2 - Have a Conversation (Priority: P2)

As a user, I want to send a message to the chatbot and receive a response, with a clear indication of when the bot is "thinking".

**Why this priority**: This covers the core functionality of a chatbot: sending and receiving messages.

**Independent Test**: Can be tested by opening the chat window, typing a message, sending it, and observing the loading state followed by the bot's response.

**Acceptance Scenarios**:

1. **Given** the chat window is open, **When** the user types a message in the input field and clicks "Send" (or presses Enter), **Then** the user's message appears in the history, the input field is cleared, and a loading indicator is displayed.
2. **Given** the system is waiting for a response, **When** the backend API returns a message, **Then** the loading indicator is replaced by a new message from the "assistant" in the chat history.
3. **Given** the user is typing, **When** they press the "Enter" key, **Then** the message is sent, equivalent to clicking the "Send" button.
4. **Given** the chat history exceeds the visible area, **When** a new message is added, **Then** the history automatically scrolls to show the latest message.

---

### Edge Cases

- **API Error**: If the backend call fails, the loading indicator is removed, and a user-friendly error message is displayed in its place (e.g., "Sorry, I'm having trouble connecting. Please try again later.").
- **Empty Message**: Clicking "Send" or pressing Enter with an empty input field does nothing.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST display a floating chatbot launcher button in the bottom-right of the viewport.
- **FR-002**: A click on the launcher button MUST toggle the visibility of the chat window.
- **FR-003**: The system MUST display an automated greeting message from the assistant on the first time the window is opened per session.
- **FR-004**: The system MUST provide a text input field for the user to compose messages.
- **FR-005**: The system MUST provide a "Send" button to submit the message.
- **FR-006**: Pressing the "Enter" key within the input field MUST trigger the send action.
- **FR-007**: The UI MUST display a scrollable history of the conversation.
- **FR-008**: User messages and assistant (bot) messages MUST have visually distinct styles (e.g., alignment, color).
- **FR-009**: A loading indicator MUST be displayed while the system is waiting for a response from the backend.
- **FR-010**: The message input field and send button MUST be disabled while the system is in a loading state.

### Non-Functional Requirements

- **UI-001 (Design)**: The chat window container MUST have a "glassmorphism" visual effect (frosted glass background).
- **UI-002 (Design)**: All corners of the chat window and launcher button MUST be rounded.
- **UI-003 (Design)**: The chat window and launcher MUST have a subtle shadow and/or glow effect to appear elevated.
- **UI-004 (Design)**: All state transitions (opening/closing the window) MUST be accompanied by smooth animations (e.g., fade and scale).
- **UI-005 (State)**: The open/closed state of the chat window MUST be managed.
- **UI-006 (State)**: The list of messages in the current conversation MUST be managed in state.
- **UI-007 (State)**: The loading state (i.e., waiting for a backend response) MUST be managed.
- **UI-008 (State)**: Any error response from the backend must be managed and displayed to the user.
- **UI-009 (Responsiveness)**: On mobile viewports, the chat window MUST open as a bottom sheet covering the full width of the screen.
- **UI-010 (Responsiveness)**: On desktop viewports, the chat window MUST open as a fixed-size card in the bottom-right corner.
- **UI-011 (Accessibility)**: All interactive elements (launcher, input, send button) MUST be navigable via keyboard.
- **UI-012 (Accessibility)**: All interactive elements MUST have clear focus states.
- **UI-013 (Accessibility)**: All non-textual interactive elements (e.g., launcher, send button) MUST have appropriate ARIA labels.

### Key Entities

- **Message**: Represents a single entry in the chat history.
  - **Attributes**: `role` (either 'user' or 'assistant'), `content` (the text of the message).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The open/close animation for the chat window MUST complete in under 400ms.
- **SC-002**: User-to-first-response latency (time from user sending a message to loading indicator appearing) MUST be less than 100ms.
- **SC-003**: The component MUST achieve a Lighthouse accessibility score of 95 or higher.
- **SC-004**: The layout MUST remain fully usable and without visual defects on screen widths from 320px to 1920px.
- **SC-005**: 100% of functional requirements (FR-001 through FR-010) are verifiably implemented.
