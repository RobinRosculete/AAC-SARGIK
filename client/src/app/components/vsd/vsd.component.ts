import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonModal } from '@ionic/angular';
import {
  ImageCroppedEvent,
  ImageCropperComponent,
  CropperPosition,
} from 'ngx-image-cropper';
import { SharedService } from '../shared.service';
import { KeyboardService } from '../keyboard.service';
import { switchMap } from 'rxjs';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { TextPredictionApiService } from 'src/app/services/text_prediction_custom/text-prediction-api.service';
import { ObjectDetectionService } from 'src/app/services/object_detection/object-detection.service';
import { BlobApiService } from 'src/app/services/blob/blob-api.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-vsd',
  templateUrl: './vsd.component.html',
  styleUrls: ['./vsd.component.css'],
})
export class VsdComponent {
  //Methods not implememnted
  stopCamera() {
    throw new Error('Method not implemented.');
  }

  @ViewChild(IonModal) modal!: IonModal;
  @ViewChild('textModal') textModal!: IonModal;
  @ViewChild('cropper') cropper!: ImageCropperComponent;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  protected myImage: string = '';
  protected cameraActive: boolean = false;
  protected photoCaptured: boolean = false;
  protected croppingMode: boolean = false;

  private imageClasses: string[] = [];
  protected generatedTexts: string[] = [
    'No Generated Text, Classes not detected in the image.',
  ];
  protected imageChangedEvent: any = '';
  protected croppedImage: any = '';

  private googleID: string = '';

  protected caption: string = '';

  constructor(
    private sharedService: SharedService,
    private keyboardService: KeyboardService,
    private textPredictionApiService: TextPredictionApiService,
    private objectDetectionService: ObjectDetectionService,
    private blobApiService: BlobApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.googleID = this.getUserIdFromToken();
    this.sharedService.openVSDModal$.subscribe(() => {
      this.openModal();
    });
  }

  ngAfterViewInit(): void {
    this.openModal();
  }

  openModal() {
    this.modal.present();
  }

  speakText(text: string): void {
    this.keyboardService.speakText(text);
  }

  getImagePrediction(image: string) {
    this.generatedTexts = [
      'No Generated Text, Classes not detected in the image.',
    ];
    const imageName = 'name.png';
    const imageBlob = this.dataURItoBlob(image);
    const imageFile = new File([imageBlob], imageName, { type: 'image/png' });

    this.objectDetectionService
      .getObjectDetection(imageFile)
      .pipe(
        switchMap((classes) => {
          this.imageClasses = classes;
          return this.textPredictionApiService.getGeneratedText(
            this.imageClasses
          );
        })
      )
      .subscribe(({ sentences }) => {
        this.generatedTexts = sentences;
      });
  }

  dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([intArray], { type: mimeString });
  }

  openTextModal() {
    if (this.myImage) {
      this.textModal.present();
    } else {
      console.error('No image selected.');
    }
  }

  selectText(text: string) {
    this.caption = text;
    this.textModal.dismiss();
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  async captureImage() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 100,
    });

    this.myImage = `data:image/jpeg;base64,${capturedPhoto.base64String}`;
    this.photoCaptured = true;
  }

  retakePhoto() {
    this.myImage = '';
    this.croppedImage = null;
    this.photoCaptured = false;
    this.caption = '';
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }
  imageCropped(event: ImageCroppedEvent) {
    if (event.blob) {
      const reader = new FileReader();
      reader.readAsDataURL(event.blob);
      reader.onloadend = () => {
        this.croppedImage = reader.result as string;
      };
    }
  }

  editPhoto() {
    this.photoCaptured = true;
    if (this.croppedImage) {
      this.myImage = this.croppedImage;
    }
    this.croppingMode = true;
  }

  confirmCropping() {
    if (this.croppedImage) {
      this.myImage = this.croppedImage;
      this.croppingMode = false;
    }
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.myImage = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
  // Function to upload an image with a caption using the BlobApiService
  saveImageToGallery(): void {
    if (!this.caption.trim()) {
      console.error('Caption is required.');
      return;
    }

    const timestamp = new Date().getTime(); // Generate a unique timestamp
    const randomId = Math.random().toString(36).substr(2, 9);
    const imageName = `${timestamp}-${randomId}.png`; // Use timestamp and random id in the image name
    const imageBlob = this.dataURItoBlob(this.myImage);
    const imageFile = new File([imageBlob], imageName, { type: 'image/png' });

    this.blobApiService
      .uploadImage(imageFile, this.googleID, this.caption)
      .subscribe(
        (response) => {
          console.log('Image uploaded successfully:', response);
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

  //Function to get the user token from local storage
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
