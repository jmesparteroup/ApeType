import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { Socket } from 'ngx-socket-io';
import { Game, StartPayload } from '../models/game';
import { TestData } from '../models/test';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  gameCreated = this.socket.fromEvent<any>('gameCreated');
  gameJoined = this.socket.fromEvent<any>('gameJoined');
  gameReady = this.socket.fromEvent<any>('gameReady');
  gameStarted = this.socket.fromEvent<any>('gameStarted');
  gamePlayerFinish = this.socket.fromEvent<any>('gamePlayerFinish');
  gameUpdateProgress = this.socket.fromEvent<any>('gameUpdateProgress');
  gameUpdatedOptions = this.socket.fromEvent<any>('gameUpdatedOptions');
  gamePlayerLeave = this.socket.fromEvent<any>('gameLeft');
  gameLeaderboard = this.socket.fromEvent<any>('gameLeaderboard');

  constructor(private socket: Socket, private cookieService: CookieService) {}

  getGame(gameId: string): void {
    this.socket.emit('getGame', { gameId });
  }

  createGame(): void {
    this.socket.emit('createGame', {
      creatorId: this.cookieService.get('user'),
    });
  }

  joinGame(gameId: string): void {
    this.socket.emit('joinGame', {
      gameId,
      playerId: this.cookieService.get('user'),
    });
  }

  readyPlayer(gameId: string): void {
    this.socket.emit('readyPlayer', {
      gameId,
      playerId: this.cookieService.get('user'),
    });
  }

  startGame(gameId: string, type: string, level: number): void {
    const payload: StartPayload = { gameId, type, level };
    
    switch (type) {
      case 'time':
          payload.time = level;
        break;
    
      case 'words':
          payload.numWords = level;
        break;
    
      case 'quote':
          payload.quoteLength = level;
        break;
    
      default:
        break;
    }

    this.socket.emit('startGame', payload);
  }

  updateOptions(gameId: string, type: string, level: number): void {
    const payload: StartPayload = { gameId, type, level };
    console.log(payload);
    
    switch (type) {
      case 'time':
          payload.time = level;
        break;
    
      case 'words':
          payload.numWords = level;
        break;
    
      case 'quote':
          payload.quoteLength = level;
        break;
    
      default:
        break;
    }

    this.socket.emit('updateOptions', payload);
  }

  finishPlayer(gameId: string, wpm: number, accuracy: number): void {
    console.log('finishPlayer');
    this.socket.emit('finishPlayer', {
      gameId,
      playerId: this.cookieService.get('user'),
      wpm,
      accuracy,
    });
  }

  resetGame(gameId: string): void {
    this.socket.emit('resetGame', { gameId });
  }

  updateProgress(progress: TestData, gameId: string): void {
    const payload: any = {
      gameId,
      playerId: this.cookieService.get('user'),
      progress,
    }
    this.socket.emit('updateProgress', payload);
  }

  leaveGame(gameId: string): void {
    this.socket.emit('leaveGame', { gameId, playerId: this.cookieService.get('user') });
  }


}
