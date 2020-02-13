import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverableComponent } from './deliverable.component';

describe('DeliverableComponent', () => {
  let component: DeliverableComponent;
  let fixture: ComponentFixture<DeliverableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliverableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliverableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
