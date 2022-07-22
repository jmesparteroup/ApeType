import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomPlayersDisplayComponent } from './room-players-display.component';

describe('RoomPlayersDisplayComponent', () => {
  let component: RoomPlayersDisplayComponent;
  let fixture: ComponentFixture<RoomPlayersDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomPlayersDisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomPlayersDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
