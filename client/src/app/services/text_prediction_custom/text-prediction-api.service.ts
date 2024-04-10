import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
@Injectable({
  providedIn: 'root',
})
export class TextPredictionApiService {
  constructor(private http: HttpClient) {}
  //Function to send user text input to Text Prediction API service and return predicted text
  getData(inputText: string): Observable<any> {
    // Request body
    let url = environment.SERVER_URL + '/api/TextPrediction';
    let body = {
      text: inputText,
    };

    return this.http.post(url, body);
  }

  //Makes request to Text Prediction API service to get an emoji based on input text
  getEmoji(text: string): Observable<string> {
    let url = environment.SERVER_URL + '/api/TextPrediction/emoji';
    return this.http.post(url, { text }).pipe(
      map((response: any) => response.choices[0].message.textContent),
      catchError((error: any) => {
        console.error('Error getting emoji:', error);
        return throwError('Failed to get emoji');
      })
    );
  }
}
