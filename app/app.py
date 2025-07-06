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
	customer_name = data.get(
		"user_name",
		"User",
	)  # Get user name from frontend, default to "User"

	logger.info(f"User message: {user_message}")
	logger.info(f"Customer name: {customer_name}")

	# If user has no history or has cleared their chat, initialize a new one.
	if customer_name not in agents_cache or not agents_cache[customer_name].get("messages"):
		agents_cache[customer_name] = {
			"messages": [
				HumanMessage(content=user_message),
				SystemMessage(
					content=SYSTEM_PROMPT + f"\n\nThe customer's full name is {customer_name}.",
				),
			],
			"planning_over": False,
		}
	else:
		agents_cache[customer_name]["messages"].append(HumanMessage(content=user_message))

	current_state = agents_cache[customer_name]
	last_state = await process_message(current_state)
	agents_cache[customer_name] = last_state
	response_message = last_state["messages"][-1].content
	logger.info(f"Response message: {response_message}")

	return jsonify({"reply": response_message})


@app.route("/clear", methods=["POST"])
def clear():
	data = request.get_json()
	customer_name = data.get("customer_name")
	if customer_name in agents_cache:
		agents_cache[customer_name]["messages"] = []
	return jsonify({"message": "Cache cleared for user"})


@app.route("/payment-complete", methods=["POST"])
async def payment_complete():
	data = request.get_json()
	customer_name = data.get(
		"user_name",
		"User",
	)  # Get user name from frontend, default to "User"

	logger.info(f"Customer name: {customer_name}")

	return jsonify({"message": "Payment received. Go GRAB your vacation now!"})


if __name__ == "__main__":
	app.run(port=5050)
