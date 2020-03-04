import { TestBed } from '@angular/core/testing';

import { AccountService as AccountService } from './authentication.service';

describe('AuthenticationService', () => {
  let service: AccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
