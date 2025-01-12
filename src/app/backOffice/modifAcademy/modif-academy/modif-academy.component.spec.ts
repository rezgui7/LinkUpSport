import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifAcademyComponent } from './modif-academy.component';

describe('ModifAcademyComponent', () => {
  let component: ModifAcademyComponent;
  let fixture: ComponentFixture<ModifAcademyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifAcademyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifAcademyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
