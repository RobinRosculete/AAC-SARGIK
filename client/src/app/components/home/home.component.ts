import { Component } from '@angular/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { isPlatform } from '@ionic/angular';
import { environment } from 'src/environments/environment.development';

GoogleAuth.initialize({
  clientId: environment.googleClientId,
  scopes: ['profile', 'email'],
  grantOfflineAccess: true,
});

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  user: any;

  constructor() {
    if (isPlatform('capacitor')) this.initializeApp();
  }

  async initializeApp() {
    await GoogleAuth.initialize();
  }

  //googleSignIn
  async googleSignIn() {
    try {
      this.user = await GoogleAuth.signIn();
      console.log(this.user);
    } catch (error) {
      console.error(error);
    }
  }

  //Google Auth Refresh Token
  async googleRefresh() {
    try {
      const authCode = await GoogleAuth.refresh();
      console.log('refresh: ', authCode);
    } catch (error) {
      console.error(error);
    }
  }

  async googleSignOut() {
    try {
      await GoogleAuth.signOut();
      this.user = null;
    } catch (error) {
      console.error(error);
    }
  }
}
