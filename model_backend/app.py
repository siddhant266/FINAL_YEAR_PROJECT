from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from predictor import ComplaintPredictor

app = FastAPI(title="Complaint Classification API")

# 👇 ADD THIS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],  # React dev URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

predictor = ComplaintPredictor()

class ComplaintRequest(BaseModel):
    text: str

@app.post("/predict")
def predict_complaint(req: ComplaintRequest):
    result = predictor.predict(req.text)
    return {"department": result}
