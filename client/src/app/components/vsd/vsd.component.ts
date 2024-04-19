import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonModal, Platform } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { CameraPreview, CameraPreviewOptions,CameraPreviewPictureOptions } from '@capacitor-community/camera-preview';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ImageCroppedEvent, ImageCropperComponent,CropperPosition } from 'ngx-image-cropper';
import { TextPredictionApiService } from 'src/app/services/text_prediction_custom/text-prediction-api.service';
import { ObjectDetectionService } from 'src/app/services/object_detection/object-detection.service';

@Component({
  selector: 'app-vsd',
  templateUrl: './vsd.component.html',
  styleUrls: ['./vsd.component.css'],
})
export class VsdComponent {
  saveImageToGallery() {
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
  protected generatedTexts: string[] = [
    'Ghost Text 1',
    'Ghost Text 2',
    'Ghost Text 3',
  ];
  protected imageChangedEvent: any = '';
  protected croppedImage: any = '';
  protected aiSelectedText: string = '';
  protected file: File | null = null;

  //Used to get coordinates from cropper
  cropperPosition: CropperPosition = { x1: 0, y1: 0, x2: 0, y2: 0 };

  constructor(
    private textPredictionApiService: TextPredictionApiService,

   private objectDetectionService: ObjectDetectionService
  ) {}

  ngAfterViewInit(): void {
    this.openModal();
  }

  openModal() {
    this.modal.present();
  }

  //Used to open the ai text generation modal
  openTextModal() {
    // Check if myImage is available
    if (this.myImage) {
      this.textModal.present();
    } else {
      console.error('No image selected.');
    }
  }

  //Used to select one of the 3 text genertae by the ai
  selectText(text: string) {
    this.aiSelectedText = text;
    this.textModal.dismiss();
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  async captureImage() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 100
    });
  
    this.myImage = `data:image/jpeg;base64,${capturedPhoto.base64String}`;
    this.photoCaptured = true;
  }

  retakePhoto() {
    this.myImage = '';

    this.croppedImage = null;
    this.photoCaptured = false;
    this.aiSelectedText = '';
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
    this.photoCaptured = true;
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
}
