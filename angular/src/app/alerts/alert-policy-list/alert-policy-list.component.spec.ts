import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertPolicyListComponent } from './alert-policy-list.component';

describe('AlertPolicyListComponent', () => {
  let component: AlertPolicyListComponent;
  let fixture: ComponentFixture<AlertPolicyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertPolicyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertPolicyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
