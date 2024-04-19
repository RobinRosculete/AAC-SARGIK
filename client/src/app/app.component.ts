import { Component } from '@angular/core';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'client';
  constructor() {
    defineCustomElements(window);
  }
}
