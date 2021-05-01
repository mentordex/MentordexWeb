import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyMembershipPlanComponent } from './my-membership-plan.component';

describe('MyMembershipPlanComponent', () => {
  let component: MyMembershipPlanComponent;
  let fixture: ComponentFixture<MyMembershipPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyMembershipPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyMembershipPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
