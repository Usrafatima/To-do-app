# Phase 4 Quickstart: Docker & Development

## 1. Running with Docker (Recommended)
```bash
# Start the entire stack
docker-compose up --build

# Backend will be at http://localhost:8000
# Frontend will be at http://localhost:3000
```

## 2. Manual Development
**Backend:**
```bash
cd backend
source .venv/bin/activate
uvicorn src.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 3. Testing Search
You can test the new search API via CURL:
```bash
curl "http://localhost:8000/tasks?q=urgent&priority=High"
```
