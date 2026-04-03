import torch
import joblib
from transformers import DistilBertTokenizer
from model_def import ComplaintClassifier

class ComplaintPredictor:
    def __init__(self):
        self.device = torch.device("cpu")

        self.tokenizer = DistilBertTokenizer.from_pretrained(
            "model/tokenizer"
        )

        self.label_encoder = joblib.load(
            "model/label_encoder.pkl"
        )

        self.model = ComplaintClassifier(
            num_classes=len(self.label_encoder.classes_)
        )

        self.model.load_state_dict(
            torch.load(
                "model/mngl_complaint_classifier.pth",
                map_location=self.device
            )
        )

        self.model.eval()

    def predict(self, text: str):
        inputs = self.tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            padding=True,
            max_length=128
        )

        with torch.no_grad():
            outputs = self.model(
                input_ids=inputs["input_ids"],
                attention_mask=inputs["attention_mask"]
            )

            pred = torch.argmax(outputs, dim=1).item()

        return self.label_encoder.inverse_transform([pred])[0]
