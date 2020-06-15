import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicAlbumPageComponent } from './public-album-page.component';

describe('PublicAlbumPageComponent', () => {
  let component: PublicAlbumPageComponent;
  let fixture: ComponentFixture<PublicAlbumPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicAlbumPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicAlbumPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
