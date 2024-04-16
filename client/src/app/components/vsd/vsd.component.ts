import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { TextPredictionApiService } from 'src/app/services/text_prediction_custom/text-prediction-api.service';
import { ObjectDetectionService } from 'src/app/services/object_detection/object-detection.service';
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
import { switchMap } from 'rxjs';

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
  private imageClasses: string[] = [];
  protected generatedTexts: string[] = [];
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

  getImagePrediction(image: string) {
    const imageName = 'name.png';
    const imageBlob = this.dataURItoBlob(image);
    const imageFile = new File([imageBlob], imageName, { type: 'image/png' });
    console.log(imageFile);

    this.objectDetectionService
      .getObjectDetection(imageFile)
      .pipe(
        switchMap((classes) => {
          this.imageClasses = classes;
          return this.textPredictionApiService.getData(this.imageClasses);
        })
      )
      .subscribe(({ sentences }) => {
        this.generatedTexts = sentences;
      });
  }
  //Function used to convert Base
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
    this.myImage = '';

    this.croppedImage = null;
    this.photoCaptured = false;
    this.aiSelectedText = '';
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
