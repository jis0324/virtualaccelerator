import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverablesTeamComponent } from './deliverables-team.component';

describe('DeliverablesTeamComponent', () => {
  let component: DeliverablesTeamComponent;
  let fixture: ComponentFixture<DeliverablesTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliverablesTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliverablesTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
