import { Component } from '@angular/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { isPlatform } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { environment } from 'src/environments/environment.development';

GoogleAuth.initialize({
  clientId: environment.googleClientId,
  scopes: ['profile', 'email'],
  grantOfflineAccess: true,
});

@Component({
  selector: 'app-home',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  user: any;

  constructor(protected authService: AuthService) {
    if (isPlatform('capacitor')) this.initializeApp();
  }

  async initializeApp() {
    await GoogleAuth.initialize();
  }

  //googleSignIn
  async googleSignIn() {
    try {
      this.user = await GoogleAuth.signIn();
      console.log(this.user); // Save token to local storage
      if (
        this.user &&
        this.user.authentication &&
        this.user.authentication.accessToken
      ) {
        localStorage.setItem(
          this.authService.tokenKey,
          this.user.authentication.accessToken
        );
      }
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
      localStorage.removeItem(this.authService.tokenKey);
    } catch (error) {
      console.error(error);
    }
  }
}
