import torch
import torch.nn as nn
from transformers import DistilBertForSequenceClassification

class ComplaintClassifier(nn.Module):
    def __init__(self, num_classes, dropout_rate=0.1):
        super().__init__()

        self.distilbert = DistilBertForSequenceClassification.from_pretrained(
            "distilbert-base-uncased",
            num_labels=num_classes
        )

        self.dropout = nn.Dropout(dropout_rate)

    def forward(self, input_ids, attention_mask):
        outputs = self.distilbert(
            input_ids=input_ids,
            attention_mask=attention_mask
        )
        logits = outputs.logits
        logits = self.dropout(logits)
        return logits
