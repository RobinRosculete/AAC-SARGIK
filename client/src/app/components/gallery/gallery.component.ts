import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
})
export class GalleryComponent {
  //captions:{[key:number]:string}={};
  images = [
    {number:1, caption:'peacock'},
    {number:2, caption:'red flower'},
    {number:3, caption:'sea'},
    {number:4, caption:'white flower'},
    {number:5, caption:'flower'}
  ];
  //title = 'Gallery';
  //constructor(private imageService: ImageService){}  
  //image: number = 1;//declear for image number
  constructor(){
    //for(let i=1;i<=5;i++){
      //this.captions[i]='';
    //}
    }

 
  }
