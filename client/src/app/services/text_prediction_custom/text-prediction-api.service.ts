import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
@Injectable({
  providedIn: 'root',
})
export class TextPredictionApiService {
  private serverUrl = environment.SERVER_URL + '/api/TextPrediction';
  constructor(private httpClient: HttpClient) {}
  //Function to sent user text input to Text Prediction API service and return predicted text
  getTextPrediction(inputText: string): Observable<any> {
    return this.httpClient.get(this.serverUrl, {
      responseType: 'text',
      params: { query: inputText },
    });
  }
}
