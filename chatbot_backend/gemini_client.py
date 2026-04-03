import os
import google.generativeai as genai
from faq_loader import get_faq_context

# ── Configure Gemini once at import time ──────────────────────────────────────
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])

SYSTEM_PROMPT = f"""You are a helpful customer support assistant for MNGL (Maharashtra Natural Gas Limited), \
a piped natural gas utility company serving Pune, India.

Your role is to answer questions about:
- PNG (Piped Natural Gas) connections, installation, billing, safety, and charges
- CNG (Compressed Natural Gas) for vehicles
- MNGL policies, KYC, grievances, and support

Use the FAQ knowledge base below as your PRIMARY source of truth. When answering:
- Be concise, friendly, and professional
- Always respond in the context of MNGL services
- If the answer is covered by the FAQ, use that information accurately
- If a question is NOT covered by the FAQ, politely say so and direct the user to call MNGL customer care at 1800-266-2696
- Never make up charges, policies, or figures — only state what is in the FAQ
- For safety or emergency questions, always mention the 24x7 emergency helpline

--- MNGL FAQ KNOWLEDGE BASE ---
{get_faq_context()}
--- END OF KNOWLEDGE BASE ---"""


def build_gemini_model() -> genai.GenerativeModel:
    return genai.GenerativeModel(
        model_name="gemini-2.5-flash",
        system_instruction=SYSTEM_PROMPT,
    )


def ask_gemini(messages: list[dict]) -> str:
    """
    Send a conversation to Gemini and return the assistant's reply.

    messages format (same as the REST API contract):
        [
          {"role": "user",      "content": "What is the installation charge?"},
          {"role": "assistant", "content": "It is Rs. 6000 ..."},
          {"role": "user",      "content": "Is there a refundable part?"},
        ]
    """
    model = build_gemini_model()

    # Convert our generic role names → Gemini's role names
    # Gemini uses "user" and "model" (not "assistant")
    history = []
    for msg in messages[:-1]:           # all but the last message go into history
        history.append({
            "role":  "model" if msg["role"] == "assistant" else "user",
            "parts": [msg["content"]],
        })

    chat = model.start_chat(history=history)
    response = chat.send_message(messages[-1]["content"])
    return response.text



