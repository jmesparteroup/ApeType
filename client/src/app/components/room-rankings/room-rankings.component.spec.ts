import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomRankingsComponent } from './room-rankings.component';

describe('RoomRankingsComponent', () => {
  let component: RoomRankingsComponent;
  let fixture: ComponentFixture<RoomRankingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomRankingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomRankingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
