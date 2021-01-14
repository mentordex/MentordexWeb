import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentsignupComponent } from './parentsignup.component';

describe('ParentsignupComponent', () => {
  let component: ParentsignupComponent;
  let fixture: ComponentFixture<ParentsignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParentsignupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentsignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
