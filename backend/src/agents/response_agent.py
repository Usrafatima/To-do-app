from typing import Dict, Any

class ResponseAgent:
    def get_response(self, intent: str, status: str, lang: str, data: Dict[str, Any] = None) -> str:
        """
        Generates a response based on intent, status, and language.
        Strictly follows notification rules for count and formatting.
        """
        if data is None:
            data = {}
            
        pending_count = data.get("pending_count")
        task_name = data.get("task", "task")
        
        # Helper to format count message
        def get_count_msg(count, lang_code):
            if count == 0:
                if lang_code == "en": return "All tasks completed 🎉"
                if lang_code == "roman_ur": return "Saaray tasks mukammal ho gaye 🎉"
                if lang_code == "ur": return "تمام کام مکمل ہو گئے 🎉"
            else:
                s = "s" if count != 1 else ""
                if lang_code == "en": return f"{count} task{s} remaining."
                if lang_code == "roman_ur": return f"Ab {count} tasks baqi hain."
                if lang_code == "ur": return f"اب {count} ٹاسک باقی ہیں۔"
        
        # Templates
        # Structure: Base message + Count message
        
        if status == "error":
            # Error handling remains simple
            lang_templates = {
                "en": "Something went wrong.",
                "roman_ur": "Kuch masla hogaya.",
                "ur": "کچھ غلط ہو گیا۔"
            }
            return data.get("message", lang_templates.get(lang, lang_templates["en"]))

        if status == "success":
            count_msg = get_count_msg(pending_count, lang) if pending_count is not None else ""

            if intent == "add_task":
                if lang == "en": return f"Task added. {count_msg}"
                if lang == "roman_ur": return f"Task add ho gaya. {count_msg}"
                if lang == "ur": return f"ٹاسک شامل ہو گیا ہے۔ {count_msg}"
            
            elif intent == "delete_task":
                if lang == "en": return f"Task deleted. {count_msg}"
                if lang == "roman_ur": return f"Task delete ho gaya. {count_msg}"
                if lang == "ur": return f"ٹاسک ختم ہو گیا ہے۔ {count_msg}"
            
            elif intent == "complete_task":
                if lang == "en": return f"Task completed 🎉 {count_msg}"
                if lang == "roman_ur": return f"Task mukammal 🎉 {count_msg}"
                if lang == "ur": return f"ٹاسک مکمل 🎉 {count_msg}"

            elif intent == "incomplete_task":
                if lang == "en": return f"Task marked incomplete. {count_msg}"
                if lang == "roman_ur": return f"Task incomplete mark ho gaya. {count_msg}"
                if lang == "ur": return f"ٹاسک نامکمل مارک ہو گیا ہے۔ {count_msg}"

            elif intent == "update_task":
                # Updates don't require strict count per rules, keep conversational
                if lang == "en": return f"Updated! The task is now '{task_name}'."
                if lang == "roman_ur": return f"Update ho gaya! Ab task '{task_name}' hai."
                if lang == "ur": return f"اپ ڈیٹ ہو گیا! کام اب '{task_name}' ہے۔"
            
            elif intent == "list_tasks":
                tasks_str = data.get("tasks", "")
                if not tasks_str:
                     if lang == "en": return "You don't have any tasks yet."
                     if lang == "roman_ur": return "Aapke paas abhi koi tasks nahi hain."
                     if lang == "ur": return "آپ کے پاس ابھی کوئی کام نہیں ہے۔"
                
                header = {
                    "en": "Here are your tasks:\n",
                    "roman_ur": "Ye rahe aapke tasks:\n",
                    "ur": "یہ رہے آپ کے کام:\n"
                }
                return header.get(lang, header["en"]) + tasks_str

            elif intent == "greeting":
                if lang == "en": return "Hi there! How can I help you with your tasks today?"
                if lang == "roman_ur": return "Assalam-o-Alaikum! Main aapki tasks mein kaise madad kar sakta hoon?"
                if lang == "ur": return "السلام علیکم! میں آج آپ کے کاموں میں آپ کی کیسے مدد کر سکتا ہوں؟"

            elif intent == "help":
                if lang == "en": return "I can help you manage your tasks. Try 'Add a task' or 'Delete task'."
                if lang == "roman_ur": return "Main tasks manage karne mein madad kar sakta hoon. 'Task add karo' ya 'delete karo' try karein."
                if lang == "ur": return "میں آپ کے کاموں کا انتظام کرنے میں مدد کر سکتا ہوں۔"

        return "..."
