import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
@Injectable({
  providedIn: 'root',
})
export class TextPredictionApiService {
  constructor(private http: HttpClient) {}
  //Function ro send array of predicted classes from a image and return 3 generated sentences based on the class
  getData(imageClasses: string[]): Observable<any> {
    let url = environment.SERVER_URL + '/api/UseChatGPT';
    return this.http.post(url, imageClasses); // returns a array of strings containing generated sentences senteces
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
