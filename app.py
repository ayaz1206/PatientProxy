from flask import Flask, render_template, request, jsonify
import requests

# Initialize Flask app
app = Flask(__name__)

# Rasa server URL (replace if hosted on a different server)
RASA_SERVER_URL = "http://localhost:5005/webhooks/rest/webhook"

@app.route('/')
def home():
    """Render the chatbot interface."""
    return render_template('index.html')

@app.route('/send_message', methods=['POST'])
def send_message():
    """Send message to Rasa server and get the response."""
    user_message = request.json.get('message')
    response = requests.post(RASA_SERVER_URL, json={"sender": "user", "message": user_message})

    if response.status_code == 200:
        bot_message = response.json()[0].get('text')
    else:
        bot_message = "Sorry, I'm having trouble responding. Please try again."

    return jsonify({"response": bot_message})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
