import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { Observable } from 'rxjs';
import { newUser, User, UserLogin } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  serverUrl = 'http://localhost:3001';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  addUser(user: newUser): Observable<any> {
    return this.http.post<User>(`${this.serverUrl}/users`, user, this.httpOptions);
  }

  login(loginDetails: UserLogin): Observable<any> {
    return this.http.post<any>(`${this.serverUrl}/users/login`, loginDetails, this.httpOptions);
  }

  isLoggedIn(): boolean {
    return !!this.cookieService.get('token');
  }
}
