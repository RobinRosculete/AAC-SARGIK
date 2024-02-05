import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
@Injectable({
  providedIn: 'root',
})
export class TextPredictionApiService {
  constructor(private http: HttpClient) {}
  //Function to sent user text input to Text Prediction API service and return predicted text
  getData(inputText: string): Observable<any> {
    // Request body
    let url = environment.SERVER_URL + '/api/TextPrediction';
    let body = {
      text: inputText,
    };

    return this.http.post(url, body);
  }
}
