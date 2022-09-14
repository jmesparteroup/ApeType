import { Component, Input, OnInit } from '@angular/core';
import { faCrown, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { Player } from 'src/app/models/game';

@Component({
  selector: 'app-room-rankings',
  templateUrl: './room-rankings.component.html',
  styleUrls: ['./room-rankings.component.css'],
})
export class RoomRankingsComponent implements OnInit {
  @Input() set setRankingData(val: Player[]) {
    // sort by wpm and accuracy

    this.rankingData = val.sort((a, b) => {
      if (a.wpm > b.wpm) {
        return -1;
      } else if (a.wpm < b.wpm) {
        return 1;
      } else {
        if (a.accuracy > b.accuracy) {
          return -1;
        } else if (a.accuracy < b.accuracy) {
          return 1;
        } else {
          return 0;
        }
      }
    });
  }
  public rankingData: Player[] = [];
  public userIcon = faUserCircle;
  public crownIcon = faCrown;
  public levels: number[] = [];

  constructor() {}

  ngOnInit(): void {}
}
