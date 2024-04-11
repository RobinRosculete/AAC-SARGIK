import { Component, QueryList, ViewChildren } from '@angular/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { BlobApiService } from 'src/app/services/blob/blob-api.service';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';
import { Router } from '@angular/router';
import { ObjectDetectionService } from 'src/app/services/object_detection/object-detection.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
})
export class GalleryComponent {
  images: { imageUrl: string; caption: string }[] = [];
  googleID: string = '';
  file: File | null = null;
  caption: string = '';
  modals: { index: number; name: string }[] = [];

  @ViewChildren(IonModal) ionModals!: QueryList<IonModal>;

  constructor(
    protected blobAPI: BlobApiService,
    private router: Router,
    private objectDetectionService: ObjectDetectionService
  ) {}

  ngOnInit(): void {
    this.googleID = this.getUserIdFromToken();
    setTimeout(() => {
      this.blobAPI.getUserImages(this.googleID).subscribe(
        (imagesWithCaptions: any[]) => {
          this.images = imagesWithCaptions.map((image) => ({
            imageUrl: image.imgUri,
            caption: image.imgCaption,
          }));
          this.modals = this.images.map(() => ({ index: -1, name: '' }));
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
        console.log('Image uploaded successfully:', response);
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

  openModal(index: number): void {
    const modal = this.ionModals.toArray()[index];
    if (modal) {
      this.modals[index].index = index;
      modal.present();
    }
  }

  cancel(index: number): void {
    const modal = this.ionModals.toArray()[index];
    if (modal) {
      modal.dismiss(null, 'cancel');
    }
  }

  confirm(index: number): void {
    const modal = this.ionModals.toArray()[index];
    if (modal) {
      modal.dismiss(this.modals[index].name, 'confirm');
    }
  }

  onWillDismiss(event: Event, index: number): void {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      //this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  async detectObjects(): Promise<void> {
    if (!this.file) {
      console.error('No file selected.');
      return;
    }

    try {
      const result = await this.objectDetectionService
        .getObjectDetection(this.file)
        .toPromise();
      console.log('Object detection result:', result);
    } catch (error) {
      console.error('Error detecting objects:', error);
    }
  }
}
