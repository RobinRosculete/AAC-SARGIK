import { Component } from '@angular/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { BlobApiService } from 'src/app/services/blob/blob-api.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
})
export class GalleryComponent {
  images: string[] = [''];
  googleID: string = '';
  userInput: string = '';

  constructor(protected blobAPI: BlobApiService) {}

  ngOnInit(): void {
    this.googleID = this.getUserIdFromToken();

    setTimeout(() => {
      this.blobAPI.getImageURIs(this.googleID).subscribe(
        (imageURIs: string[]) => {
          this.images = imageURIs;
        },
        (error) => {
          console.error('Error fetching image URIs:', error);
        }
      );
    }, 100);
  }

  //Methd used to parse The JWT token and retrieve the user id
  getUserIdFromToken(): string {
    const token = localStorage.getItem('token');
    if (token) {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedToken = JSON.parse(atob(base64));
      return decodedToken.unique_name;
    }
    return '';
  }
}
