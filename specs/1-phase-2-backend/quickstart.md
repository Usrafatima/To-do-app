# Quickstart: Phase II Backend

## Running the Backend

1.  **Install dependencies**:
    ```bash
    uv pip install -r requirements.txt
    ```
2.  **Run the server**:
    ```bash
    uvicorn src.main:app --reload
    ```
3.  **View the API documentation**:
    Navigate to `http://127.0.0.1:8000/docs` in your browser.

## Running the Tests

1.  **Run the tests**:
    ```bash
    pytest
    ```
