import { Component, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { CameraPreview, CameraPreviewOptions,CameraPreviewPictureOptions } from '@capacitor-community/camera-preview'; // Ensure import is correct

@Component({
  selector: 'app-vsd',
  templateUrl: './vsd.component.html',
  styleUrls: ['./vsd.component.css']
})
export class VsdComponent {
  @ViewChild(IonModal) modal!: IonModal;
  public image: string | null = null;
  public cameraActive: boolean = false; 
  public name: string = '';

  constructor() {}

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
    this.stopCamera();
  }

  flipCamera(){
    CameraPreview.flip();
  }
}

