import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestSourceComponent } from './test-source.component';

describe('TestSourceComponent', () => {
  let component: TestSourceComponent;
  let fixture: ComponentFixture<TestSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestSourceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
