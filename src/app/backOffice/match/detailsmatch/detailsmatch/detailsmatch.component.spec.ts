import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsmatchComponent } from './detailsmatch.component';

describe('DetailsmatchComponent', () => {
  let component: DetailsmatchComponent;
  let fixture: ComponentFixture<DetailsmatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsmatchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsmatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
