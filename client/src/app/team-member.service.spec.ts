import { TestBed } from '@angular/core/testing';

import { TeamMemberService } from './team-member.service';

describe('TeamMemberService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TeamMemberService = TestBed.get(TeamMemberService);
    expect(service).toBeTruthy();
  });
});
