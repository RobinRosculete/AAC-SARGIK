import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TypewiseAPIService {
  constructor(private http: HttpClient) {}

  getData(inputText: string): Observable<any> {
    let url = 'https://api.typewise.ai/latest/completion/sentence_complete';

    // Request body
    let body = {
      maxNumberOfPredictions: 50,
      languages: ['en', 'es'],
      text: inputText,
    };

    return this.http.post(url, body);
  }
}
