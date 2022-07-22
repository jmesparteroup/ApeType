import { TestBed } from '@angular/core/testing';

import { TestConfigService } from './test-config.service';

describe('TestConfigService', () => {
  let service: TestConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
