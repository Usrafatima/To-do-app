from typing import Dict, Any, Optional, List
from sqlmodel import Session
from ..models import User, Task
from ..services import task_service

class TodoAgent:
    def _resolve_task(self, intent_data: Dict[str, Any], user: User, session: Session) -> Optional[Task]:
        """
        Resolves a task based on ID or text content.
        If no ID or text is provided, or if they don't match, 
        it falls back to the most recently modified task to support "this task" context.
        """
        task_id = intent_data.get("task_id")
        task_text = intent_data.get("task")

        # 1. Try ID
        if task_id:
            task = session.get(Task, task_id)
            if task and task.user_id == user.id:
                return task
        
        tasks = task_service.get_tasks_for_user(user, session)
        
        # 2. Try Text
        if task_text:
            # Find exact match first
            for t in tasks:
                if t.text.lower() == task_text.lower():
                    return t
            
            # Find partial match
            matches = [t for t in tasks if task_text.lower() in t.text.lower()]
            if len(matches) == 1:
                return matches[0]
            
            if len(matches) > 1:
                 matches.sort(key=lambda x: x.id, reverse=True)
                 return matches[0]

        # 3. Fallback: If intent implies a specific task but none identified, 
        # and no text was provided (e.g., "complete this task"), use the most recently updated one.
        # We only do this if we haven't found a task yet.
        # Assuming tasks are ordered by ID or we can sort them.
        if not task_id and not task_text and tasks:
             # Sort by ID descending (proxy for creation/update time if we don't have updated_at)
             tasks.sort(key=lambda x: x.id, reverse=True)
             return tasks[0]

        return None

    def _get_pending_count(self, user: User, session: Session) -> int:
        """
        Helper to get count of pending (incomplete) tasks.
        """
        tasks = task_service.get_tasks_for_user(user, session)
        return len([t for t in tasks if not t.is_completed])

    def execute(self, intent_data: Dict[str, Any], user: User, session: Session) -> Dict[str, Any]:
        """
        Executes the todo action. Returns a result dict (status, data).
        """
        intent = intent_data.get("intent")
        
        try:
            if intent == "greeting":
                return {"status": "success", "data": {}}
            
            elif intent == "help":
                return {"status": "success", "data": {}}

            elif intent == "list_tasks":
                tasks = task_service.get_tasks_for_user(user, session)
                task_list_str = "\n".join([f"- {t.text} ({'Done' if t.is_completed else 'Pending'})" for t in tasks])
                return {"status": "success", "data": {"tasks": task_list_str, "count": len(tasks)}}

            elif intent == "add_task":
                title = intent_data.get("task")
                if not title:
                    return {"status": "error", "message": "What task would you like to add?"}
                task = task_service.create_new_task(Task(text=title, user_id=user.id), user, session)
                pending_count = self._get_pending_count(user, session)
                return {"status": "success", "data": {"task": task.text, "id": task.id, "pending_count": pending_count}}

            elif intent == "delete_task":
                # Special logic for delete to handle ambiguity explicitly as per requirements
                task_id = intent_data.get("task_id")
                task_text = intent_data.get("task")
                
                tasks = task_service.get_tasks_for_user(user, session) # Get all tasks once to resolve

                target_task = None
                
                # Resolve Target
                if task_id:
                     target_task = session.get(Task, task_id)
                     if not target_task or target_task.user_id != user.id:
                         return {"status": "error", "message": "I couldn't find that task ID."}
                elif task_text:
                    # Exact matches
                    exact_matches = [t for t in tasks if t.text.lower() == task_text.lower()]
                    if len(exact_matches) == 1:
                        target_task = exact_matches[0]
                    else:
                        # Partial matches
                        matches = [t for t in tasks if task_text.lower() in t.text.lower()]
                        if len(matches) == 0:
                            return {"status": "error", "message": f"I couldn't find any task related to '{task_text}'."}
                        elif len(matches) == 1:
                            target_task = matches[0]
                        else:
                            return {"status": "error", "message": f"I found {len(matches)} tasks with '{task_text}'. Which one should I delete?"}
                elif not task_text and tasks:
                     # Fallback to last task
                     tasks.sort(key=lambda x: x.id, reverse=True)
                     target_task = tasks[0]
                else:
                     return {"status": "error", "message": "Which task would you like to delete?"}

                # Delete
                if target_task:
                     task_service.delete_task_for_user(target_task.id, user, session)
                     pending_count = self._get_pending_count(user, session)
                     return {"status": "success", "data": {"id": target_task.id, "pending_count": pending_count}}
                
                return {"status": "error", "message": "Something went wrong finding the task."}

            elif intent == "update_task":
                task = self._resolve_task(intent_data, user, session)
                if not task:
                    return {"status": "error", "message": "I'm not sure which task you want to update."}
                
                new_title = intent_data.get("new_task")
                
                if not new_title:
                     return {"status": "error", "message": "What should I rename the task to?"}

                update_data = {"text": new_title}
                updated_task = task_service.update_task_for_user(task.id, update_data, user, session)
                # Update doesn't change pending count, but we can return it if needed. 
                # Requirement says "Task added, deleted, completed, marked incomplete" trigger notifications with count.
                # Update usually doesn't need a count notification unless status changed? 
                # The prompt listed "Task added", "Task deleted", "Task completed". It didn't explicitly list "Task updated" in strict rules #1.
                # Rule #1: "Notifications must trigger ONLY when: A task is added, deleted, completed, marked incomplete".
                # So "Update" should NOT have the count?
                # "Notification Content: Every notification MUST include: Total number of pending tasks"
                # If update triggers a notification (which it does "Updated! ..."), does it need the count?
                # Strict Rule 1 implies Update should NOT trigger a "Notification" in the sense of the strict rules?
                # But we still need to say "Task updated". 
                # I'll leave Update as is (no count) since it's not in Rule 1 list.
                return {"status": "success", "data": {"task": updated_task.text, "id": updated_task.id}}

            elif intent == "complete_task":
                task = self._resolve_task(intent_data, user, session)
                if not task:
                    return {"status": "error", "message": "Which task would you like to complete?"}

                updated_task = task_service.update_task_for_user(task.id, {"is_completed": True}, user, session)
                pending_count = self._get_pending_count(user, session)
                return {"status": "success", "data": {"task": updated_task.text, "id": updated_task.id, "pending_count": pending_count}}

            elif intent == "incomplete_task":
                task = self._resolve_task(intent_data, user, session)
                if not task:
                     return {"status": "error", "message": "Which task would you like to mark as incomplete?"}

                updated_task = task_service.update_task_for_user(task.id, {"is_completed": False}, user, session)
                pending_count = self._get_pending_count(user, session)
                return {"status": "success", "data": {"task": updated_task.text, "id": updated_task.id, "pending_count": pending_count}}

            else:
                 return {"status": "ignored", "message": "I didn't catch that. Could you say it again?"}

        except Exception as e:
            return {"status": "error", "message": str(e)}
