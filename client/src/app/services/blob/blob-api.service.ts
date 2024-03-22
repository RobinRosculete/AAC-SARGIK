import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class BlobApiService {
  constructor(private http: HttpClient) {}

  // Function to retrieve User image URI links from server
  getImageURIs(googleId: string): Observable<string[]> {
    let url =
      environment.SERVER_URL + '/api/Blob/users/' + googleId + '/images';
    return this.http.get<string[]>(url);
  }
}
