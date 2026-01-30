# Implementation Plan: Phase 5 - Advanced Cloud Deployment

**Branch**: `5-phase-5-advanced-cloud` | **Date**: 2026-01-27 | **Spec**: [specs/5-phase-5-advanced-cloud/spec.md](spec.md)
**Input**: Feature specification from `/specs/5-phase-5-advanced-cloud/spec.md`

## Summary

The goal of Phase 5 is to transition TaskPilot from a containerized monolith to a cloud-native, event-driven microservices architecture. This involves refactoring the backend into logical services (Task, Reminder, Recurring Task, Audit), integrating Dapr for state and pub/sub abstractions, and deploying the entire stack to Kubernetes (Minikube and Cloud) using Kafka-compatible messaging.

## Technical Context

**Language/Version**: Python 3.12 (Backend), Node.js 20 (Frontend)
**Primary Dependencies**: FastAPI, Next.js, Dapr SDK, Kafka (broker), Kubernetes
**Storage**: Dapr State Store (Redis/Postgres abstraction)
**Testing**: pytest, infra-validation scripts
**Target Platform**: Kubernetes (Minikube and Managed Cloud K8s)
**Project Type**: Microservices (Web + multiple APIs)
**Performance Goals**: Asynchronous event completion < 500ms
**Constraints**: 100% AI-assisted code, no manual coding, mandatory Dapr sidecars
**Scale/Scope**: 4 backend microservices, 1 frontend, distributed event-driven flow

## Constitution Check

*GATE: Must pass before proceeding.*

- [x] **Event-Driven Architecture**: Mandatory. Pub/sub via Kafka abstracted by Dapr.
- [x] **Dapr Mandatory**: Mandatory for State, Pub/Sub, and Service Invocation.
- [x] **Kubernetes Mandatory**: Mandatory deployment target.
- [x] **No Manual Coding**: AI-assisted implementation only.
- [x] **Microservices Decomposition**: Decomposed into at least Task and Audit services.
- [x] **Public Submission URL**: Required for cloud deployment.
- [x] **Specs Drive All Changes**: Plan originates from an approved Phase 5 spec.

## Project Structure

### Documentation (this feature)

```text
specs/5-phase-5-advanced-cloud/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
backend/
├── task-service/        # Task API logic
├── reminder-service/    # Reminder logic
├── recurring-service/   # Recurring task logic
└── audit-service/       # Activity tracking logic

frontend/                # Next.js web application

infra/
├── k8s/                 # Kubernetes manifests (deployments, services)
│   ├── base/
│   ├── overlays/
│   │   ├── minikube/
│   │   └── cloud/
├── dapr/                # Dapr component definitions (pubsub, statestore)
└── charts/              # Helm charts (optional but recommended)
```

**Structure Decision**: Option 2: Web application (Decomposed into multiple Backend services + Frontend).

## Complexity Tracking

*No violations.*
