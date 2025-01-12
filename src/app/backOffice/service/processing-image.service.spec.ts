import { TestBed } from '@angular/core/testing';

import { ProcessingImageService } from './processing-image.service';

describe('ProcessingImageService', () => {
  let service: ProcessingImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessingImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
