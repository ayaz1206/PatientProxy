import { Component } from '@angular/core';
import { ChatbotService } from './chatbot.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  userMessage = '';
  botResponse = '';
  emotion = '';

  constructor(private chatbotService: ChatbotService) {}

  sendMessage() {
    if (this.userMessage.trim()) {
      this.chatbotService.sendMessage(this.userMessage).subscribe((data) => {
        this.botResponse = data.response;
        this.emotion = data.emotion;
      });
    }
  }
}
