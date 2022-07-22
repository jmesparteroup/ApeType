import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {

  public roomId: string = '';

  constructor(private router: Router, private gameService: GameService) { }

  ngOnInit(): void {
    this.gameService.gameCreated.subscribe((payload) => {
      console.log(`roomId: ${payload.gameId}`);
      this.router.navigate(['/battles', payload.gameId]);
    });
  }

  joinRoom(): void {
    this.router.navigate(['/battles', this.roomId]);
  }

  createRoom(): void {
    this.gameService.createGame();
  }

}
