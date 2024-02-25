import { Component } from '@angular/core';
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
})
export class GalleryComponent {
  images: number[] = [1, 2, 3, 4, 5];
  constructor() {}
  ngOnInit(): void {
    setTimeout(() => {
      // Load images after a small delay to allow container to calculate its height
      this.images = [1, 2, 3, 4, 5];
    }, 100);
  }
}
