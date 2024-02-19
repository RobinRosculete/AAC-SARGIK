import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-vsd',
  templateUrl: './vsd.component.html',
  styleUrls: ['./vsd.component.css']
})
export class VsdComponent implements AfterViewInit, OnDestroy {
  @ViewChild('openModalBtn') openModalBtn!: ElementRef;
  @ViewChild('closeModalBtn') closeModalBtn!: ElementRef;
  @ViewChild('modal') modal!: ElementRef;
  @ViewChild('videoElement') videoElement?: ElementRef<HTMLVideoElement>;
  @ViewChild('captureBtn') captureBtn!: ElementRef;
  
  viewInitialized = false;

  private _imageSrc: string | null = null;
  get imageSrc(): string | null {
    return this._imageSrc;
  }
  set imageSrc(value: string | null) {
    this._imageSrc = value;
    if (value === null) {
      this.startWebcam();
    } else {
      this.stopWebcam();
    }
  }

  isMobile: boolean = false;
  private resizeObserver!: ResizeObserver;

  constructor() {
    this.isMobile = window.innerWidth < 768;
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.modal.nativeElement.style.display = 'none';
  
    this.openModalBtn.nativeElement.addEventListener('click', () => {
      this.imageSrc = null; 
      this.modal.nativeElement.style.display = 'flex'; 
      setTimeout(() => this.startWebcam(), 0);
    });
  
  
    this.closeModalBtn.nativeElement.addEventListener('click', () => {
      this.modal.nativeElement.style.display = 'none';
      this.stopWebcam();
      this.imageSrc = null;
    });
  
    this.captureBtn.nativeElement.addEventListener('click', () => {
      const video = this.videoElement?.nativeElement;
      if (video) {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          this.imageSrc = canvas.toDataURL('image/png');
        }
      } else {
        console.error('Video element is not available');
      }
    });
  
    this.handleResize();
  }
  async startWebcam(): Promise<void> {
    if (this.videoElement?.nativeElement) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        this.videoElement.nativeElement.srcObject = stream;
        await this.videoElement.nativeElement.play().catch(error => {
          console.error('Error playing video stream:', error);
        });
      } catch (error) {
        console.error('Error accessing the webcam', error);
      }
    } else {
      console.error('Video element is not available');
    }
  }

  captureImage(): void {
    if (this.videoElement && this.videoElement.nativeElement.srcObject) {
      const video: HTMLVideoElement = this.videoElement.nativeElement;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        this.imageSrc = canvas.toDataURL('image/png');
      }
    }
  }

  private stopWebcam(): void {
    const video = this.videoElement?.nativeElement;
    if (video && video.srcObject) {
      const stream: MediaStream = video.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      video.srcObject = null;
    } else {
      console.error('Video element or srcObject is not available');
    }
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    this.stopWebcam();
  }


  retakeImage(): void {
    this.imageSrc = null;
    setTimeout(() => this.startWebcam(), 0);
  }
    
    private handleResize(): void {
      this.resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
         if (width <= 480) {
            this.modal.nativeElement.style.width = '90%';
            this.modal.nativeElement.style.height = 'auto';
            this.modal.nativeElement.style.transform = 'translate(-50%, -50%)';
            this.modal.nativeElement.style.top = '50%';
            this.modal.nativeElement.style.left = '50%';
         } else {
            this.modal.nativeElement.style.width = '600px';
            this.modal.nativeElement.style.height = '400px';
            this.modal.nativeElement.style.transform = 'translate(-50%, -50%)';
            this.modal.nativeElement.style.top = '50%';
            this.modal.nativeElement.style.left = '50%';
    }
    }
    });
      this.resizeObserver.observe(document.body);
    }
 }
