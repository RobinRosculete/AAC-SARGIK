import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { VsdComponent } from '../vsd/vsd.component';
import {
  MatDialog,
  MatDialogRef,
  MatDialogConfig,
} from '@angular/material/dialog';

@Component({
  selector: 'app-navmenu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css'],
})
export class NavmenuComponent {
  constructor(private authService: AuthService) {}

  signOut() {
    return this.authService.googleSignOut();
  }
  isLoggedIn() {
    return this.authService.isAuthenticated();
  }
}
