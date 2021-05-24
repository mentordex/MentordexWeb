import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpgradeMembershipComponent } from './upgrade-membership.component';

describe('UpgradeMembershipComponent', () => {
  let component: UpgradeMembershipComponent;
  let fixture: ComponentFixture<UpgradeMembershipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpgradeMembershipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpgradeMembershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
