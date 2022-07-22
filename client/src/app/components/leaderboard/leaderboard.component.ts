import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

  currentActiveTab = 0;

  constructor() { }

  ngOnInit(): void {
  }

  onTabChange(tabIndex: number) {
    this.currentActiveTab = tabIndex;
  }

}
