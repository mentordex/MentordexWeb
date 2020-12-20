import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowItWorksMentorsComponent } from './how-it-works-mentors.component';

describe('HowItWorksMentorsComponent', () => {
  let component: HowItWorksMentorsComponent;
  let fixture: ComponentFixture<HowItWorksMentorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HowItWorksMentorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HowItWorksMentorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
