import { Component, OnInit } from '@angular/core';

//import { RestTesterComponent } from './rest-tester/rest-tester.component';

import { Router } from '@angular/router';

import { AccountService } from './AccountService/account.service';
import { AlbumService } from './AlbumService/album.service';
import { PictureService } from './PictureService/picture.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'shared-photos-fe';
  loggedIn = false;
  currentAlbum: string;
  currentPhoto: string;

  constructor(
    private router: Router,
    private accountService: AccountService,
    private albumService: AlbumService
  ) {
  }

  readLocalStorageValue(key: string){
    return localStorage.getItem(key);
  }

  logout() {
      this.accountService.logout();
      this.albumService.logout();
      this.router.navigate(['/login']);
  }

  ngOnInit(){

  }
}
