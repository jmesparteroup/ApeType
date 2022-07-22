import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TestConfig } from 'src/app/models/test-config';
import { TestConfigService } from 'src/app/services/test-config.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Login, LoginState } from 'src/app/models/user';
import { faHouseChimneyUser, faKeyboard, faTrophy, faUsers } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  public testTypes: string[] = ['time', 'words', 'quote'];
  public testParam: any = {
    time: [15, 30, 60, 120],
    words: [10, 25, 50, 100],
    quote: ['short', 'medium', 'long', 'thicc'],
  };
  public activeType: string = 'words';
  public activeParam: number = 0;
  public isLoggedin: boolean = false;
  public login?: Login;

  public battleIcon = faUsers;
  public homeIcon = faKeyboard;
  public leaderboardIcon = faTrophy;
  public userIcon = faHouseChimneyUser;

  constructor(
    private testConfigService: TestConfigService,
    private authService: AuthService,
    public router: Router,
  ) {
    
  }

  ngOnInit(): void {
    this.updateConfig();
    this.authService.authStream$.subscribe((login: Login) => {
      this.login = login;
      this.isLoggedin = login.state === LoginState.LOGGED_IN
      console.log(login)
    })
  }

  onClickType(type: string): void {
    this.activeType = type;
    this.activeParam = this.activeParam;
    this.updateConfig();
  }

  updateConfig(): void {
    let newConfig: TestConfig = {
      type: this.activeType,
      level: this.activeParam,
    };
    this.testConfigService.setTestConfig(newConfig);
  }

  onClickParam(paramIndex: number): void {
    this.activeParam = paramIndex;
    this.updateConfig();
  }

  logout(): void {
    this.authService.logout()
    this.router.navigate(['/users']);
  }
}
