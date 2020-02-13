import { TestBed } from '@angular/core/testing';

import { TeamdeliverableService } from './teamdeliverable.service';

describe('TeamdeliverableService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TeamdeliverableService = TestBed.get(TeamdeliverableService);
    expect(service).toBeTruthy();
  });
});
