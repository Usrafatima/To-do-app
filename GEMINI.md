# Hackthon2 Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-01-09

## 1. Project Overview
This project is a full-stack Todo Application. Phase 2 involves transforming the application from a simple, in-memory console application into a robust, multi-user web application with a persistent database, a RESTful API backend, and a modern frontend interface.

## 2. Technology Stack
- **Frontend**: Next.js (TypeScript, React)
- **Backend**: Python, FastAPI
- **ORM**: SQLModel
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: Better Auth (JWT-based)

## 3. System Architecture
The application follows a decoupled, three-tier architecture:
- **Frontend**: A responsive Next.js web application.
- **Backend**: A Python FastAPI application serving a RESTful API.
- **Database**: A Neon Serverless PostgreSQL database.

Authentication is handled via JWTs, ensuring secure and stateless communication between the frontend and backend.

## 3.5. Access Control
The application provides two tiers of access:
- **Public Access**: All users, including anonymous (unauthenticated) users, can create, read, update, and delete TO-DO tasks.
- **Authenticated Access**: Access to the AI chatbot is restricted to users who have authenticated with Google.

## 4. Frontend Specification
The UI design philosophy is modern, clean, and professional.
- **Layout**: A responsive design with a left sidebar for desktop and a top header with a hamburger menu for mobile.
- **Core Features**: User authentication, user-specific task isolation, task CRUD operations, and task completion toggle.
- **UX**: Smooth transitions, animations for user feedback, and loading indicators.

## 5. Commands
- **Python (Backend)**: `cd backend/src; pytest; ruff check .`
- **TypeScript (Frontend)**: `cd frontend; npm test; npm run lint`

## 6. Code Style
- **Python**: Follow standard PEP 8 conventions.
- **TypeScript**: Follow standard community conventions.

## 7. Recent Changes
- **2-phase-2-frontend**: Scaffolding the frontend plan and artifacts.
- **1-fullstack-webapp**: Initial setup of the full-stack project structure and constitution.
- **1-todo-cli-app**: Initial CLI application in Python.

<!-- MANUAL ADDITIONS START -->
You are Gemini acting as a senior software engineer and agentic developer.

You MUST strictly follow a spec-driven development workflow.

Rules you must obey:
1. Never write implementation code unless a specification exists.
2. Always start by asking clarifying questions if requirements are unclear.
3. First generate a formal specification using Spec-Kit Plus style.
4. After spec approval, generate a development plan.
5. Break the plan into small executable tasks.
6. Implement tasks one by one using clean, readable code.
7. Follow the project's established architecture and technology stack.
8. Use the specified versions and libraries.
9. Do not add extra features beyond the approved specification.

Always explain your reasoning briefly before each phase.
<!-- MANUAL ADDITIONS END -->