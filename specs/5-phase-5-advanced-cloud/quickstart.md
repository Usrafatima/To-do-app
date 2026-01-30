# Quickstart: Phase 5 Advanced Cloud

## Deployment Flow

### 1. Local (Minikube)
1.  **Start Minikube**: `minikube start`
2.  **Init Dapr**: `dapr init -k`
3.  **Deploy Broker**: `kubectl apply -f infra/k8s/base/redpanda.yaml`
4.  **Deploy Dapr Components**: `kubectl apply -f infra/dapr/`
5.  **Deploy TaskPilot**: `kubectl apply -k infra/k8s/overlays/minikube/`

### 2. Cloud
1.  **Context Setup**: `kubectl config use-context <cloud-context>`
2.  **Deploy TaskPilot**: `kubectl apply -k infra/k8s/overlays/cloud/`

## Verifying Event Flow
1.  **Create a Task**: `POST /api/tasks`
2.  **Check Audit Logs**: `kubectl logs -l app=audit-service -c audit-service`
3.  **Expected Log**: `Received event: TaskCreated with payload {...}`
