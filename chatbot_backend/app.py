import os
import csv
import re
import uuid

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from langchain_mistralai import ChatMistralAI, MistralAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import CSVLoader
from langchain_community.tools import DuckDuckGoSearchRun
from langchain_core.tools import tool
from langgraph.prebuilt import create_react_agent

load_dotenv()

CSV_FILENAME = os.path.join(os.path.dirname(__file__), "mngl_faq.csv")

# ---------------------------------------------------------------------------
# Global singletons – initialised once at startup
# ---------------------------------------------------------------------------
_retriever = None
_agent = None

SYSTEM_PROMPT = """
You are the MNGL virtual assistant. Answer like a helpful customer-care agent.

Formatting rules:
- Start with a short direct answer, not a long introduction.
- Use clear section titles only when useful.
- Prefer short bullet points with one idea per line.
- Keep answers concise: usually 5 to 8 lines, unless the user asks for detail.
- Do not use markdown tables, bold markers, headings with ###, or decorative markdown.
- Use plain labels like "Eligibility:" instead of "**Eligibility**:".
- Do not add decorative separators.
- For step-by-step process questions, use:
  Quick Answer
  What You Need
  Steps
  Important Note
- Use MNGL FAQ facts when available. If something is not in the FAQ, say that
  MNGL customer care can confirm the latest process.
""".strip()

# In-memory conversation history: { sessionId: [langchain message tuples] }
_sessions: dict[str, list] = {}


def clean_answer_text(text: str) -> str:
    """Remove markdown noise so chat replies render cleanly as plain text."""
    text = re.sub(r"\*\*(.*?)\*\*", r"\1", text)
    text = re.sub(r"^#{1,6}\s*", "", text, flags=re.MULTILINE)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


# ---------------------------------------------------------------------------
# LangChain tools
# ---------------------------------------------------------------------------

@tool
def mngl_faq_search(query: str) -> str:
    """Search for MNGL info including PNG Basics, Billing, Payments, Installation, and CNG Safety."""
    global _retriever
    docs = _retriever.invoke(query)
    return "\n\n".join([d.page_content for d in docs]) if docs else "No results found."


@tool
def web_search(query: str) -> str:
    """Useful for general knowledge outside MNGL internal data, e.g. crude oil prices or competitor info."""
    return DuckDuckGoSearchRun().run(query)


# ---------------------------------------------------------------------------
# FastAPI app
# ---------------------------------------------------------------------------

app = FastAPI(title="MNGL Chatbot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AskRequest(BaseModel):
    question: str
    sessionId: str | None = None   # client echoes back the id it received


class AskResponse(BaseModel):
    answer: str
    sessionId: str


# ---------------------------------------------------------------------------
# Startup – build embeddings & agent once
# ---------------------------------------------------------------------------

@app.on_event("startup")
async def startup():
    global _retriever, _agent

    print("--- STARTING MNGL AI ASSISTANT ---")

    if not os.getenv("MISTRAL_API_KEY"):
        raise RuntimeError(
            "❌ MISTRAL_API_KEY not found. "
            "Make sure you have a '.env' file with MISTRAL_API_KEY=your_key inside chatbot_backend/."
        )

    # Create dummy CSV if missing
    if not os.path.exists(CSV_FILENAME):
        print(f"Warning: {CSV_FILENAME} not found. Creating dummy data.")
        data = [
            ["id", "category", "question", "answer"],
            ["1", "PNG Basics", "What is Piped Natural Gas (PNG)?", "PNG is mainly methane (CH4) with a small percentage of other hydrocarbons."],
            ["6", "Billing", "What is the billing cycle?", "The billing cycle is bi-monthly (once every two months)."],
            ["8", "Payments", "What are the various bill payment modes?", "Cheque drop box, ECS, Axis/ICICI bank, or card payments at MNGL walk-in centres."],
            ["22", "CNG Safety", "What is the pressure in a CNG cylinder?", "Max up to 200 bar; cylinders meet standards and are CCOE approved."],
        ]
        with open(CSV_FILENAME, "w", newline="", encoding="utf-8-sig") as f:
            csv.writer(f).writerows(data)

    # Embeddings & Vector Store
    print("[*] Loading Mistral Embeddings...")
    embedding_model = MistralAIEmbeddings(model="mistral-embed")

    print(f"[*] Loading data from {CSV_FILENAME}...")
    loader = CSVLoader(
        file_path=CSV_FILENAME,
        encoding="utf-8",
        csv_args={"delimiter": ",", "quotechar": '"'},
    )
    documents = loader.load()

    vector_store = FAISS.from_documents(documents, embedding_model)
    _retriever = vector_store.as_retriever()

    # LLM & Agent
    print("[*] Initializing Mistral Brain...")
    llm = ChatMistralAI(model="open-mistral-7b", temperature=0)
    _agent = create_react_agent(llm, [mngl_faq_search, web_search], prompt=SYSTEM_PROMPT)

    print("[OK] SYSTEM READY - listening on http://127.0.0.1:8001")


# ---------------------------------------------------------------------------
# Endpoint
# ---------------------------------------------------------------------------

@app.post("/ask", response_model=AskResponse)
async def ask(body: AskRequest):
    """Receive a question and return the agent's answer."""
    # Resolve or create a session
    session_id = body.sessionId or str(uuid.uuid4())
    history = _sessions.setdefault(session_id, [])

    # Append the new human turn
    history.append(("human", body.question))

    # Run the agent with the full history so it has context
    result = _agent.invoke({"messages": history})

    # Extract the last AI message
    last_message = result["messages"][-1]
    answer_text = clean_answer_text(last_message.content)

    # Persist the AI reply to history
    history.append(("ai", answer_text))

    return AskResponse(answer=answer_text, sessionId=session_id)


# ---------------------------------------------------------------------------
# Dev entry-point  (python app.py)
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8001, reload=True)
