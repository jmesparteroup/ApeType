import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { UserLogin } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public loginIcon = faArrowRightToBracket;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(3)]],
  });

  public login(): void {
    const { email, password } = this.loginForm.value;
    if (!email || !password) return;

    const loginDetails: UserLogin = {
      email,
      password,
    };

    this.usersService.login(loginDetails).subscribe((res) => {
      this.authService.login(res.userID, decodeURI(res.token), res.role);
      this.router.navigate(['/'])
    });
  }
}
