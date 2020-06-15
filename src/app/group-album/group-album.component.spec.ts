import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupAlbumComponent } from './group-album.component';

describe('GroupAlbumComponent', () => {
  let component: GroupAlbumComponent;
  let fixture: ComponentFixture<GroupAlbumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupAlbumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupAlbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
