🚀 TaskPilot: From CLI to Cloud-Native Microservices (Phase 1–5)

TaskPilot started as a humble command-line todo app and evolved into a fully-fledged, event-driven microservices system. This journey showcases progressive innovation, from a simple terminal tool to a resilient Kubernetes-powered architecture.

🌟 Phase 1: The Foundation – CLI & Constitution

The beginning of TaskPilot was all about establishing core logic and project discipline.

Objective: Build a functional CLI todo system and define a project “Constitution.”

Key Features:

Add, view, update, and delete tasks directly in the terminal.

Task prioritization and category tagging.

Project Constitution: rules for spec-driven development and coding standards.

Tech Stack: Python, SQLModel, SQLite

✨ Phase 1 laid the foundation for a structured, spec-driven project.

🌐 Phase 2: Web Transformation – Full-Stack Magic

We brought TaskPilot to the browser, giving it a modern UI and connecting it to APIs.

Objective: Create a frontend-backend architecture with persistent storage.

Key Features:

Frontend: Next.js dashboard with a clean glassmorphism UI.

Backend: FastAPI REST API for task management.

Persistent Storage: Moved from local SQLite to Neon Serverless PostgreSQL.

Authentication: JWT-based user login for secure task isolation.

Tech Stack: Next.js (TypeScript), Tailwind CSS, FastAPI, PostgreSQL

✨ Phase 2 turned TaskPilot into a web-ready, interactive application.

🤖 Phase 3: AI Intelligence – Chatbot Integration

Now TaskPilot could talk to users, thanks to an AI-powered chatbot.

Objective: Add conversational AI to manage tasks.

Key Features:

AI Chatbot: Ask it to add, update, or delete tasks naturally.

HuggingFace integration for real-time AI responses.

Tiered access: public users get basic features; authenticated users unlock AI powers.

Tech Stack: React, HuggingFace Inference API, Google OAuth

✨ Phase 3 made TaskPilot smarter, interactive, and user-friendly.

📦 Phase 4: Infrastructure – Containerization & Reliability

We moved from “works on my machine” to works everywhere.

Objective: Ensure reproducibility using Docker containers.

Key Features:

Separate Dockerfiles for frontend and backend.

docker-compose.yml to spin up the full stack in one command.

Environment isolation and dependency locking.

Automated health checks to verify system status.

Tech Stack: Docker, Docker Compose, Bash

✨ Phase 4 made TaskPilot portable, reliable, and production-ready.

☁️ Phase 5: Advanced Cloud Deployment – Microservices & Kafka

The final phase brought scalability, resilience, and event-driven architecture to TaskPilot.

Objective: Break the monolith into microservices orchestrated with Kubernetes and Dapr.

Key Features:

Microservice Split:

Task Service: Core CRUD operations.

Audit Service: Immutable activity logs.

Reminder Service: Time-based notifications.

Recurring Service: Automates daily/weekly task creation.

Event-Driven Architecture: Strimzi Kafka in KRaft mode with Dapr Pub/Sub.

Resilience: Messages queued in Kafka ensure no data loss if services restart.

Kubernetes Orchestration: Services deployed in Minikube (or any K8s cluster).

Dapr Sidecars: State management, service discovery, and communication abstraction.

Tech Stack: Kubernetes, Dapr, Strimzi Kafka, Redis (State Store), Redpanda

⚠️ Cloud deployment wasn’t completed due to credit card limitations, but the full system is functional locally on Kubernetes, demonstrating phase 5 achievements.

## 📊 Evolution at a Glance

| Feature        | Phase 1 CLI      | Phase 2 Web           | Phase 3 AI Chatbot       | Phase 4 Docker       | Phase 5 Microservices           |
|----------------|-----------------|---------------------|-------------------------|--------------------|--------------------------------|
| Interface      | Terminal        | Browser Dashboard    | Chat Interface           | Web + Docker       | Web + Kubernetes               |
| Architecture   | Monolith        | Client-Server        | Monolith + AI            | Containerized      | Distributed Microservices      |
| Communication  | In-memory       | REST API (Sync)      | REST + AI                | REST + Containers  | Event-Driven Kafka / Dapr      |
| Data Storage   | SQLite          | PostgreSQL           | PostgreSQL + Cache       | Containers + DB   | Dapr State Store (Redis/Postgres) |
| Deployment     | Python Script   | Manual Web Hosting   | Web & AI                 | Docker Compose     | Kubernetes (Local)             |


✨ Summary:
TaskPilot’s journey shows how a simple CLI app can evolve into a modern, event-driven microservices platform while maintaining core functionality, reliability, and scalability. Each phase introduced new capabilities, preparing it for real-world, cloud-native deployment.
