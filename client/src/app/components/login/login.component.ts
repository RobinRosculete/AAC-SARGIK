// LoginComponent
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
  constructor(private authService: AuthService) {}

  async googleSignIn() {
    await this.authService.googleSignIn();
  }
}
