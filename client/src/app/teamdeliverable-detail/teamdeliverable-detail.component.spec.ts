import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamdeliverableDetailComponent } from './teamdeliverable-detail.component';

describe('TeamdeliverableDetailComponent', () => {
  let component: TeamdeliverableDetailComponent;
  let fixture: ComponentFixture<TeamdeliverableDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamdeliverableDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamdeliverableDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
