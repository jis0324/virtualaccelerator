import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamdelComponent } from './teamdel.component';

describe('TeamdelComponent', () => {
  let component: TeamdelComponent;
  let fixture: ComponentFixture<TeamdelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamdelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamdelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
