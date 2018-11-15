import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDiskAlertComponent } from './new-disk-alert.component';

describe('NewDiskAlertComponent', () => {
  let component: NewDiskAlertComponent;
  let fixture: ComponentFixture<NewDiskAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewDiskAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDiskAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
