import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import axios from 'axios';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, FormsModule],
})
export class AppComponent {
  userMessage: string = '';  // User's input message
  botResponse: string = '';  // Bot's response
  emotion: string = '';      // Emotion of the bot (e.g., pain, nausea, tired)
  title: string = 'Patient Chatbot';  // Title for the chat
  isFirstMessage: boolean = true;  // Track if this is the first message

  // Random bot details
  botName: string = '';
  botAge: number = 0;
  botSymptoms: string[] = [];

  messages: Array<{ sender: string, text: string, emotion: string }> = [];

  constructor() {
    // Initialize bot details from API
    this.getRandomBotDetails();
  }

  // Fetch bot details from RandomUser API
  async getRandomBotDetails() {
    try {
      const response = await axios.get('https://randomuser.me/api/');
      const userData = response.data.results[0];

      // Set the bot's name and age from the random user data
      this.botName = `${userData.name.first} ${userData.name.last}`;
      this.botAge = userData.dob.age;

      // Set realistic symptoms (for now, using hardcoded symptoms as an example)
      this.botSymptoms = [
        "high blood pressure", "fatigue", "dizziness", "headache", "nausea", "diabetes"
      ];

      // Initial bot introduction when the chat starts
      this.messages.push({
        sender: 'bot',
        text: `Hello Doctor, I'm your patient. My name is ${this.botName}, I am ${this.botAge} years old. I have been feeling unwell lately, with symptoms like ${this.botSymptoms.join(', ')}. I hope you can help me.`,
        emotion: 'neutral'
      });
    } catch (error) {
      console.error('Error fetching random user data:', error);
    }
  }

  // This function handles the bot's response based on the user's input
  getBotResponse() {
    if (this.isFirstMessage) {
      // Handle the introduction message only once
      this.isFirstMessage = false;
      return;
    }

    // Check if the user input matches any predefined question
    const userInput = this.userMessage.toLowerCase();

    if (userInput.includes('did you have your breakfast')) {
      this.botResponse = "Yes, I had my breakfast this morning.";
      this.emotion = 'neutral'; // Neutral emotion
    } else if (userInput.includes('how are you feeling') || userInput.includes('how do you feel')) {
      this.botResponse = `I'm feeling a bit under the weather today, Doctor. My symptoms include ${this.botSymptoms.join(', ')}.`;
      this.emotion = 'pain'; // Example of a specific emotion
    } else if (userInput.includes('did you take your medicine') || userInput.includes('did you take medicine today')) {
      this.botResponse = "No, Doctor, I haven’t taken my medicine yet. I think I forgot to take it this morning.";
      this.emotion = 'neutral'; // Neutral emotion
    } else if (userInput.includes('do you have any pain')) {
      this.botResponse = "Yes, I feel a sharp pain in my chest. It's hard to breathe.";
      this.emotion = 'pain';
    } else if (userInput.includes('how long have you been feeling sick')) {
      this.botResponse = "I've been feeling sick for about 2 days now, Doctor. It’s been getting worse.";
      this.emotion = 'neutral'; // Neutral emotion
    } else if (userInput.includes('are you feeling better')) {
      this.botResponse = "Not really, Doctor. I still feel weak and tired. I think I need more rest.";
      this.emotion = 'tired'; // Example of tired emotion
    } else if (userInput.includes('what are your symptoms')) {
      this.botResponse = `I am currently experiencing symptoms like ${this.botSymptoms.join(', ')}.`;
      this.emotion = 'neutral'; // Neutral emotion
    } else {
      this.botResponse = this.getGeneralResponse();  // If no predefined question, fallback to general response
      this.emotion = 'neutral';
    }
  }

  // This function generates a random neutral response if nothing specific is mentioned
  getGeneralResponse() {
    const responses = [
      "I feel a bit of pain in my chest... it's hard to breathe.",
      "I feel so nauseous. I can barely keep anything down.",
      "I'm so tired... it's hard to even keep my eyes open.",
      "It hurts when I move, I hope it gets better soon.",
      "I feel dizzy... I think I need to lie down for a bit.",
      "I'm feeling weak, I hope it's nothing serious.",
      "I'm getting a headache... I can't focus well."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // This function sends the user's message and processes the bot's response
  sendMessage() {
    if (this.userMessage.trim()) {
      this.messages.push({ sender: 'user', text: this.userMessage, emotion: '' });
      this.getBotResponse();  // Get the bot's response after user input
      this.messages.push({ sender: 'bot', text: this.botResponse, emotion: this.emotion });
      this.userMessage = '';  // Clear user input field
    }
  }
}
