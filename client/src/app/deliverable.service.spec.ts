import { TestBed } from '@angular/core/testing';

import { DeliverableService } from './deliverable.service';

describe('DeliverableService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeliverableService = TestBed.get(DeliverableService);
    expect(service).toBeTruthy();
  });
});
