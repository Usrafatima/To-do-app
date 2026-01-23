---
id: 3
title: update-frontend-constitution
stage: constitution
date: 2026-01-11
surface: CLI
model: gemini-pro
feature: 
branch: 
user: 
command: /sp.constitution
labels: [constitution, frontend, spec]
links:
  spec: specs/1-fullstack-webapp/spec.md
  ticket: 
  adr: 
  pr: 
files:
  - .specify/memory/constitution.md
tests:

---

## Prompt

/sp.constitution FRONTEND CONSTITUTION
Project: Hackathon 2 – Phase 2 (Frontend)

1. PURPOSE & GOAL

The purpose of this frontend is to convert Phase 1 functionality into a fully
functional, modern, cool, and responsive user interface.

Phase 1 logic and behavior are the SINGLE SOURCE OF TRUTH.
The frontend must reflect Phase 1 exactly, without breaking or changing logic.

The goal is to deliver a real-world quality Todo / Task Manager UI that is:
- Functional
- Responsive
- Modern
- Clean
- Cool and intuitive

--------------------------------------------------

2. CORE DESIGN PRINCIPLES

- Frontend-first approach
- Functionality over visuals (no fake UI)
- Clean, minimal, modern design
- Fully responsive (mobile, tablet, desktop)
- Smooth interactions and micro-UX
- Accessible and intuitive

--------------------------------------------------

3. OVERALL LAYOUT STRUCTURE

3.1 Header
- Fixed header at the top
- Contains app title (Todo / Task Manager)
- Optional minimal icon/logo
- Clean background
- Responsive spacing

3.2 Main Content Area
- Centered layout
- Focused experience
- No clutter

--------------------------------------------------

4. TASK CONTAINER (MAIN UI)

- A centered square / card-style container
- Rounded corners with subtle shadow
- Acts as the main task board

Behavior:
- If tasks exist:
  - Display all tasks in a vertical list
- If no tasks exist:
  - Display text: "Add a new task"
  - Display a large plus (+) icon
  - Empty state should feel friendly and intentional

--------------------------------------------------

5. TASK ITEM (TODO CARD) DESIGN

Each task card must include:
- Task text
- Edit icon (pencil)
- Delete icon (dustbin)
- Complete / Incomplete toggle
- Clear visual distinction for completed tasks

Design requirements:
- Hover feedback
- Smooth toggle animation
- Touch-friendly for mobile
- Responsive layout

--------------------------------------------------

6. ADD TASK INTERACTION

- Prominent plus (+) button
- Clicking it allows user to add a new task
- Inline input or modal is allowed
- Enter key should submit task
- Task appears immediately after adding

--------------------------------------------------

7. TIMER / FOCUS CLOCK FEATURE

7.1 Purpose
A focus timer to help users work in time-based sessions
(Default inspiration: 20-minute focus session)

7.2 Timer UI
- Displayed below the task container
- Styled as a modern card
- Shows time (e.g. 20:00)
- Plus (+) button to increase time
- Minus (-) button to decrease time
- Start Timer button
- End Timer button

7.3 Timer Functionality
- Fully functional countdown
- Start begins countdown
- End stops and resets timer
- Time can be adjusted before starting
- UI updates in real time

--------------------------------------------------

8. RESPONSIVENESS REQUIREMENTS

- Mobile:
  - Vertical stacking
  - Full-width containers
  - Large touch targets
- Tablet:
  - Centered layout
  - Comfortable spacing
- Desktop:
  - Balanced margins
  - Focused central UI

No horizontal scrolling.
No broken layouts.

--------------------------------------------------

9. INTERACTIONS & MICRO-UX

- Smooth transitions for:
  - Hover
  - Toggle
  - Add / delete tasks
- Subtle animations only
- Clear feedback on every action

--------------------------------------------------

10. OPTIONAL MODERN ENHANCEMENTS (ALLOWED)

These enhancements are allowed if Phase 1 behavior is not broken:
- Light / Dark mode
- Task counter (e.g. remaining tasks)
- Progress indicator
- Soft background gradient
- Timer completion feedback
- Friendly empty-state text

--------------------------------------------------

11. FRONTEND HISTORY MANAGEMENT (MANDATORY)

- Create a dedicated folder named:
  frontend/history

- All frontend-related history must be placed inside this folder, including:
  - Old frontend versions
  - AI-generated frontend attempts
  - Deprecated UI files
  - Spec drafts or experiments related to frontend

- Active frontend code must NOT live in the history folder.
- History folder is for reference only.

--------------------------------------------------

12. STRICT RULES

- Do NOT modify Phase 1 logic
- Do NOT remove Phase 1 features
- Do NOT add backend logic
- No fake or non-functional UI
- Every button must work

--------------------------------------------------

13. SUCCESS CRITERIA

The frontend is considered successful if:
- All Phase 1 features are fully functional
- UI looks modern, cool, and polished
- Works on all screen sizes
- User understands the app without instructions

--------------------------------------------------

This Frontend Constitution will be used to implement Phase 2
in a spec-driven, frontend-first, agentic development workflow.

## Response snapshot

I have updated the constitution to version 2.1.0. The new version incorporates your detailed frontend specification and adds the Timer/Focus Clock feature.

- **New Version**: 2.1.0
- **Reason**: Minor bump for the addition of the detailed Frontend Specification and the new Timer/Focus Clock feature.
- **Files Modified**:
  - `.specify/memory/constitution.md`
- **Next Steps**: The constitution is ready for the next phase of development.

Suggested commit message:
`docs(constitution): amend to v2.1.0, add detailed frontend spec`

## Outcome

- ✅ Impact: High. The constitution now contains a detailed, actionable specification for the frontend UI/UX, which will guide implementation.
- 🧪 Tests: N/A
- 📁 Files: 
  - `history/prompts/constitution/3-update-frontend-constitution.prompt.md`
  - `.specify/memory/constitution.md`
- 🔁 Next prompts: 
- 🧠 Reflection: The existing constitution was a full-stack spec. The user provided a much more detailed frontend spec. Merging them was the correct approach. The PHR script was missing, so I had to fall back to manual creation.

## Evaluation notes (flywheel)

- Failure modes observed: Missing PHR creation script.
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A

