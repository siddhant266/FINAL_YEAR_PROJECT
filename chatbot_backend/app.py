from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import uuid

load_dotenv()   # reads .env file if present

from gemini_client import ask_gemini
from faq_loader import load_faq

app = Flask(__name__)
CORS(app)       # allow all origins; restrict in production (see README)

# ── In-memory session store ───────────────────────────────────────────────────
# Keeps conversation history per session so multi-turn context works
# even though the frontend only sends one message at a time.
# Format: { session_id: [ {role, content}, ... ] }
sessions: dict[str, list[dict]] = {}


# ── Health check ─────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return jsonify({"status": "ok", "service": "MNGL Chatbot Backend (Python)"})


# ── /ask  ←  matches your frontend exactly ───────────────────────────────────
@app.post("/ask")
def ask():
    """
    Matches the frontend contract:
        Request  → { "question": "...", "sessionId": "..." (optional) }
        Response → { "answer": "...",  "sessionId": "..." }

    sessionId is auto-generated on first message and must be stored by
    the frontend and echoed back on every subsequent message so the
    backend can maintain multi-turn conversation history.
    """
    body = request.get_json(silent=True)

    # ── Validation ────────────────────────────────────────────────────────────
    if not body or not body.get("question", "").strip():
        return jsonify({"error": "Request body must contain a non-empty 'question'."}), 400

    question   = body["question"].strip()
    session_id = body.get("sessionId") or str(uuid.uuid4())

    # ── Build / retrieve conversation history ─────────────────────────────────
    history = sessions.setdefault(session_id, [])
    history.append({"role": "user", "content": question})

    # ── Call Gemini ───────────────────────────────────────────────────────────
    try:
        answer = ask_gemini(history)
        history.append({"role": "assistant", "content": answer})

        # Keep history bounded to last 20 turns to avoid token bloat
        if len(history) > 40:
            sessions[session_id] = history[-40:]

        return jsonify({"answer": answer, "sessionId": session_id})

    except Exception as e:
        # Roll back the user message so history stays consistent
        history.pop()
        app.logger.error("Gemini error: %s", e)
        return jsonify({
            "error":   "Something went wrong. Please try again.",
            "details": str(e) if os.getenv("FLASK_ENV") == "development" else None,
        }), 500


# ── /session/<id>  – clear a session (optional utility) ──────────────────────
@app.delete("/session/<session_id>")
def clear_session(session_id):
    sessions.pop(session_id, None)
    return jsonify({"cleared": session_id})


# ── FAQ list endpoint (for frontend suggested questions) ──────────────────────
@app.get("/api/chat/faq")
def faq():
    return jsonify({"faqs": load_faq()})


# ── Run ───────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    port = int(os.getenv("PORT", 8001))
    debug = os.getenv("FLASK_ENV") == "development"
    print(f"✅  MNGL chatbot backend running on http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=debug)