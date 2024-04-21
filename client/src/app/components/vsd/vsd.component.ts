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
  protected generatedTexts: string[] = [
    'No Generated Text, Classes not detected in the image.',
  ];
  protected imageChangedEvent: any = '';
  protected croppedImage: any = '';
  protected aiSelectedText: string = '';
  protected file: File | null = null;
  cropperPosition: CropperPosition = { x1: 0, y1: 0, x2: 0, y2: 0 };

  constructor(
    private sharedService: SharedService,
    private keyboardService: KeyboardService,
    private textPredictionApiService: TextPredictionApiService,
    private objectDetectionService: ObjectDetectionService
  ) {}

  ngOnInit(): void {
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
      quality: 100,
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
}
