# src/services/task_manager.py

class TaskManager:
    """Manages the collection of tasks."""

    def __init__(self):
        """Initializes a new TaskManager."""
        self._tasks: list = []
        self._next_id: int = 1

    def add_task(self, title: str, description: str):
        """
        Adds a new task to the list.

        Args:
            title (str): The title of the task.
            description (str): The description of the task.

        Returns:
            Task: The newly created task.
        """
        from models.task import Task
        task = Task(self._next_id, title, description)
        self._tasks.append(task)
        self._next_id += 1
        return task

    def get_all_tasks(self) -> list:
        """
        Gets all tasks.

        Returns:
            list: A list of all tasks.
        """
        return self._tasks

    def update_task(self, task_id: int, new_title: str, new_description: str):
        """
        Updates an existing task.

        Args:
            task_id (int): The ID of the task to update.
            new_title (str): The new title for the task.
            new_description (str): The new description for the task.

        Returns:
            Task or None: The updated task, or None if the task was not found.
        """
        for task in self._tasks:
            if task.id == task_id:
                task.title = new_title
                task.description = new_description
                return task
        return None

    def delete_task(self, task_id: int) -> bool:
        """
        Deletes a task.

        Args:
            task_id (int): The ID of the task to delete.

        Returns:
            bool: True if the task was deleted, False otherwise.
        """
        task_to_delete = None
        for task in self._tasks:
            if task.id == task_id:
                task_to_delete = task
                break
        if task_to_delete:
            self._tasks.remove(task_to_delete)
            return True
        return False

    def toggle_task_completion(self, task_id: int):
        """
        Toggles the completion status of a task.

        Args:
            task_id (int): The ID of the task to toggle.

        Returns:
            Task or None: The updated task, or None if the task was not found.
        """
        for task in self._tasks:
            if task.id == task_id:
                task.completed = not task.completed
                return task
        return None
