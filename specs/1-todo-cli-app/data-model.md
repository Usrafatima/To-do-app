# Data Model: In-Memory Todo Console Application

## Task

Represents a single todo item.

-   **id**: `int` (unique, auto-generated)
-   **title**: `str` (required)
-   **description**: `str` (optional)
-   **completed**: `bool` (default: `False`)

### Validation Rules

-   `title` cannot be empty.
