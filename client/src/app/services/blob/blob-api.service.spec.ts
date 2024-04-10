import { TestBed } from '@angular/core/testing';

import { BlobApiService } from './blob-api.service';

describe('BlobApiService', () => {
  let service: BlobApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlobApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
