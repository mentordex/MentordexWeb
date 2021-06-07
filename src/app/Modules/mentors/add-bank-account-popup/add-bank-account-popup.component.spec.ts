import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBankAccountPopupComponent } from './add-bank-account-popup.component';

describe('AddBankAccountPopupComponent', () => {
  let component: AddBankAccountPopupComponent;
  let fixture: ComponentFixture<AddBankAccountPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBankAccountPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBankAccountPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
