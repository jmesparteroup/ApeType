import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { newUser } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public joinIcon = faUserPlus;
  constructor(private fb: FormBuilder, private usersService: UsersService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  // registerForm FormGroup
  // username, password, email, firstName, lastName
  public registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(3)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(3)]],
    firstName: ['', [Validators.required, Validators.minLength(3)]],
    lastName: ['', [Validators.required, Validators.minLength(3)]],
  });

  public addUser(): void {
    const { email, password: userPassword, firstName, lastName } = this.registerForm.value;
    if (!email || !userPassword || !firstName || !lastName) return;

    const user: newUser =  {
      email,
      userPassword,
      firstName,
      lastName,
    }
    this.usersService.addUser(user).subscribe((res) => {
      console.log(res);
      this.authService.login(res.userID, decodeURI(res.token), res.role);
      this.router.navigate(['/']);
    });
    
  }

}
