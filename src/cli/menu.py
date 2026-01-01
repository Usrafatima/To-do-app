# src/cli/menu.py

def display_menu() -> None:
    """Displays the main menu of the application."""
    print("\n" + "="*30)
    print("      Todo App Menu")
    print("="*30)
    print("1. Add a new task")
    print("2. View all tasks")
    print("3. Update a task")
    print("4. Delete a task")
    print("5. Mark a task as complete/incomplete")
    print("6. Exit")
    print("="*30)

def add_task_menu(task_manager) -> None:
    """Handles the UI for adding a new task."""
    title = input("Enter the title for the new task: ")
    if not title:
        print("Title cannot be empty.")
        return
    description = input("Enter the description for the new task: ")
    task = task_manager.add_task(title, description)
    print(f"\nTask '{task.title}' added with ID {task.id}.")

def view_all_tasks_menu(task_manager) -> None:
    """Handles the UI for viewing all tasks."""
    tasks = task_manager.get_all_tasks()
    print("\n" + "="*30)
    print("        All Tasks")
    print("="*30)
    if not tasks:
        print("No tasks to display.")
    else:
        for task in tasks:
            status = "Completed" if task.completed else "Pending"
            print(f"ID: {task.id:<3} | Title: {task.title:<20} | Status: {status}")
            if task.description:
                print(f"    Description: {task.description}")
    print("="*30)

def update_task_menu(task_manager) -> None:
    """Handles the UI for updating a task."""
    try:
        task_id = int(input("Enter the ID of the task to update: "))
        new_title = input("Enter the new title: ")
        new_description = input("Enter the new description: ")
        task = task_manager.update_task(task_id, new_title, new_description)
        if task:
            print(f"Task {task_id} updated successfully.")
        else:
            print(f"Task with ID {task_id} not found.")
    except ValueError:
        print("Invalid ID. Please enter a number.")

def delete_task_menu(task_manager) -> None:
    """Handles the UI for deleting a task."""
    try:
        task_id = int(input("Enter the ID of the task to delete: "))
        if task_manager.delete_task(task_id):
            print(f"Task {task_id} deleted successfully.")
        else:
            print(f"Task with ID {task_id} not found.")
    except ValueError:
        print("Invalid ID. Please enter a number.")

def mark_task_menu(task_manager) -> None:
    """Handles the UI for marking a task as complete or incomplete."""
    try:
        task_id = int(input("Enter the ID of the task to mark as complete/incomplete: "))
        task = task_manager.toggle_task_completion(task_id)
        if task:
            status = "Completed" if task.completed else "Pending"
            print(f"Task {task_id} marked as {status}.")
        else:
            print(f"Task with ID {task_id} not found.")
    except ValueError:
        print("Invalid ID. Please enter a number.")
