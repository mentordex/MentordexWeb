import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseMembershipSuccessComponent } from './purchase-membership-success.component';

describe('PurchaseMembershipSuccessComponent', () => {
  let component: PurchaseMembershipSuccessComponent;
  let fixture: ComponentFixture<PurchaseMembershipSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseMembershipSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseMembershipSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
