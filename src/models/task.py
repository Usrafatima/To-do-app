# src/models/task.py

class Task:
    """Represents a single task in the to-do list."""

    def __init__(self, id: int, title: str, description: str, completed: bool = False):
        """
        Initializes a new Task.

        Args:
            id (int): The unique identifier for the task.
            title (str): The title of the task.
            description (str): The description of the task.
            completed (bool, optional): The completion status of the task. Defaults to False.
        """
        self.id = id
        self.title = title
        self.description = description
        self.completed = completed
