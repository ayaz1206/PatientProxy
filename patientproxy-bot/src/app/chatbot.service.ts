import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = 'http://localhost:5000/api/patient-response';

  constructor(private http: HttpClient) { }

  sendMessage(message: string): Observable<any> {
    return this.http.post(this.apiUrl, { message });
  }
}
