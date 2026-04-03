import os
from dotenv import load_dotenv
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

if  GEMINI_API_KEY:
    print("GEMINI_API_KEY is set.")
else:
    print("GEMINI_API_KEY is NOT set.")
        