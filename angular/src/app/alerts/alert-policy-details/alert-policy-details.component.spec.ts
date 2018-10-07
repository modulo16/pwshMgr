import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertPolicyDetailsComponent } from './alert-policy-details.component';

describe('AlertPolicyDetailsComponent', () => {
  let component: AlertPolicyDetailsComponent;
  let fixture: ComponentFixture<AlertPolicyDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertPolicyDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertPolicyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
