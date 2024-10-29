from flask import Flask, request, jsonify, send_from_directory
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
import torch
import os

app = Flask(__name__, static_folder='src/app')  # Adjust this to your Angular build folder
app.secret_key = "supersecretkey"  # Required for session handling

# Load the emotion analysis model and tokenizer
emotion_model_name = "cardiffnlp/twitter-roberta-base-sentiment-latest"
emotion_tokenizer = AutoTokenizer.from_pretrained(emotion_model_name)
emotion_model = AutoModelForSequenceClassification.from_pretrained(emotion_model_name)

# Load the language generation model
response_generator = pipeline("text-generation", model="distilgpt2")

# Memory structure to hold conversation context
memory = {}

# Function to analyze emotion
def analyze_emotion(text):
    inputs = emotion_tokenizer(text, return_tensors="pt")
    outputs = emotion_model(**inputs)
    probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
    sentiment = torch.argmax(probs).item()
    return sentiment  # 0 = Negative, 1 = Neutral, 2 = Positive

# Function to generate dynamic responses based on emotion and intent
def generate_dynamic_response(emotion_label, intent, user_message):
    # Create a prompt with context for the language model
    prompt = f"As a patient feeling {emotion_label.lower()}, {intent}. {user_message}"
    
    # Generate a response based on the prompt
    generated = response_generator(prompt, max_length=50, num_return_sequences=1)[0]["generated_text"]
    
    # Remove the prompt portion from the generated text
    response = generated.replace(prompt, "").strip()
    return response

@app.route("/test", methods=["GET"])
def test():
    return "Flask is working!"

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json["message"]
    user_id = request.json["user_id"]

    # Retrieve user's memory if available
    user_memory = memory.get(user_id, {"emotion": None, "last_topic": None})

    # Analyze emotion in the user message
    emotion = analyze_emotion(user_message)
    emotion_label = ["Negative", "Neutral", "Positive"][emotion]

    # Determine intent using basic keyword matching
    if "pain" in user_message.lower():
        intent = "describe_symptom"
    elif "nausea" in user_message.lower():
        intent = "describe_symptom"
    else:
        intent = "general"

    # Generate a dynamic response using the emotion label and intent
    response = generate_dynamic_response(emotion_label, intent, user_message)

    # Update the user's memory with the latest emotion and intent
    user_memory["emotion"] = emotion_label
    user_memory["last_topic"] = intent
    memory[user_id] = user_memory

    return jsonify({
        "response": response,
        "emotion": user_memory["emotion"]
    })

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def static_proxy(path):
    return send_from_directory(app.static_folder, path)

if __name__ == "__main__":
    app.run(debug=True)
