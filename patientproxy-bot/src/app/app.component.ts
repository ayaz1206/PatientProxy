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

  async checkEnter(event: KeyboardEvent): Promise<void> {
    if (event.key === 'Enter') {
      await this.sendMessage();
    }
  }
  // This function sends the user's message to the backend and processes the response
  async sendMessage() {
    if (this.userMessage.trim()) {
      // Add user's message to chat history
      this.messages.push({ sender: 'user', text: this.userMessage, emotion: '' });

      // Send the user's message to the backend and wait for the response
      try {
        const response = await axios.post('http://localhost:5000/chat', {
          user_id: 'user123',  // Replace with a unique user ID if needed
          message: this.userMessage
        });

        // Process the response from the bot
        this.botResponse = response.data.response;
        this.emotion = response.data.emotion;

        // Add the bot's response to chat history
        this.messages.push({ sender: 'bot', text: this.botResponse, emotion: this.emotion });
      } catch (error) {
        console.error('Error sending message:', error);
      }

      // Clear user input field
      this.userMessage = '';
    }
  }
}
