import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTemplateUserComponent } from './all-template-user.component';

describe('AllTemplateUserComponent', () => {
  let component: AllTemplateUserComponent;
  let fixture: ComponentFixture<AllTemplateUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllTemplateUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllTemplateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
