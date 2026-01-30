# Feature Specification: Phase 5 - Advanced Cloud Deployment

**Feature Branch**: `5-phase-5-advanced-cloud`  
**Created**: 2026-01-27  
**Status**: Draft  
**Input**: User description: "PHASE 5 — SPECIFY Advanced Cloud Deployment..."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Event-Driven Task Management (Priority: P1)

As a user, I want my task actions (creation, completion) to be handled reliably and recorded across the system, so that my activity history is always accurate and updated without lag in the main interface.

**Why this priority**: This is the core architectural shift. Moving to Dapr state and pub/sub ensures the foundational "cloud-native" requirement is met.

**Independent Test**: Can be tested by creating a task in the UI and verifying:
1. The task is stored in the Dapr state store.
2. An audit log entry appears in the Audit Service timeline, triggered by an asynchronous event.

**Acceptance Scenarios**:

1. **Given** the Task Service is running with a Dapr sidecar, **When** I create a new task, **Then** the task state is persisted via Dapr and a `TaskCreated` event is published to Kafka.
2. **Given** the Audit Service is subscribed to `TaskCreated` events, **When** a task is created, **Then** an immutable activity record is created in the audit log.

---

### User Story 2 - Automated Reminders and Recurrence (Priority: P2)

As a busy professional, I want to set one-time reminders and define recurring tasks so that I don't miss important deadlines and don't have to manually recreate frequent tasks.

**Why this priority**: Demonstrates the "Scheduling and Jobs" requirement of Dapr and adds significant user value beyond basic CRUD.

**Independent Test**: Can be tested by setting a reminder for 1 minute in the future and verifying the system emits a `ReminderTriggered` event and notifies the UI/Audit log.

**Acceptance Scenarios**:

1. **Given** a task with a reminder time, **When** that time is reached, **Then** a Dapr-managed job/timer triggers a `ReminderTriggered` event.
2. **Given** a recurring task definition, **When** the scheduled interval occurs, **Then** the Recurring Task Service generates a new task instance via a `RecurringTaskGenerated` event.

---

### User Story 3 - Resilient Activity Timeline (Priority: P3)

As a user, I want to see a full history of my productivity actions (audit log) that survives system restarts and service failures, so I can trust the integrity of my data.

**Why this priority**: Validates the "Audit / Activity Service" requirement and the durability of the event system.

**Independent Test**: Can be tested by stopping the Audit service, creating several tasks, then restarting the Audit service and verifying all missing events are processed from the Kafka-compatible broker.

**Acceptance Scenarios**:

1. **Given** the Audit Service is offline, **When** tasks are modified, **Then** events are queued in Kafka.
2. **Given** the Audit Service comes back online, **When** it starts up, **Then** it processes all queued events and updates the activity log.

---

### Edge Cases

- **Event Duplication**: How does the system handle a `TaskCreated` event being received twice? (Expected: Audit service should ignore duplicate IDs).
- **Service Unavailability**: What happens if the State Store is temporarily down? (Expected: Dapr/Service should retry with exponential backoff).
- **Clock Skew**: How are reminders handled if container clocks are slightly out of sync? (Expected: Reliance on a centralized Dapr Job/Cron mechanism).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Task API MUST persist task data exclusively using Dapr State Management APIs.
- **FR-002**: Services MUST communicate asynchronously using Dapr Pub/Sub with a Kafka-compatible broker.
- **FR-003**: Audit Service MUST maintain a separate, immutable activity log derived from system-wide events.
- **FR-004**: Reminder Service MUST trigger events at user-defined times using Dapr Jobs or Cron bindings.
- **FR-005**: Recurring Task Service MUST generate new tasks automatically based on defined patterns (Daily, Weekly).
- **FR-006**: Frontend MUST interact with logical services only via Dapr Service Invocation or standard API endpoints (no direct Kafka/Dapr API access).
- **FR-007**: System MUST be deployable to Kubernetes (Minikube and Cloud) using identical application images.
- **FR-008**: System MUST provide health check endpoints accessible by Kubernetes Probes.

### Key Entities *(include if feature involves data)*

- **Task**: ID, Content, Status, UserID, Timestamp, State (Managed by Dapr State Store).
- **Reminder**: TaskID, TriggerTime, Status (Scheduled/Triggered).
- **RecurringDefinition**: TemplateTask, SchedulePattern (Cron string), LastGeneratedDate.
- **ActivityRecord**: EventType, EntityID, Payload, CreatedAt (Immutable).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: End-to-end task creation to audit log entry completion in under 500ms (asynchronous).
- **SC-002**: 100% of internal service communication uses standardized service discovery and abstraction layers (no hardcoded IPs or internal DNS names).
- **SC-003**: System demonstrates "eventual consistency" by successfully processing queued messages within 10 seconds of service recovery.
- **SC-004**: Frontend application is accessible via a public SSL-secured URL and fully functional.
- **SC-005**: Infrastructure-as-code manifests allow deployment from zero to a fully functional cluster in under 5 minutes.
- **SC-006**: 100% of application state is persisted through a standardized state abstraction layer, allowing for pluggable storage backends.
