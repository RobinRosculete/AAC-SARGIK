import { Component } from '@angular/core';
import { ImageService } from './image/image.service';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
})
export class GalleryComponent {
  images: string[] = [
    '../assets/images/Gallery Test Images/1.jpg',
    '../assets/images/Gallery Test Images/2.jpg',
    '../assets/images/Gallery Test Images/3.jpg',
  ];
}
