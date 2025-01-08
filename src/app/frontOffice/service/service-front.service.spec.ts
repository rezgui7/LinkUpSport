import { TestBed } from '@angular/core/testing';

import { ServiceFrontService } from './service-front.service';

describe('ServiceFrontService', () => {
  let service: ServiceFrontService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceFrontService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
