from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)  # Allows cross-origin requests, important for frontend-backend communication

# Emotion detection model
emotion_analyzer = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base")

# Flask route for chatbot responses
@app.route('/api/patient-response', methods=['POST'])
def patient_response():
    data = request.get_json()
    user_input = data.get("message", "")

    # Analyze the input for emotions
    emotions = emotion_analyzer(user_input)
    dominant_emotion = emotions[0]['label']

    # Generate responses based on emotion
    if dominant_emotion == "anger":
        response = "I feel frustrated, please help me..."
    elif dominant_emotion == "fear":
        response = "I'm really scared, can you comfort me?"
    elif dominant_emotion == "joy":
        response = "I'm feeling better, thank you!"
    elif dominant_emotion == "sadness":
        response = "I'm in pain, it's hard to cope..."
    else:
        response = "I don't feel well, please assist me."

    return jsonify({"response": response, "emotion": dominant_emotion})

if __name__ == '__main__':
    app.run(debug=True)
