---
phr_id: 2
phr_title: Update Project Constitution
phr_stage: constitution
phr_date_iso: 2026-01-02
phr_surface: agent
phr_model: gemini-1.5-flash
phr_feature: none
phr_branch: master
phr_user: user
phr_command: /sp.constitution PROJECT CONSTITUTION
====================

Project Title:
In-Memory Todo Console Application (Phase I)

Purpose:
The purpose of this project is to build a basic-level, in-memory Todo application
using a strict spec-driven and agentic development workflow.
The goal is to demonstrate structured planning, clean implementation,
and disciplined iteration without manual coding.

Guiding Principles:
1. Spec-Driven Development
   - All development must begin with a written specification.
   - No implementation is allowed without an approved spec.
   - Changes must be reflected by updating the spec first.

2. Agentic Workflow
   - Development follows this order:
     Specification → Plan → Task Breakdown → Implementation
   - The AI assistant is responsible for generating plans, tasks,
     and implementation based strictly on the spec.

3. No Manual Coding Rule
   - Human contributors must not write application code directly.
   - All source code must be generated via AI prompts.
   - Manual edits are limited to configuration, file organization,
     and documentation only.

4. In-Memory Data Constraint
   - All todo data must be stored in memory.
   - No database, file storage, or persistence is allowed.
   - Data resets when the program exits.

5. Scope Control
   - Only Basic Level functionality is allowed in Phase I.
   - Advanced features such as authentication, persistence,
     UI frameworks, or APIs are strictly prohibited.

6. Clean Code Standards
   - Code must be readable, modular, and well-structured.
   - Meaningful naming conventions must be used.
   - Single Responsibility Principle should be followed.

7. Python & Tooling Standards
   - Python version must be 3.13 or higher.
   - UV must be used for environment and dependency management.
   - The application must run as a console-based program.

8. Required Features (Non-Negotiable)
   - Add a task (title and description)
   - View all tasks with completion status
   - Update an existing task
   - Delete a task by ID
   - Mark tasks as complete or incomplete

9. Documentation Discipline
   - All specs must be stored in a specs history folder.
   - README must clearly explain setup and usage.
   - AI instruction files must define how the AI should behave.

10. Evaluation Criteria
    - Correctness of spec-driven process
    - Completeness of required features
    - Clarity and quality of generated code
    - Proper adherence to constraints
    - Clean and understandable project structure

Constitution Authority:
This constitution overrides all other instructions unless
explicitly updated through a new versioned specification.

End of Constitution
===================
phr_labels: ["constitution", "project-setup"]
phr_links:
  spec: null
  ticket: null
  adr: null
  pr: null
phr_files_yaml:
  - .specify/memory/constitution.md
  - .specify/templates/plan-template.md
phr_tests_yaml: []
---

## Prompt Text

```text
/sp.constitution PROJECT CONSTITUTION
====================

Project Title:
In-Memory Todo Console Application (Phase I)

Purpose:
The purpose of this project is to build a basic-level, in-memory Todo application
using a strict spec-driven and agentic development workflow.
The goal is to demonstrate structured planning, clean implementation,
and disciplined iteration without manual coding.

Guiding Principles:
1. Spec-Driven Development
   - All development must begin with a written specification.
   - No implementation is allowed without an approved spec.
   - Changes must be reflected by updating the spec first.

2. Agentic Workflow
   - Development follows this order:
     Specification → Plan → Task Breakdown → Implementation
   - The AI assistant is responsible for generating plans, tasks,
     and implementation based strictly on the spec.

3. No Manual Coding Rule
   - Human contributors must not write application code directly.
   - All source code must be generated via AI prompts.
   - Manual edits are limited to configuration, file organization,
     and documentation only.

4. In-Memory Data Constraint
   - All todo data must be stored in memory.
   - No database, file storage, or persistence is allowed.
   - Data resets when the program exits.

5. Scope Control
   - Only Basic Level functionality is allowed in Phase I.
   - Advanced features such as authentication, persistence,
     UI frameworks, or APIs are strictly prohibited.

6. Clean Code Standards
   - Code must be readable, modular, and well-structured.
   - Meaningful naming conventions must be used.
   - Single Responsibility Principle should be followed.

7. Python & Tooling Standards
   - Python version must be 3.13 or higher.
   - UV must be used for environment and dependency management.
   - The application must run as a console-based program.

8. Required Features (Non-Negotiable)
   - Add a task (title and description)
   - View all tasks with completion status
   - Update an existing task
   - Delete a task by ID
   - Mark tasks as complete or incomplete

9. Documentation Discipline
   - All specs must be stored in a specs history folder.
   - README must clearly explain setup and usage.
   - AI instruction files must define how the AI should behave.

10. Evaluation Criteria
    - Correctness of spec-driven process
    - Completeness of required features
    - Clarity and quality of generated code
    - Proper adherence to constraints
    - Clean and understandable project structure

Constitution Authority:
This constitution overrides all other instructions unless
explicitly updated through a new versioned specification.

End of Constitution
===================
```

## Response Text

I have updated the project constitution to version 1.0.0 and synchronized the planning template.

**Commit Message Suggestion:**
`docs: amend constitution to v1.0.0 (initial project setup)`
