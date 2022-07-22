import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestSourceWordComponent } from './test-source-word.component';

describe('TestSourceWordComponent', () => {
  let component: TestSourceWordComponent;
  let fixture: ComponentFixture<TestSourceWordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestSourceWordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestSourceWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
