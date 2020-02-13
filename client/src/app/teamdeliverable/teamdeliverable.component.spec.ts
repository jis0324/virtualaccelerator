import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamdeliverableComponent } from './teamdeliverable.component';

describe('TeamdeliverableComponent', () => {
  let component: TeamdeliverableComponent;
  let fixture: ComponentFixture<TeamdeliverableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamdeliverableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamdeliverableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
