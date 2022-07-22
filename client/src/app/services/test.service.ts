import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import { Test } from '../models/test';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  public apiUrl = 'http://localhost:3001'; // URL to web api

  constructor(private http: HttpClient) { }

  getTest(type: String, typeName: String, level: Number): Observable<Test> {
    return this.http.get<Test>(`${this.apiUrl}/tests?type=${type}&${typeName}=${level}`);
  }
  
}
