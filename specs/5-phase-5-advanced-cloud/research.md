# Research: Phase 5 Advanced Cloud Deployment

This document consolidates research on the technical decisions required for the Phase 5 infrastructure and architecture.

## Decision 1: Kafka-Compatible Message Broker
- **Decision**: **Redpanda** for local Minikube, **Managed Kafka (e.g., Confluent or Aiven)** or **Redpanda** for cloud.
- **Rationale**: Redpanda provides a lightweight, highly performant, and Kafka-compatible broker that is easier to manage in a Kubernetes environment compared to traditional ZooKeeper-based Kafka.
- **Alternatives considered**: Bitnami Kafka (too heavy for local), Strimzi (great for K8s but complex setup).

## Decision 2: Dapr State Store
- **Decision**: **Redis** for Minikube, **PostgreSQL (Neon)** for Cloud.
- **Rationale**: Redis is the standard local state store for Dapr development. For the cloud, using the existing Neon PostgreSQL via the Dapr PostgreSQL component ensures persistence and reuses existing infrastructure.
- **Alternatives considered**: MongoDB, Azure CosmosDB.

## Decision 3: Service Discovery and Communication
- **Decision**: **Dapr Service Invocation** for synchronous calls, **Dapr Pub/Sub** for asynchronous.
- **Rationale**: Dapr provides location transparency and built-in retries, making service discovery on Kubernetes seamless without hardcoding ClusterIPs.
- **Alternatives considered**: Kubernetes DNS (less portable), Istio Service Mesh (overkill).

## Decision 4: Scheduling and Jobs
- **Decision**: **Dapr Jobs API** or **Dapr Cron Binding**.
- **Rationale**: Using Dapr abstractions for scheduling reminders ensures that the application logic doesn't need to manage complex background worker threads or external schedulers.
- **Alternatives considered**: Celery (complex setup), Kubernetes CronJobs (not granular enough for individual reminders).

## Decision 5: Kubernetes Manifest Management
- **Decision**: **Kustomize** or **Helm**.
- **Rationale**: Kustomize is built into `kubectl` and is excellent for managing environment-specific overlays (Minikube vs. Cloud) without complex templating.
- **Alternatives considered**: Plain YAMLs (hard to manage environments).
