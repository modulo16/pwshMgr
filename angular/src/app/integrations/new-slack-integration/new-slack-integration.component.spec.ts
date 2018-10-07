import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSlackIntegrationComponent } from './new-slack-integration.component';

describe('NewSlackIntegrationComponent', () => {
  let component: NewSlackIntegrationComponent;
  let fixture: ComponentFixture<NewSlackIntegrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSlackIntegrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSlackIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
