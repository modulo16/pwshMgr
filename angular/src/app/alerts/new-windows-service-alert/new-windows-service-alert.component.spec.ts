import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewWindowsServiceAlertComponent } from './new-windows-service-alert.component';

describe('NewWindowsServiceAlertComponent', () => {
  let component: NewWindowsServiceAlertComponent;
  let fixture: ComponentFixture<NewWindowsServiceAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewWindowsServiceAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewWindowsServiceAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
