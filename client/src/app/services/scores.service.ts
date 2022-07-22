import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { Observable } from 'rxjs';
import { RankingData } from '../models/ranking-data';
import { TestResult } from '../models/test';

@Injectable({
  providedIn: 'root'
})
export class ScoresService {
  serverUrl = 'http://localhost:3001';
  


  constructor(private cookieService: CookieService, private http: HttpClient) { }

  recoredScore (testResult: TestResult){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.cookieService.get('token') || '',
      }),
    };
    return this.http.post(`${this.serverUrl}/scores`, testResult, httpOptions);
  }
  
  getLeaderboard (level: number): Observable<RankingData[]>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.cookieService.get('token') || '',
      }),
    };
    return this.http.get<RankingData[]>(`${this.serverUrl}/scores/leaderboards/${level}`, httpOptions);
  }

}
