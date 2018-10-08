import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationDetailComponent } from './integration-detail.component';

describe('IntegrationDetailComponent', () => {
  let component: IntegrationDetailComponent;
  let fixture: ComponentFixture<IntegrationDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntegrationDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegrationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
