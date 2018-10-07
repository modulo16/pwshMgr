import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunScriptJobComponent } from './run-script-job.component';

describe('RunScriptJobComponent', () => {
  let component: RunScriptJobComponent;
  let fixture: ComponentFixture<RunScriptJobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunScriptJobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunScriptJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
