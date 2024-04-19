import { Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { VsdComponent } from '../vsd/vsd.component';
import {
  MatDialog,
  MatDialogRef,
  MatDialogConfig,
} from '@angular/material/dialog';

import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-navmenu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css'],
})
export class NavmenuComponent {
  constructor(private authService: AuthService) {}

  vsdOpened: boolean = false;

  @ViewChild(IonModal) modal!: IonModal;

  signOut() {
    return this.authService.googleSignOut();
  }
  isLoggedIn() {
    return this.authService.isAuthenticated();
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
  }

  toggleVsd() {
    this.vsdOpened = !this.vsdOpened;
  }
}
