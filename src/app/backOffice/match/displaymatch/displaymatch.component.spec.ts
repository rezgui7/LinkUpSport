import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaymatchComponent } from './displaymatch.component';

describe('DisplaymatchComponent', () => {
  let component: DisplaymatchComponent;
  let fixture: ComponentFixture<DisplaymatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplaymatchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplaymatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
