import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { Image } from 'src/app/models/image.interfacce'; // Import the Image interface

@Injectable({
  providedIn: 'root',
})
export class BlobApiService {
  constructor(private http: HttpClient) {}

  // Function to retrieve User images with captions from the server
  getUserImages(googleId: string): Observable<Image[]> {
    let url =
      environment.SERVER_URL + '/api/Blob/users/' + googleId + '/images';
    return this.http.get<Image[]>(url);
  }
}
