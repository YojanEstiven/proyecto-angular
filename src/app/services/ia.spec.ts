import { TestBed } from '@angular/core/testing';

import { Ia } from './ia';

describe('Ia', () => {
  let service: Ia;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ia);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
private apiKey =
    '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';
