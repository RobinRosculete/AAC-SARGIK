import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { CameraPreview, CameraPreviewOptions,CameraPreviewPictureOptions } from '@capacitor-community/camera-preview';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';

@Component({
  selector: 'app-vsd',
  templateUrl: './vsd.component.html',
  styleUrls: ['./vsd.component.css']
})
export class VsdComponent {
  @ViewChild(IonModal) modal!: IonModal;
  @ViewChild('cropper') cropper!: ImageCropperComponent;
  public image: string | null = null;
  public myImage: string | null = null;
  public cameraActive: boolean = false; 
  public name: string = '';
  public photoCaptured: boolean = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';


  constructor() {}

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
    
  }

  retakePhoto() {
    this.image = null;
    this.photoCaptured = false;
    this.startCamera();
  }

  flipCamera(){
    CameraPreview.flip();
  }
  triggerFileInput() {
    const fileInput: HTMLElement = document.getElementById('file-input') as HTMLElement;
    fileInput.click(); 
  }

  async selectImageFromGallery() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
      });

      this.image = image.webPath ?? null; 
      this.photoCaptured = true;
      this.stopCamera();

    } catch (error) {
      console.error(error);
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  cropImage() {
    if (this.cropper) {
      const croppedImage = this.cropper.crop()?.base64;
      if (croppedImage) {
        this.croppedImage = croppedImage;
        this.image = this.croppedImage;
        // Update the view with the new image, maybe close the cropper or hide it
      } else {
        console.error('Cropping failed');
      }
    } else {
      console.error('Cropper is not initialized');
    }
  }
  editPhoto() {
    this.myImage = this.image; // Prepare the image for cropping
    this.croppedImage = null; // Ensure the cropper is shown again
  }
  
  confirmCropping() {
      this.image = this.croppedImage;

}

}