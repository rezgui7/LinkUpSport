import { TestBed } from '@angular/core/testing';

import { AcademieResolverService } from './academie-resolver.service';

describe('AcademieResolverService', () => {
  let service: AcademieResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcademieResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
