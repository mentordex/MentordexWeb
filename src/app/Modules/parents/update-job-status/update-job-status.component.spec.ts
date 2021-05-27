import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateJobStatusComponent } from './update-job-status.component';

describe('UpdateJobStatusComponent', () => {
  let component: UpdateJobStatusComponent;
  let fixture: ComponentFixture<UpdateJobStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateJobStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateJobStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
