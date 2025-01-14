import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationTournoiComponent } from './organisation-tournoi.component';

describe('OrganisationTournoiComponent', () => {
  let component: OrganisationTournoiComponent;
  let fixture: ComponentFixture<OrganisationTournoiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganisationTournoiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganisationTournoiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
