import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { BehaviorSubject, Subject } from 'rxjs';
import { Login, LoginState } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public authStream$ = new BehaviorSubject<Login>({
    user: this.cookieService.get('user'),
    state: !!this.cookieService.get('token')
      ? LoginState.LOGGED_IN
      : LoginState.LOGGED_OUT,
  });

  constructor(private cookieService: CookieService) {}

  login(user: string, token: string, role: string) {
    this.cookieService.put('user', user);
    this.cookieService.put('token', token);

    const login: Login = {
      user,
      state: LoginState.LOGGED_IN,
      role,
    };
    this.authStream$.next(login);
  }

  logout() {
    this.cookieService.remove('user');
    this.cookieService.remove('token');
    const login: Login = {
      user: undefined,
      state: LoginState.LOGGED_OUT,
    };
    this.authStream$.next(login);
  }
}
