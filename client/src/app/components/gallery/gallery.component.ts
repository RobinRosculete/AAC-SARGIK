import { Component } from '@angular/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { BlobApiService } from 'src/app/services/blob/blob-api.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
})
export class GalleryComponent {
  images: { imageUrl: string; caption: string }[] = [];
  googleID: string = '';

  constructor(protected blobAPI: BlobApiService) {}

  ngOnInit(): void {
    this.googleID = this.getUserIdFromToken();

    setTimeout(() => {
      this.blobAPI.getUserImages(this.googleID).subscribe(
        (imagesWithCaptions: any[]) => {
          this.images = imagesWithCaptions.map((image) => ({
            imageUrl: image.imgUri,
            caption: image.imgCaption,
          }));
        },
        (error) => {
          console.error('Error fetching images with captions:', error);
        }
      );
    }, 100);
  }

  readCaption(caption: string): void {
    TextToSpeech.speak({ text: caption });
  }

  // Method used to parse The JWT token and retrieve the user id
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
