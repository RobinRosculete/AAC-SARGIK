import { Component } from '@angular/core';
import { KeyboardComponent } from '../keyboard/keyboard.component';
import { NavmenuComponent } from '../nav-menu/nav-menu.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor() {} // Injecting NavmenuComponent
}
