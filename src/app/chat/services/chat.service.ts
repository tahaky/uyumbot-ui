import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SendMessageRequest {
  message: string;
}

export interface SendMessageResponse {
  reply: string;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private apiBase = environment.apiBase;

  constructor(private http: HttpClient) {}

  sendMessage(sessionId: string, message: string): Observable<SendMessageResponse> {
    const url = `${this.apiBase}/chat/sessions/${sessionId}/messages`;
    const body: SendMessageRequest = { message };
    return this.http.post<SendMessageResponse>(url, body);
  }
}
