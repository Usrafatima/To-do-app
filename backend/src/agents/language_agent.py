import re

class LanguageAgent:
    def detect_language(self, text: str) -> str:
        """
        Detects the language of the input text based on strict rules:
        1. Urdu Script (\u0600–\u06FF) -> 'ur'
        2. Roman Urdu Keywords -> 'roman_ur'
        3. Default -> 'en'
        """
        if not text:
            return "en"

        # 1. Check for Urdu Script
        if re.search(r'[\u0600-\u06FF]', text):
            return "ur"

        # 2. Check for Roman Urdu Keywords
        # Simple tokenization
        tokens = set(re.sub(r'[^\w\s]', '', text.lower()).split())
        
        strong_roman_urdu_indicators = {
            "karo", "hai", "hain", "ka", "ki", "ke", "ko", "mukammal",
            "hatao", "badlo", "shamil", "karna", "chahiye", "mujhe", "kya", "mein", "par",
            "karen", "krdo", "krna"
        }
        
        if tokens.intersection(strong_roman_urdu_indicators):
            return "roman_ur"
            
        return "en"
