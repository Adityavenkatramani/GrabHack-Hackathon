import logging

from chatbot import process_message
from flask import Flask, jsonify, request
from flask_cors import CORS

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, supports_credentials=True)


@app.route("/")
def home():
    return "Hello, World!"


@app.route("/chat", methods=["POST"])
async def chat():
    data = request.get_json()
    user_message = data.get("message")
    customer_name = "Kein"
    logger.info(f"User message: {user_message}")
    logger.info(f"Customer name: {customer_name}")
    response_message = await process_message(user_message, customer_name)

    return jsonify({"reply": response_message})


if __name__ == "__main__":
    app.run(port=5050)
