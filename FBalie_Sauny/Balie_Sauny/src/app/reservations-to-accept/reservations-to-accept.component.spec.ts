import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationsToAcceptComponent } from './reservations-to-accept.component';

describe('ReservationsToAcceptComponent', () => {
  let component: ReservationsToAcceptComponent;
  let fixture: ComponentFixture<ReservationsToAcceptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationsToAcceptComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservationsToAcceptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
