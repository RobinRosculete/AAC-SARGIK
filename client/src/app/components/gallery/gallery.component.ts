import { Component } from '@angular/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { BlobApiService } from 'src/app/services/blob/blob-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
})
export class GalleryComponent {
  images: { imageUrl: string; caption: string }[] = [];
  googleID: string = '';

  //Variables used for Image and caption Upload Testing
  file: File | null = null;
  caption: string = '';

  constructor(protected blobAPI: BlobApiService, private router: Router) {}

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

  onFileSelected(event: any): void {
    this.file = <File>event.target.files[0];
  }

  uploadImageWithCaption(): void {
    if (!this.file) {
      console.error('No file selected.');
      return;
    }
    if (!this.caption.trim()) {
      console.error('Caption is required.');
      return;
    }

    this.blobAPI.uploadImage(this.file, this.googleID, this.caption).subscribe(
      (response) => {
        //Handle successful upload
        console.log('Image uploaded successfully:', response);

        //reset input
        this.file = null;
        this.caption = '';

        // Refresh the page by navigating back to the current route
        this.router
          .navigateByUrl('/', { skipLocationChange: true })
          .then(() => {
            this.router.navigate(['gallery']);
          });
      },
      (error) => {
        console.error('Error uploading image:', error);
      }
    );
  }
}
