import { Component } from '@angular/core';
import {NavController} from '@ionic/angular';


//import { Router } from '@angular/router';
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent {
  //title = 'Gallery';
  galleryType = 'regular';
  constructor(public imageService: NavController){}  
 
}
