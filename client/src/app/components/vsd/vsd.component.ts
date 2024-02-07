import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-vsd',
  templateUrl: './vsd.component.html',
  styleUrls: ['./vsd.component.css']
})
export class VsdComponent implements AfterViewInit, OnDestroy {
  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvasElement!: ElementRef<HTMLCanvasElement>;
  private stream: MediaStream | null = null;

  ngAfterViewInit(): void {
    this.startCamera();
  }

  ngOnDestroy(): void {
    // Stop the camera stream when the component is destroyed
    if (this.stream) {
      const tracks = this.stream.getTracks();
      tracks.forEach(track => track.stop());
      this.stream = null;
    }
  }

  
  startCamera(): void {
    if (this.videoElement) {
      const video: HTMLVideoElement = this.videoElement.nativeElement;
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(stream => {
            this.stream = stream;
            video.srcObject = stream;
            video.play();
          })
          .catch(err => {
            console.error('Error accessing the camera', err);
          });
      }
    }
  }
  
  captureImage(): void {
    if (this.canvasElement && this.videoElement) {
      const canvas: HTMLCanvasElement = this.canvasElement.nativeElement;
      const context = canvas.getContext('2d');
      const video: HTMLVideoElement = this.videoElement.nativeElement;
  
      if (context && video) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
        const imageDataUrl = canvas.toDataURL('image/png');
        console.log(imageDataUrl);
        // You can now use this imageDataUrl to display the image or upload it
      }
    } else {
      // Handle the case where canvasElement or videoElement is undefined
    }
  }
}
