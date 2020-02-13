import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachDeliverablesComponent } from './coach-deliverables.component';

describe('CoachDeliverablesComponent', () => {
  let component: CoachDeliverablesComponent;
  let fixture: ComponentFixture<CoachDeliverablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoachDeliverablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachDeliverablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
