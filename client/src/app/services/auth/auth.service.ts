// AuthService
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { GoogleLoginResult } from 'src/app/models/google.login.result.interface';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Router } from '@angular/router';
import { isPlatform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public tokenKey: string = 'token';

  constructor(protected http: HttpClient, private router: Router) {
    if (isPlatform('capacitor')) {
      this.initializeApp();
    }
  }

  async initializeApp() {
    await GoogleAuth.initialize({
      clientId: environment.googleClientId,
      scopes: ['profile', 'email'],
      grantOfflineAccess: true,
    });
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  login(item: GoogleLoginResult): Observable<GoogleLoginResult> {
    var url = environment.SERVER_URL + 'api/Account/Login'; //Change path after setting up backend
    return this.http.post<GoogleLoginResult>(url, item);
  }

  signOut(): void {
    localStorage.removeItem('token'); // Remove the token from storage
    this.router.navigate(['/login']);
  }

  async googleSignIn() {
    try {
      const user = await GoogleAuth.signIn();
      if (user && user.authentication && user.authentication.accessToken) {
        localStorage.setItem(this.tokenKey, user.authentication.accessToken);
        this.router.navigate(['/']);
        return user;
      }
    } catch (error) {
      console.error(error);
    }
    return null;
  }

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
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error(error);
    }
  }
}
