import logging

from chatbot import SYSTEM_PROMPT, process_message
from flask import Flask, jsonify, request
from flask_cors import CORS
from langchain_core.messages import HumanMessage, SystemMessage

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, supports_credentials=True)

# Global cache for agents to persist memory. In a real app, use a more robust store.
agents_cache = {}


@app.route("/")
def home():
    return "Hello, World!"


@app.route("/chat", methods=["POST"])
async def chat():
    data = request.get_json()
    user_message = data.get("message")
    user_name = data.get("user_name", "User")  # Get user name from frontend, default to "User"
    
    logger.info(f"User message: {user_message}")
<<<<<<< Updated upstream
    logger.info(f"Customer name: {customer_name}")

    if customer_name not in agents_cache:
        current_state = {
            "messages": [
                HumanMessage(content=user_message),
                SystemMessage(
                    content=SYSTEM_PROMPT
                    + f"\n\nThe customer's full name is {customer_name}."
                ),
            ]
        }
    else:
        current_state = agents_cache[customer_name]
        current_state["messages"].append(HumanMessage(content=user_message))

    last_state = await process_message(current_state)
    agents_cache[customer_name] = last_state
    response_message = last_state["messages"][-1].content
    logger.info(f"Response message: {response_message}")
=======
    logger.info(f"Customer name: {user_name}")
    response_message = await process_message(user_message, user_name)
>>>>>>> Stashed changes

    return jsonify({"reply": response_message})


@app.route("/clear", methods=["POST"])
def clear():
    data = request.get_json()
    customer_name = data.get("customer_name")
    agents_cache.pop(customer_name)
    return jsonify({"message": "Cache cleared"})


if __name__ == "__main__":
    app.run(port=5050)
