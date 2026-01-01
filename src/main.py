from cli.menu import display_menu, add_task_menu, view_all_tasks_menu, update_task_menu, delete_task_menu, mark_task_menu
from services.task_manager import TaskManager


def main() -> None:
    """The main function of the application."""
    task_manager = TaskManager()
    while True:
        display_menu()
        choice = input("Enter your choice: ")
        if choice == "1":
            add_task_menu(task_manager)
        elif choice == "2":
            view_all_tasks_menu(task_manager)
        elif choice == "3":
            update_task_menu(task_manager)
        elif choice == "4":
            delete_task_menu(task_manager)
        elif choice == "5":
            mark_task_menu(task_manager)
        elif choice == "6":
            break
        else:
            print("Invalid choice, please try again.")


if __name__ == "__main__":
    main()

