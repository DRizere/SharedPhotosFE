import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingularGroupManagementComponent } from './singular-group-management.component';

describe('SingularGroupManagementComponent', () => {
  let component: SingularGroupManagementComponent;
  let fixture: ComponentFixture<SingularGroupManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingularGroupManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingularGroupManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
