import { Component, ViewChild, ElementRef,ChangeDetectorRef  } from '@angular/core';
import { IonModal, Platform } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { CameraPreview, CameraPreviewOptions,CameraPreviewPictureOptions } from '@capacitor-community/camera-preview';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ImageCroppedEvent, ImageCropperComponent,CropperPosition } from 'ngx-image-cropper';

@Component({
  selector: 'app-vsd',
  templateUrl: './vsd.component.html',
  styleUrls: ['./vsd.component.css']
})
export class VsdComponent {
  @ViewChild(IonModal) modal!: IonModal;
  @ViewChild('cropper') cropper!: ImageCropperComponent;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  public image: string | null = null;
  public myImage: string | null = null;
  public cameraActive: boolean = false; 
  public name: string = '';
  public photoCaptured: boolean = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  cropperPosition: CropperPosition = { x1: 0, y1: 0, x2: 0, y2: 0 };
  public captionSectionVisible: boolean = false;
  public captionText: string = '';

  
  constructor(private platform: Platform, private cdr: ChangeDetectorRef) { }


  ngAfterViewInit(): void {

    this.openModal();
  }
  
  openModal() {
    this.modal.present()
  }


  public startCamera(): void {
    const cameraPreviewOptions: CameraPreviewOptions = {
      position: 'rear',
      parent: 'cameraPreview',
      className: 'cameraPreview'
    };
    CameraPreview.start(cameraPreviewOptions);
    this.cameraActive = true;
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
    this.stopCamera();
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
  }
  async stopCamera(){
    await CameraPreview.stop();
    this.cameraActive = false;

  }
  async captureImage(){
    const cameraPreviewPictureOptions: CameraPreviewPictureOptions = {
      quality: 90
    };
    const result = await CameraPreview.capture(cameraPreviewPictureOptions);
    this.image = `data:image/jpeg;base64,${result.value}`;
    this.photoCaptured = true;
    this.croppedImage = null;
    this.stopCamera();
    this.cdr.detectChanges();
    
  }

  retakePhoto() {
    this.image = null;
    this.myImage = null;
    this.croppedImage = null;
    this.photoCaptured = false;
    this.captionSectionVisible = false;
    this.startCamera()
  }

  flipCamera(){
    CameraPreview.flip();
  }
  triggerFileInput() {
    this.fileInput.nativeElement.click();
}

    async selectImageFromGallery() {
      if (this.platform.is('cordova')) {
        try {
          const image = await Camera.getPhoto({
            quality: 90,
            resultType: CameraResultType.Uri,
            source: CameraSource.Photos,
          });

          this.image = image.webPath ?? null;
          this.photoCaptured = true;

        } catch (error) {
          console.error(error);
        }
      } else {
      
        this.triggerFileInput();
      }
    }

    onFileSelected(event: Event) {
      const element = event.currentTarget as HTMLInputElement;
      let file: File | null = null;
  
      if (element.files && element.files.length > 0) {
          file = element.files[0];
      }
  
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              this.image = reader.result as string;
              this.photoCaptured = true;
          };
          reader.readAsDataURL(file);
      }
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
      this.croppedImage = null;
      this.myImage = null;
    } else if (this.image) {
      this.myImage = this.image;
    }
  }

  
  
  confirmCropping() {
    console.log('Cropper Position:', this.cropperPosition);

    if (this.croppedImage) {
        this.image = this.croppedImage;
        this.myImage = null;
        this.croppedImage = null;
        this.photoCaptured = true;
    }
}

generateCaption() {
  this.captionSectionVisible = true;
}

startSpeechToText() {
 
}

confirmCaption() {

}

}