# Backend for voyAIge Chatbot (AWS Lambda + Bedrock)

## Structure

```
backend/
├── lambda/
│   ├── handler.py             # Main Lambda function
│   ├── prompts.py             # Prompt templates for Bedrock
│   └── mock_data/
│       └── products.json      # Simulated GrabPay/Loan products
├── template.yaml              # SAM template (for deployment)
├── requirements.txt           # Python deps (boto3, etc.)
└── README.md                  # Setup instructions
```

## Setup Instructions

1. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
2. Edit `lambda/handler.py` to implement your Lambda logic.
3. Use `template.yaml` for AWS SAM deployment.
4. Place any mock data in `lambda/mock_data/`.

---

- `handler.py`: Main Lambda entrypoint
- `prompts.py`: Prompt templates/utilities for Bedrock
- `products.json`: Example/mock product data
- `template.yaml`: AWS SAM/CloudFormation template
- `requirements.txt`: Python dependencies

---

For more details, see the main project README. 