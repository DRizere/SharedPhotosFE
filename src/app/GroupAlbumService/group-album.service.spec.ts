import { TestBed } from '@angular/core/testing';

import { GroupAlbumService } from './group-album.service';

describe('GroupAlbumService', () => {
  let service: GroupAlbumService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupAlbumService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
