// AuthService
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { User } from '@codetrix-studio/capacitor-google-auth';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Router } from '@angular/router';
import { isPlatform } from '@ionic/angular';
import { UserModel } from 'src/app/models/user.interface';
import { UserLoginResponse } from 'src/app/models/user.login.response.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userModel!: UserModel;
  private userResponse!: UserLoginResponse;

  constructor(protected http: HttpClient, private router: Router) {}

  //Function to check if token is stored in local storage
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  //Function to return token if stored in local storage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  //Function Used to make http request to the server to login and retrieve JWT token
  login(item: UserModel): Observable<UserLoginResponse> {
    var url = environment.SERVER_URL + '/api/User/LoginWithGoogle';
    return this.http.post<UserLoginResponse>(url, item);
  }

  signOut(): void {
    localStorage.removeItem('token'); // Remove the token from storage
    this.router.navigate(['/login']);
  }

  //Method used to SingIn users with google
  async googleSignIn() {
    try {
      const user = await GoogleAuth.signIn();

      if (user && user.authentication && user.authentication.accessToken) {
        //if successful login create a new user model to send to API server
        this.userModel = {
          googleId: user.id,
          EmailAddress: user.email,
          FirstName: user.givenName,
          LastName: user.familyName,
          PictureUrl: user.imageUrl,
        };

        //Calling login method to send data to API server
        this.login(this.userModel).subscribe((response: UserLoginResponse) => {
          this.userResponse = response; //Return user successfully authenticated data
          localStorage.setItem('token', response.token); //Store the token in local storage from server
          this.router.navigate(['/']);
        });
        return 'Successfully Singed in with Googe!';
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
