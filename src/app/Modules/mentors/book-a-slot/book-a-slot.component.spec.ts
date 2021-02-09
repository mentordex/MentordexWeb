import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookASlotComponent } from './book-a-slot.component';

describe('BookASlotComponent', () => {
  let component: BookASlotComponent;
  let fixture: ComponentFixture<BookASlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookASlotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookASlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
