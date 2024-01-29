import { TestBed } from '@angular/core/testing';

import { TypewiseAPIService } from './typewise-api.service';

describe('TypewiseAPIService', () => {
  let service: TypewiseAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypewiseAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
