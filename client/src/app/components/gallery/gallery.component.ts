import { Component, ViewChildren, QueryList } from '@angular/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { BlobApiService } from 'src/app/services/blob/blob-api.service';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';
import { Image } from 'src/app/models/image.interfacce';
import { ToastController, LoadingController } from '@ionic/angular';
import { Camera, CameraResultType } from '@capacitor/camera';
import { SharedService } from '../shared.service';
import { BoundingBox } from 'src/app/models/boundbox.interface';

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
  protected cropperCoordinates: any = { x1: 0, y1: 0, w: 0, h: 0 };
  protected showImageCropper: boolean = false;
  protected showInputBox: boolean = false;
  protected showRedBox: boolean = false;
  protected cropperButtons: boolean = true;
  protected redBoxLeft: number = 0;
  protected redBoxTop: number = 0;
  protected redBoxWidth: number = 0;
  protected redBoxHeight: number = 0;
  protected boundingBoxInput: string = '';
  protected boundingBoxes: BoundingBox[] = [];
  protected confirmButton: boolean = false;
  protected hotspotButton: string = 'Add Hot Spot';
  protected speakerButton: boolean = true;
  protected showBoundingBoxButtons: boolean = false;
  protected clickedImageWidth: number = 0;
  protected clickedImageHeight: number = 0;

  @ViewChildren(IonModal) ionModals!: QueryList<IonModal>;
  imageChangedEvent: any = '';

  constructor(
    protected blobAPI: BlobApiService,
    private loadingCtrl: LoadingController,
    private sharedService: SharedService,

    private toastController: ToastController
  ) {}

  //Used for opening the VSD MOdel to allow user tyo upload image to the gallery
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

  //User to read the caption od the images
  readCaption(caption: string): void {
    TextToSpeech.speak({ text: caption });
  }

  //Getting user toke from local storage for http requests
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

  openModal(index: number): void {
    const modal = this.ionModals.toArray()[index];
    if (modal) {
      this.modals[index].index = index;
      modal.present();
      modal.onDidDismiss().then(() => {
        this.resetSettings();
      });
    }
  }

  cancel(index: number): void {
    const modal = this.ionModals.toArray()[index];
    if (modal) {
      modal.dismiss(null, 'cancel');
      this.resetCropping();
    }
  }

  confirm(index: number): void {
    const modal = this.ionModals.toArray()[index];
    if (modal) {
      modal.dismiss(this.modals[index].name, 'confirm');
    }
  }

  onWillDismiss(event: CustomEvent<OverlayEventDetail>, index: number): void {
    if (event.detail.role === 'confirm') {
      // Reset the cropping state
      this.resetCropping();
    }
    // Reset the modal state
    this.modals[index].index = -1;
    this.modals[index].name = '';
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

  // Method for managing the ImageCropper menu
  toggleImageCropper() {
    this.showImageCropper = !this.showImageCropper;
    this.confirmButton = !this.confirmButton;
    this.speakerButton = !this.speakerButton;
    this.hotspotButton =
      this.hotspotButton === 'Add Hot Spot' ? 'Back' : 'Add Hot Spot';
  }

  getPosition(cropperPosition: any, index: number) {
    // You can also store it in a variable for later use
    console.log(cropperPosition);
    this.cropperCoordinates.x1 = cropperPosition.cropperPosition.x1;
    this.cropperCoordinates.x2 = cropperPosition.cropperPosition.x2;
    this.cropperCoordinates.y1 = cropperPosition.cropperPosition.y1;
    this.cropperCoordinates.y2 = cropperPosition.cropperPosition.y2;
  }
  //Function to show bounding Box
  showBox() {
    // Set the position and size of the red box based on the coordinates
    this.redBoxLeft = this.cropperCoordinates.x1;
    this.redBoxTop = this.cropperCoordinates.y1;
    this.redBoxWidth = this.cropperCoordinates.x2 - this.cropperCoordinates.x1; //Calculating the width of the box
    this.redBoxHeight = this.cropperCoordinates.y2 - this.cropperCoordinates.y1; //Calculating the height of the box

    // Show the red box
    this.cropperButtons = false;
    this.showImageCropper = false;
    this.showRedBox = true;
    this.showInputBox = true;
    this.showBoundingBoxButtons = true;
  }

  //Method to present notification message to the user when saving ore deleting a image is loaded
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      position: 'top',
    });
    await toast.present();
  }

  //Method to send bounding box information to the database
  sendBoundingBoxInfo(imageID: number): void {
    // Initialize a new BoundingBoxDTO object
    let boundBox: BoundingBox = {
      imageID: imageID,
      xMin: this.cropperCoordinates.x1,
      yMin: this.cropperCoordinates.y1,
      xMax: this.cropperCoordinates.x2,
      yMax: this.cropperCoordinates.y2,
      label: 'no label',
      message: this.boundingBoxInput,
    };

    // Send the bounding box information to the server
    this.blobAPI.saveBoundingBox(boundBox).subscribe(
      async (response) => {
        console.log('Bounding box information saved successfully:', response);

        // Show a toast notification
        await this.presentToast('Bounding box information saved successfully');

        // Find the index of the modal matching the current image
        const index = this.images.findIndex(
          (image) => image.imageID === imageID
        );

        // Reopen the modal
        this.reopenModal(index);
      },
      (error) => {
        console.error('Error saving bounding box information:', error);
      }
    );
  }

  //method to return to main page of modal after saving bounding box information
  reopenModal(index: number): void {
    const modal = this.ionModals.toArray()[index];
    if (modal) {
      modal.dismiss(null, 'confirm');
      setTimeout(() => {
        this.openModal(index);
        this.getBoundingBoxes(this.images[index].imageID);
      }, 500);
    }
  }

  //Function used ti reset coordinates of bonding box
  resetCropping(): void {
    this.cropperCoordinates.x1 = 0;
    this.cropperCoordinates.y1 = 0;
    this.cropperCoordinates.x2 = 0;
    this.cropperCoordinates.y2 = 0;
    this.boundingBoxInput = '';
    this.showImageCropper = false;
    this.showRedBox = false;
    this.showInputBox = false;
    this.cropperButtons = true;
  }

  getBoundingBoxes(imageId: number): void {
    this.blobAPI.getBoundingBox(imageId).subscribe(
      (response) => {
        this.boundingBoxes = response;
        console.log(this.boundingBoxes);
      },
      (error) => {
        console.error('Error getting bounding boxes:', error);
      }
    );
  }

  goBackToDrawing() {
    this.showImageCropper = true;
    this.showRedBox = false;
    this.showInputBox = false;
    this.cropperButtons = true;
    this.showBoundingBoxButtons = false;
  }

  //reseating all setting to default when user exits modal
  resetSettings(): void {
    this.myImage = null;
    this.caption = '';
    this.croppedImage = '';
    this.modals.forEach((modal) => {
      modal.index = -1;
      modal.name = '';
    });
    this.showImageCropper = false;
    this.showInputBox = false;
    this.showRedBox = false;
    this.cropperButtons = true;
    this.redBoxLeft = 0;
    this.redBoxTop = 0;
    this.redBoxWidth = 0;
    this.redBoxHeight = 0;
    this.boundingBoxInput = '';
    this.boundingBoxes = [];
    this.confirmButton = false;
    this.hotspotButton = 'Add Hot Spot';
    this.speakerButton = true;
    this.showBoundingBoxButtons = false;
    this.clickedImageWidth = 0;
    this.clickedImageHeight = 0;
    // Reset other settings as needed
  }
}
