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
      model: 'gpt-3.5-turbo', 
      messages: [
        { role: 'system', content: 'You are a quiz generator assistant.' },
        { role: 'user', content: prompt }
      ]
    };

    return this.http.post<any>(this.apiUrl, body, { headers });
  }
}
