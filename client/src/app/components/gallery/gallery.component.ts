import {
  Component,
  ViewChildren,
  QueryList,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { BlobApiService } from 'src/app/services/blob/blob-api.service';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';
import { Router } from '@angular/router';
import { ObjectDetectionService } from 'src/app/services/object_detection/object-detection.service';
import { Image } from 'src/app/models/image.interfacce';
import { LoadingController } from '@ionic/angular';
import { Camera, CameraResultType } from '@capacitor/camera';
import {
  ImageCroppedEvent,
  LoadedImage,
  CropperPosition,
} from 'ngx-image-cropper';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
})
export class GalleryComponent {
  private myImage: any = null;
  protected images: Image[] = [];
  private googleID: string = '';
  private file: File | null = null;
  protected caption: string = '';
  protected modals: { index: number; name: string }[] = [];
  protected croppedImage: any = '';
  cropperCoor: any = { x1: 0, y1: 0, w: 0, h: 0 };
  showImageCropper: boolean = false;
  showRedBox: boolean = false;
  redBoxLeft: number = 0;
  redBoxTop: number = 0;
  redBoxWidth: number = 0;
  redBoxHeight: number = 0;

  @ViewChildren(IonModal) ionModals!: QueryList<IonModal>;
  imageChangedEvent: any = '';

  constructor(
    protected blobAPI: BlobApiService,
    private router: Router,
    private objectDetectionService: ObjectDetectionService,
    private loadingCtrl: LoadingController,
    private ELEM: ElementRef,
    private renderer: Renderer2,
    private sharedService: SharedService
  ) {}

  openVSDModal() {
    this.sharedService.openVSDModal();
  }

  ngOnInit(): void {
    this.googleID = this.getUserIdFromToken();
    setTimeout(() => {
      this.blobAPI.getUserImages(this.googleID).subscribe(
        (imagesWithCaptions: any[]) => {
          this.images = imagesWithCaptions.map((image) => ({
            imageID: image.imageID,
            imageUrl: image.imageUri,
            caption: image.imageCaption,
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

  async selectImage() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.Base64,
    });
    const loading = await this.loadingCtrl.create();
    await loading.present();

    this.myImage = `data:image/jpeg;base64,${image.base64String}`;
    this.croppedImage = null;
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageLoaded(image: LoadedImage) {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  toggleImageCropper() {
    this.showImageCropper = !this.showImageCropper;
  }

  getPosition(cropperPosition: any, index: number) {
    // Here, you can access the `cropperPosition` and do whatever you need with it
    console.log('Cropper position:', cropperPosition);
    // You can also store it in a variable for later use
    this.cropperCoor.x1 = cropperPosition.cropperPosition.x1;
    this.cropperCoor.x2 = cropperPosition.cropperPosition.x2;
    this.cropperCoor.y1 = cropperPosition.cropperPosition.y1;
    this.cropperCoor.y2 = cropperPosition.cropperPosition.y2;
    this.cropperCoor.w = cropperPosition.cropperPosition.y1;
    this.cropperCoor.h = cropperPosition.cropperPosition.y2;
    console.log(typeof this.cropperCoor.x1);
  }

  showBox() {
    console.log(this.cropperCoor);
    // Assuming you have variables for x and y coordinates
    const x: number = this.cropperCoor.x1;
    const y: number = this.cropperCoor.y1;
    const boxWidth: number = this.cropperCoor.x2 - this.cropperCoor.x1; // Example width of the box
    const boxHeight: number = this.cropperCoor.y2 - this.cropperCoor.y1; // Example height of the box

    // Set the position and size of the red box based on the coordinates
    this.redBoxLeft = x;
    this.redBoxTop = y;
    this.redBoxWidth = boxWidth;
    this.redBoxHeight = boxHeight;

    // Show the red box
    this.showRedBox = true;
  }
}
