import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { ChatService } from '../services/chat.service';
import { ChatMessage } from '../models/message.model';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  messages: ChatMessage[] = [];
  inputText = '';
  isLoading = false;
  sessionId = '';

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.sessionId = uuidv4();
    this.messages.push({
      role: 'bot',
      text: 'Merhaba! Size nasıl yardımcı olabilirim?',
      timestamp: new Date(),
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  sendMessage(): void {
    const text = this.inputText.trim();
    if (!text || this.isLoading) return;

    this.messages.push({ role: 'user', text, timestamp: new Date() });
    this.inputText = '';
    this.isLoading = true;

    this.chatService.sendMessage(this.sessionId, text).subscribe({
      next: (res) => {
        this.messages.push({ role: 'bot', text: res.reply, timestamp: new Date() });
        this.isLoading = false;
      },
      error: () => {
        this.messages.push({
          role: 'bot',
          text: 'Bir hata oluştu. Lütfen tekrar deneyin.',
          timestamp: new Date(),
        });
        this.isLoading = false;
      },
    });
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop =
        this.messageContainer.nativeElement.scrollHeight;
    } catch {}
  }
}
