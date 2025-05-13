import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.local';


@Injectable({ providedIn: 'root' })
export class OpenaiService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions';

  constructor(private http: HttpClient) {}

  getGPTResponse(prompt: string) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${environment.openaiKey}`)
      .set('OpenAI-Organization', environment.openaiOrg);

    const body = {
      model: 'gpt-3.5-turbo', // You can switch to 'gpt-4' if enabled
      messages: [
        { role: 'system', content: 'You are a helpful assistant for generating JSON-based quizzes.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7 // optional: controls creativity
    };

    return this.http.post<any>(this.apiUrl, body, { headers });
  }
}
