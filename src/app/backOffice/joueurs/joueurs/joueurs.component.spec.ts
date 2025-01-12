import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoueursComponent } from './joueurs.component';

describe('JoueursComponent', () => {
  let component: JoueursComponent;
  let fixture: ComponentFixture<JoueursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoueursComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoueursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
