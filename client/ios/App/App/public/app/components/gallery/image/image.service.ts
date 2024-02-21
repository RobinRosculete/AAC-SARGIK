import { Injectable } from "@angular/core";

@Injectable()

export class ImageService{
    visibleImages:{id:number; category:string;caption:string;url:string}[] = [];
    getImages(){
        return this.visibleImages = IMAGES.slice(0);
    //getImage(id: number){
        //return IMAGES.slice(0).find(image => image.id == id);
    }
}


const IMAGES = [
    {"id": 1, "category": "computer","caption":"view from a computer","url":"assets/images/computer_01.jpeg"},
    {"id": 2, "category": "computer","caption":"view from a laptop","url":"assets/images/computer_02.jpeg"},
    {"id": 3, "category": "computer","caption":"view from a pad","url":"assets/images/computer_03.jpeg"}
    //{"id": 4, "category": "computer","caption":"view from a computer","url":"assets/images/computer_01.jpeg"}
    //{"id": 5, "category": "computer","caption":"view from a computer","url":"assets/images/computer_01.jpeg"}
    //{"id": 6, "category": "computer","caption":"view from a computer","url":"assets/images/computer_01.jpeg"}
]


