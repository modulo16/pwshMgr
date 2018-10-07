import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewScriptComponent } from './new-script.component';

describe('NewScriptComponent', () => {
  let component: NewScriptComponent;
  let fixture: ComponentFixture<NewScriptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewScriptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewScriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
