import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmatchComponent } from './addmatch.component';

describe('AddmatchComponent', () => {
  let component: AddmatchComponent;
  let fixture: ComponentFixture<AddmatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddmatchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddmatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
