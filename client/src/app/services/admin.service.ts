import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { Observable } from 'rxjs';
import { Word } from '../models/words';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  serverUrl = 'http://localhost:3001';

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  getAllWords(): Observable<Word[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.cookieService.get('token') || '',
      }),
    };
    return this.http.get<Word[]>(`${this.serverUrl}/admin/words`, httpOptions);
  }

  addWord(word: Word): Observable<Word> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.cookieService.get('token') || '',
      }),
    };
    return this.http.post<Word>(`${this.serverUrl}/admin/words`, word, httpOptions);
  }

  updateWord(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.cookieService.get('token') || '',
      }),
    };

    const payload = {
      word: data[0],
      newWord: data[1],
    }

    return this.http.patch<Word>(`${this.serverUrl}/admin/words`, payload, httpOptions);
  }

  deleteWord(word: Word): Observable<Word> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.cookieService.get('token') || '',
      }),
    };
    return this.http.delete<Word>(`${this.serverUrl}/admin/words/${word.word}`, httpOptions);
  }

}
