# Phase 4 Data Model: Task Organization

## 1. Database Schema (SQLModel)

### Task Table Update
| Field | Type | Description |
| :--- | :--- | :--- |
| `priority` | `Enum (Low, Medium, High, Critical)` | Task importance level. |
| `tags` | `List[string] (JSON)` | Array of tags for categorization. |
| `due_date` | `DateTime (Optional)` | Timestamp for task deadline. |

```python
class Priority(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"

class Task(BaseModel, table=True):
    # ... existing fields ...
    priority: Priority = Field(default=Priority.MEDIUM)
    tags: Optional[List[str]] = Field(default=None, sa_column=Column(JSON))
    due_date: Optional[datetime] = Field(default=None)
```

## 2. API Contracts

### GET /tasks
**Query Parameters:**
- `q`: string (search term)
- `priority`: string (filter)
- `status`: string (completed/incomplete)
- `sort`: string (due_date_asc, due_date_desc)

### PUT /tasks/{id}
**Payload:**
```json
{
  "priority": "High",
  "tags": ["Work", "Urgent"],
  "due_date": "2026-01-25T10:00:00Z"
}
```

## 3. Frontend Interfaces (TypeScript)
```typescript
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Task {
  // ...
  priority: Priority;
  tags: string[];
  due_date?: string;
}
```
