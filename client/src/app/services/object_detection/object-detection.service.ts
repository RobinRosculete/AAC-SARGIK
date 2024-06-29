import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ObjectDetectionService {
  constructor(private http: HttpClient) {}

  getObjectDetection(image: File): Observable<string[]> {
    const url = environment.SERVER_URL + '/api/ObjectDetection/image';

    const formData = new FormData();
    formData.append('file', image);

    return this.http.post<string[]>(url, formData);
  }
}
