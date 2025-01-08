import { TestBed } from '@angular/core/testing';

import { ServiceBackService } from './service-back.service';

describe('ServiceBackService', () => {
  let service: ServiceBackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceBackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
