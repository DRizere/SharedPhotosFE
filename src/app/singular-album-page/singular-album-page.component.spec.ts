import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingularAlbumPageComponent } from './singular-album-page.component';

describe('SingularAlbumPageComponent', () => {
  let component: SingularAlbumPageComponent;
  let fixture: ComponentFixture<SingularAlbumPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingularAlbumPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingularAlbumPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
