import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { Image } from 'src/app/models/image.interfacce'; // Import the Image interface
import { BoundingBox } from 'src/app/models/boundbox.interface';

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

  // Function to upload an image to the server
  uploadImage(
    file: File,
    googleUserId: string,
    caption: string
  ): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('googleUserId', googleUserId);
    formData.append('caption', caption);

    let url =
      environment.SERVER_URL +
      '/api/Blob/users/' +
      googleUserId +
      '/upload-image';
    return this.http.post<any>(url, formData);
  }

  saveBoundingBox(boundBox: BoundingBox): Observable<any> {
    let url = environment.SERVER_URL + '/api/Blob/users/save-bounding-box';
    console.log("From service", boundBox);
    return this.http.post<any>(url, boundBox);
  }
}
