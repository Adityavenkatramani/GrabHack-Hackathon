from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True)

@app.route('/')
def home():
    return "Hello, World!"

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message')

    # For now, just reply with a hardcoded link
    response_message = '<a href="#" class="grabpay-link">GrabPay Service</a>'

    return jsonify({"reply": response_message})

if __name__ == '__main__':
    app.run(port=5050)
