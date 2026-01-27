# TaskPilot: A Smart Productivity Assistant

This project is a full-stack Todo Application, now named "TaskPilot", evolving into a smart productivity assistant. It focuses on implementing real Google authentication for secure multi-user task management and integrates a modern frontend with a FastAPI backend.

## Project Constitution

The project is governed by a constitution that outlines the core principles and rules for development. You can find the constitution here: [.specify/memory/constitution.md](.specify/memory/constitution.md)

## Phase 4: Infrastructure (Docker)

TaskPilot is fully containerized. You can run the entire stack (Frontend, Backend, and Database) using a single command.

### Prerequisites
- Docker
- Docker Compose

### Getting Started

1.  **Clone the repository.**
2.  **Run the application**:
    ```bash
    docker compose up --build
    ```
3.  **Access the services**:
    - **Frontend**: http://localhost:3000
    - **Backend API**: http://localhost:8000
    - **API Docs**: http://localhost:8000/docs

### Infrastructure Validation
A validation script is provided to verify the health of the containers:
```bash
./infra-validation.sh
```

