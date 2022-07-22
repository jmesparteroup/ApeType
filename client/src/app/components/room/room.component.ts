import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { Game } from 'src/app/models/game';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
})
export class RoomComponent implements OnInit, OnDestroy {
  game: Game = {
    id: '',
    creatorId: '',
    creatorReady: false,
    testType: '',
    testLevel: 0, 
    players: [],
    testcase: [],
    readyToStart: false,
    rankings: [],
  };

  public roomId: string = '';
  public userId: string = this.cookieService.get('user') || '';
  public gameStart: boolean = false;

  public testTypes: string[] = ['time','words', 'quote'];
  public testParam: any = {
    time: [15, 30, 60, 120],
    words: [10, 25, 50, 100],
    quote: ['short', 'medium', 'long', 'thicc'],
  };
  public activeType: string = 'words';
  public activeParam: number = 0;

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.roomId = this.route.snapshot.paramMap.get('id') || this.roomId;
    this.gameService.joinGame(this.roomId);

    this.gameService.gameJoined.subscribe((payload) => {
      this.game = payload.game;
      console.log(this.game);
    });

    this.gameService.gameReady.subscribe((payload) => {
      this.game = payload.game;
      console.log(this.game);
    });

    this.gameService.gameStarted.subscribe((payload) => {
      this.game = payload.game;
      this.gameStart = true;
      console.log(this.game);
    });

    this.gameService.gamePlayerFinish.subscribe((payload) => {
      this.game = payload.game;
      console.log(this.game);
    });

    this.gameService.gameUpdateProgress.subscribe((payload: any) => {
      console.log(payload.players)
      this.game.players = payload.players;
    })

    this.gameService.gameUpdatedOptions.subscribe((payload: any) => {
      console.log(payload.game)
      this.game = payload.game;
    })

    this.gameService.gamePlayerLeave.subscribe((payload) => {
      this.game = payload.game;
      console.log(this.game);
    }
    );
  }

  ngOnDestroy(): void {
    this.gameService.leaveGame(this.game.id);
  }

  onClickType(type: string): void {
    this.activeType = type;
    this.activeParam = this.activeParam;
    this.gameService.updateOptions(this.game.id, this.activeType, this.activeParam);
  }

  onClickParam(paramIndex: number): void {
    this.activeParam = paramIndex;
    this.gameService.updateOptions(this.game.id, this.activeType, this.activeParam);
  }

  start() {
    this.gameService.startGame(this.game.id, this.activeType, this.activeParam);
  }

  ready() {
    this.gameService.readyPlayer(this.game.id);
  }

  showLobby(){
    this.gameStart = false;
  }

}
