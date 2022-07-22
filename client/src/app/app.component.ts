import { Component, OnInit } from '@angular/core';
import { TestConfig } from './models/test-config';
import { GameService } from './services/game.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'client';

  bannerMessage = '';

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.gameService.gameLeaderboard.subscribe((payload) => {
      this.bannerMessage = payload.message;
      console.log(this.bannerMessage);
      //clear after 10s
      setTimeout(() => {
        this.bannerMessage = '';
      }, 10000);
    });   
  }
}
