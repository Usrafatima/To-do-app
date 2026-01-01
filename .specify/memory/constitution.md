# In-Memory Todo Console Application (Phase I) Constitution
<!-- 
Sync Impact Report
Version change: 0.0.0 → 1.0.0
Modified principles: ALL
Added sections: ALL
Removed sections: None
Templates requiring updates:
- ✅ .specify/templates/plan-template.md
- ✅ .specify/templates/spec-template.md
- ✅ .specify/templates/tasks-template.md
-->

## Core Principles

### I. Spec-Driven Development
All development must begin with a written specification. No implementation is allowed without an approved spec. Changes must be reflected by updating the spec first.

### II. Agentic Workflow
Development follows this order: Specification → Plan → Task Breakdown → Implementation. The AI assistant is responsible for generating plans, tasks, and implementation based strictly on the spec.

### III. No Manual Coding Rule
Human contributors must not write application code directly. All source code must be generated via AI prompts. Manual edits are limited to configuration, file organization, and documentation only.

### IV. In-Memory Data Constraint
All todo data must be stored in memory. No database, file storage, or persistence is allowed. Data resets when the program exits.

### V. Scope Control
Only Basic Level functionality is allowed in Phase I. Advanced features such as authentication, persistence, UI frameworks, or APIs are strictly prohibited.

### VI. Clean Code Standards
Code must be readable, modular, and well-structured. Meaningful naming conventions must be used. Single Responsibility Principle should be followed.

### VII. Python & Tooling Standards
Python version must be 3.13 or higher. UV must be used for environment and dependency management. The application must run as a console-based program.

### VIII. Required Features (Non-Negotiable)
- Add a task (title and description)
- View all tasks with completion status
- Update an existing task
- Delete a task by ID
- Mark tasks as complete or incomplete

### IX. Documentation Discipline
All specs must be stored in a specs history folder. README must clearly explain setup and usage. AI instruction files must define how the AI should behave.

### X. Evaluation Criteria
- Correctness of spec-driven process
- Completeness of required features
- Clarity and quality of generated code
- Proper adherence to constraints
- Clean and understandable project structure

## Governance
This constitution overrides all other instructions unless explicitly updated through a new versioned specification.

**Version**: 1.0.0 | **Ratified**: 2026-01-02 | **Last Amended**: 2026-01-02