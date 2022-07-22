import { Component, Input, OnInit } from '@angular/core';
import { faCheckDouble, faHand } from '@fortawesome/free-solid-svg-icons';
import { Game } from 'src/app/models/game';

@Component({
  selector: 'app-room-players-display',
  templateUrl: './room-players-display.component.html',
  styleUrls: ['./room-players-display.component.css']
})
export class RoomPlayersDisplayComponent implements OnInit {
  @Input() game!: Game;
  @Input() userId!: string;
  

  readyIcon = faCheckDouble;
  meIcon = faHand;

  constructor() { }

  ngOnInit(): void {
  }

  copyLink(): void {
    /* Copy the text inside the text field */
    navigator.clipboard.writeText(`${window.location.origin}/battles/${this.game.id}`);
  }

}
