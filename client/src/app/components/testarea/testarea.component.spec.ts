import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestareaComponent } from './testarea.component';

describe('TestareaComponent', () => {
  let component: TestareaComponent;
  let fixture: ComponentFixture<TestareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestareaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
