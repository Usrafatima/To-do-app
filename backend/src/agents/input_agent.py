class InputAgent:
    def process(self, text: str) -> str:
        """
        Cleans the input text.
        """
        if not text:
            return ""
        return text.strip()
