import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProcessAlertComponent } from './new-process-alert.component';

describe('NewProcessAlertComponent', () => {
  let component: NewProcessAlertComponent;
  let fixture: ComponentFixture<NewProcessAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewProcessAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewProcessAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
