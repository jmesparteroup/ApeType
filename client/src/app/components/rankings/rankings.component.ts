import { Component, Input, OnInit } from '@angular/core';
import { RankingData } from 'src/app/models/ranking-data';
import { ScoresService } from 'src/app/services/scores.service';
import * as moment from 'moment';
import { faCrown, faUserCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-rankings',
  templateUrl: './rankings.component.html',
  styleUrls: ['./rankings.component.css'],
})
export class RankingsComponent implements OnInit {
  @Input() level: number = 15;
  
  public rankingData: RankingData[] = [];
  public moment = moment;
  public userIcon = faUserCircle;
  public crownIcon = faCrown;
  public levels: number[] =  [];

  public currentActiveTab = 0;





  constructor(private scoresService: ScoresService) {
  }

  onTabChange(tabIndex: number) {
    this.currentActiveTab = tabIndex;
    this.getRankingData(this.levels[tabIndex]);
  }

  getRankingData(level: number): void {
    this.scoresService.getLeaderboard(level).subscribe((data) => {
      this.rankingData = data;
      console.log(this.rankingData);
    }
    );
  }

  ngOnInit(): void {
    this.getRankingData(this.level);
    this.levels.push(this.level);
    this.levels.push(this.level *2);

  }
}
