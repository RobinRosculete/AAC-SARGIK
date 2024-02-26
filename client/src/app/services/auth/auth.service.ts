import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { GoogleLoginResult } from 'src/app/models/google.login.result.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public tokenKey: string = 'token';

  constructor(protected http: HttpClient) {}

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
}
