import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowItWorksParentsComponent } from './how-it-works-parents.component';

describe('HowItWorksParentsComponent', () => {
  let component: HowItWorksParentsComponent;
  let fixture: ComponentFixture<HowItWorksParentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HowItWorksParentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HowItWorksParentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
