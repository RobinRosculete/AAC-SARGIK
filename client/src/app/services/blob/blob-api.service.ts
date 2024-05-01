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

  //Calling api to save a bounding box of an image
  saveBoundingBox(boundBox: BoundingBox): Observable<any> {
    let url =
      environment.SERVER_URL + '/api/BoundingBox/users/save-bounding-box';

    return this.http.post<any>(url, boundBox);
  }

  //Calling api to get all bounding boxes of an image
  getBoundingBox(imageId: number): Observable<any> {
    let url = `${environment.SERVER_URL}/api/BoundingBox/images/${imageId}/bounding-boxes`;
    return this.http.get<any>(url);
  }

  //Calling api to delete image and Bounding Box of the image
  deleteImageWithBoundingBox(imageId: number): Observable<any> {
    let url = `${environment.SERVER_URL}/api/Blob/images/${imageId}`;
    return this.http.delete<any>(url);
  }
}
