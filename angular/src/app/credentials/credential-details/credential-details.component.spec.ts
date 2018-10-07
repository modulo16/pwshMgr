import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CredentialDetailsComponent } from './credential-details.component';

describe('CredentialDetailsComponent', () => {
  let component: CredentialDetailsComponent;
  let fixture: ComponentFixture<CredentialDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CredentialDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CredentialDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
