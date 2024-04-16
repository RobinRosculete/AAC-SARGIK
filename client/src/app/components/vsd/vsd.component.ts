import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonModal, Platform } from '@ionic/angular';
import {
  CameraPreview,
  CameraPreviewOptions,
  CameraPreviewPictureOptions,
} from '@capacitor-community/camera-preview';
import { Camera } from '@capacitor/camera';
import {
  ImageCroppedEvent,
  ImageCropperComponent,
  CropperPosition,
} from 'ngx-image-cropper';

@Component({
  selector: 'app-vsd',
  templateUrl: './vsd.component.html',
  styleUrls: ['./vsd.component.css'],
})
export class VsdComponent {
  @ViewChild(IonModal) modal!: IonModal;
  @ViewChild('cropper') cropper!: ImageCropperComponent;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  protected myImage: string | null = null;
  protected cameraActive: boolean = false;
  protected photoCaptured: boolean = false;
  protected croppingMode: boolean = false;

  imageChangedEvent: any = '';
  croppedImage: any = '';
  cropperPosition: CropperPosition = { x1: 0, y1: 0, x2: 0, y2: 0 };

  constructor(private platform: Platform) {}

  ngAfterViewInit(): void {
    this.openModal();
  }

  openModal() {
    this.modal.present();
  }

  public startCamera(): void {
    const cameraPreviewOptions: CameraPreviewOptions = {
      position: 'rear',
      parent: 'cameraPreview',
      className: 'cameraPreview',
    };
    CameraPreview.start(cameraPreviewOptions);
    this.cameraActive = true;
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
    this.stopCamera();
  }

  async stopCamera() {
    await CameraPreview.stop();
    this.cameraActive = false;
  }

  async captureImage() {
    const cameraPreviewPictureOptions: CameraPreviewPictureOptions = {
      quality: 90,
    };
    const result = await CameraPreview.capture(cameraPreviewPictureOptions);
    this.myImage = `data:image/jpeg;base64,${result.value}`;
    this.photoCaptured = true;
    this.croppedImage = null;
    this.stopCamera();
  }

  retakePhoto() {
    this.myImage = null;
    this.myImage = null;
    this.croppedImage = null;
    this.photoCaptured = false;
  }

  flipCamera() {
    CameraPreview.flip();
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  imageCropped(event: ImageCroppedEvent) {
    this.cropperPosition = event.cropperPosition;
    if (event.blob) {
      const reader = new FileReader();
      reader.readAsDataURL(event.blob);
      reader.onloadend = () => {
        this.croppedImage = reader.result as string;
      };
    }
  }

  editPhoto() {
    if (this.croppedImage) {
      this.myImage = this.croppedImage;
    } else if (this.myImage) {
      this.myImage = this.myImage;
    }
    this.photoCaptured = true;
    this.croppingMode = true;
  }

  confirmCropping() {
    console.log('Cropper Position:', this.cropperPosition);
    if (this.croppedImage) {
      this.myImage = this.croppedImage;
      this.croppingMode = false;
    }
  }

  //Method used to manage image uplaod after new image has been selected
  onFileSelected(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.myImage = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
