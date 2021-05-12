import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBookingRequestComponent } from './update-booking-request.component';

describe('UpdateBookingRequestComponent', () => {
  let component: UpdateBookingRequestComponent;
  let fixture: ComponentFixture<UpdateBookingRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateBookingRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateBookingRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
