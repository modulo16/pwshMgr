import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachinedetailsComponent } from './machinedetails.component';

describe('MachinedetailsComponent', () => {
  let component: MachinedetailsComponent;
  let fixture: ComponentFixture<MachinedetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachinedetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachinedetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
