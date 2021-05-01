import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPaymentMethodPopupComponent } from './add-payment-method-popup.component';

describe('AddPaymentMethodPopupComponent', () => {
  let component: AddPaymentMethodPopupComponent;
  let fixture: ComponentFixture<AddPaymentMethodPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPaymentMethodPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPaymentMethodPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
