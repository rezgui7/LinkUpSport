import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Natif1617Component } from './natif16-17.component';

describe('Natif1617Component', () => {
  let component: Natif1617Component;
  let fixture: ComponentFixture<Natif1617Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Natif1617Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Natif1617Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
