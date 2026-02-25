export type MessageRole = 'user' | 'bot';

export interface ChatMessage {
  role: MessageRole;
  text: string;
  timestamp: Date;
}
