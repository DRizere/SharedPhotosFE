import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingularPublicAlbumPageComponent } from './singular-public-album-page.component';

describe('SingularPublicAlbumPageComponent', () => {
  let component: SingularPublicAlbumPageComponent;
  let fixture: ComponentFixture<SingularPublicAlbumPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingularPublicAlbumPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingularPublicAlbumPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
