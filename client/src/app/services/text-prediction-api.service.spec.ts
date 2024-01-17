import { TestBed } from '@angular/core/testing';

import { TextPredictionApiService } from './text-prediction-api.service';

describe('TextPredictionApiService', () => {
  let service: TextPredictionApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TextPredictionApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
