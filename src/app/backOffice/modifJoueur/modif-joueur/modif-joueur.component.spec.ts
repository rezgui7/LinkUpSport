import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifJoueurComponent } from './modif-joueur.component';

describe('ModifJoueurComponent', () => {
  let component: ModifJoueurComponent;
  let fixture: ComponentFixture<ModifJoueurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifJoueurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifJoueurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
