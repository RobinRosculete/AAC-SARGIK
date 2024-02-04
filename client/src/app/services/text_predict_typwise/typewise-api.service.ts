import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TypewiseAPIService {
  private apiUrl =
    'https://api.typewise.ai/latest/completion/sentence_complete';

  constructor(private http: HttpClient) {}

  getData(inputText: string): Observable<any> {
    // Request headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    // Request body
    const body = {
      languages: ['en', 'es'],
      maxNumberOfPredictions: 5,
      text: inputText,
    };

    return this.http.post(this.apiUrl, body, { headers });
  }
}
