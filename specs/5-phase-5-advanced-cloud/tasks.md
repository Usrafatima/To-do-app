# Tasks: Phase 5 - Advanced Cloud Deployment

**Input**: Design documents from `/specs/5-phase-5-advanced-cloud/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic Kubernetes/Dapr structure

- [ ] T001 Create Kubernetes namespace `taskpilot` in `infra/k8s/base/namespace.yaml`
- [ ] T002 Install Dapr control plane on Kubernetes cluster (Minikube/Cloud)
- [ ] T003 Deploy Kafka-compatible broker (Redpanda) in `infra/k8s/base/redpanda.yaml`
- [ ] T004 Configure Dapr Global settings (tracing, logging) in `infra/dapr/config.yaml`
- [ ] T005 Create Kafka topics (`tasks.lifecycle`, `reminders.lifecycle`, `recurring.lifecycle`, `audit.events`)
- [ ] T006 Configure Dapr Pub/Sub component for Kafka in `infra/dapr/pubsub-kafka.yaml`
- [ ] T007 Configure Dapr State Store components (tasks, reminders, recurring, audit) in `infra/dapr/statestore.yaml`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core microservices structure that MUST be complete before user story implementation

- [ ] T008 [P] Define Event Schemas for Kafka topics in `docs/events.md`
- [ ] T009 [P] Initialize `backend/task-service` FastAPI structure with Dapr SDK
- [ ] T010 [P] Initialize `backend/audit-service` FastAPI structure with Dapr SDK
- [ ] T011 [P] Initialize `backend/reminder-service` FastAPI structure with Dapr SDK
- [ ] T012 [P] Initialize `backend/recurring-service` FastAPI structure with Dapr SDK

**Checkpoint**: Foundation ready - microservices implementation can now begin

---

## Phase 3: User Story 1 - Event-Driven Task Management (Priority: P1) 🎯 MVP

**Goal**: Implement core task CRUD with Dapr state and asynchronous audit logging via Kafka.

**Independent Test**: Create a task via Task API and verify its state in Dapr and its entry in the Audit Service activity log.

### Implementation for User Story 1

- [ ] T013 [US1] Implement Task model with Dapr state store integration in `backend/task-service/src/models/task.py`
- [ ] T014 [US1] Implement Task API endpoints (POST, PUT, GET) in `backend/task-service/src/api/tasks.py`
- [ ] T015 [US1] Implement `TaskCreated` and `TaskCompleted` event publication in `backend/task-service/src/services/event_publisher.py`
- [ ] T016 [US1] Implement Audit Service consumer for Task lifecycle events in `backend/audit-service/src/services/event_handler.py`
- [ ] T017 [US1] Implement Activity record storage in Audit Service using Dapr state store in `backend/audit-service/src/models/activity.py`
- [ ] T018 [US1] Create Kubernetes Deployment and Service for Task API in `infra/k8s/base/task-api/`
- [ ] T019 [US1] Create Kubernetes Deployment and Service for Audit Service in `infra/k8s/base/audit-service/`

**Checkpoint**: User Story 1 functional - tasks are persisted and audited asynchronously.

---

## Phase 4: User Story 2 - Automated Reminders and Recurrence (Priority: P2)

**Goal**: Implement one-time reminders and recurring task generation using Dapr Jobs/Timers.

**Independent Test**: Set a reminder for a task and verify a `ReminderTriggered` event is emitted; define a recurring task and verify new instances are generated.

### Implementation for User Story 2

- [ ] T020 [US2] Implement Reminder model and Dapr Timer/Job logic in `backend/reminder-service/src/models/reminder.py`
- [ ] T021 [US2] Implement Reminder Service event handler to subscribe to `TaskCreated` in `backend/reminder-service/src/services/event_handler.py`
- [ ] T022 [US2] Implement `ReminderTriggered` event publication in `backend/reminder-service/src/services/event_publisher.py`
- [ ] T023 [US2] Implement Recurring Task model and schedule logic in `backend/recurring-service/src/models/recurring.py`
- [ ] T024 [US2] Implement Recurring Task generator logic (Dapr Cron binding) in `backend/recurring-service/src/services/task_generator.py`
- [ ] T025 [US2] Create Kubernetes Deployment for Reminder Service in `infra/k8s/base/reminder-service/`
- [ ] T026 [US2] Create Kubernetes Deployment for Recurring Task Service in `infra/k8s/base/recurring-service/`

**Checkpoint**: User Story 2 functional - reminders and recurring tasks are automated.

---

## Phase 5: User Story 3 - Resilient Activity Timeline (Priority: P3)

**Goal**: Ensure audit log durability and provide a timeline view for the user.

**Independent Test**: Shutdown Audit service, perform task actions, restart Audit service, and verify timeline is up-to-date.

### Implementation for User Story 3

- [ ] T027 [US3] Implement Activity Timeline retrieval API in Audit Service `backend/audit-service/src/api/timeline.py`
- [ ] T028 [US3] Verify Kafka event durability by simulating Audit Service downtime on Minikube
- [ ] T029 [US3] Add deduplication logic to Audit Service event handler to handle potential duplicate Kafka messages

**Checkpoint**: User Story 3 functional - audit log is resilient and accessible.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Frontend integration, cloud deployment, and final validation.

- [ ] T030 [P] Configure Dapr Service Invocation between Frontend and Task API in `frontend/src/lib/apiClient.ts`
- [ ] T031 [P] Create Kubernetes Deployment and Service for Frontend in `infra/k8s/base/frontend/`
- [ ] T032 Configure Kubernetes Ingress for public frontend access in `infra/k8s/base/ingress.yaml`
- [ ] T033 Create Kustomize overlays for Minikube and Cloud in `infra/k8s/overlays/`
- [ ] T034 Set up GitHub Actions workflow for automated Cloud K8s deployment in `.github/workflows/deploy.yaml`
- [ ] T035 [P] Implement health check endpoints in all backend services for Kubernetes Liveness/Readiness probes
- [ ] T036 Final end-to-end validation on Cloud cluster using `quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Must complete first to provide K8s/Dapr/Kafka infrastructure.
- **Foundational (Phase 2)**: Depends on Phase 1 - establishes the code structure for all services.
- **User Stories (Phase 3-5)**: All depend on Phase 2 completion.
  - US1 (Phase 3) is the MVP and should be completed first.
  - US2 and US3 can proceed after US1 is functional.
- **Polish (Phase 6)**: Final integration and deployment tasks.

### Within Each User Story

- Models must be implemented before API endpoints.
- Event publishers in Task API must exist before consumers in Audit/Reminder services can be tested.
- Kubernetes manifests should be tested on Minikube after service implementation is complete.

### Parallel Opportunities

- Initialization of the 4 microservices (T009-T012) can run in parallel.
- Frontend deployment configuration (T031) can run in parallel with backend service implementation.
- Different backend services can be developed in parallel once the event schemas (T008) are defined.

---

## Parallel Example: User Story 1

```bash
# Initialize multiple services simultaneously:
Task: "Initialize backend/task-service FastAPI structure with Dapr SDK"
Task: "Initialize backend/audit-service FastAPI structure with Dapr SDK"

# Implement core models:
Task: "Implement Task model with Dapr state store integration in backend/task-service/src/models/task.py"
Task: "Implement Activity record storage in Audit Service using Dapr state store in backend/audit-service/src/models/activity.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (K8s, Dapr, Kafka)
2. Complete Phase 2: Foundational (Code structure)
3. Complete Phase 3: User Story 1 (Task API + Audit Service)
4. **STOP and VALIDATE**: Verify task creation results in an audit log entry on Minikube.

### Incremental Delivery

1. Foundation Ready (Phase 1 + 2)
2. Tasking & Auditing Ready (Phase 3)
3. Automation Ready (Phase 4: Reminders & Recurrence)
4. Resiliency & UI Ready (Phase 5 + 6)
