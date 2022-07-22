import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestSourceQuotesComponent } from './test-source-quotes.component';

describe('TestSourceQuotesComponent', () => {
  let component: TestSourceQuotesComponent;
  let fixture: ComponentFixture<TestSourceQuotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestSourceQuotesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestSourceQuotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
