import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { TestConfig } from '../models/test-config';

@Injectable({
  providedIn: 'root',
})
export class TestConfigService {
  public testConfigStream$ = new BehaviorSubject<TestConfig>({
    type: 'words',
    level: 0,
  });

  constructor() {}

  setTestConfig(testConfig: TestConfig) {
    this.testConfigStream$.next(testConfig);
  }
}
