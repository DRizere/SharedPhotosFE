import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { Album } from '../album';
import {catchError, map, tap } from 'rxjs/operators';
import { Utils } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class GroupAlbumService {

  private groupAlbumUrl = 'https://infinite-coast-90564.herokuapp.com/groupalbum/'; //URL to accounts API, config later

  constructor(
    private http: HttpClient
  ) { }
  
  createGroupAlbum(albumName: string, groupName: string, accountName: string){
    const requestBody = 
    `{
      "albumName" : "${albumName}",
      "groupName" : "${groupName}",
      "accountName": "${accountName}"
    }`;
    return this.http.post<any>(this.groupAlbumUrl+'create', requestBody, Utils.buildSPDKHttpOptions(localStorage.getItem("SPDKSessionKey"), localStorage.getItem("currentAccount")))
      .pipe(
        map(result => {
          if(result != null){
            return result[0];
          }
        })
    );
  }

  readGroupAlbumsByGroup(groupName: string){
    const requestBody = 
    `{
      "groupName" : "${groupName}"
    }`;
    return this.http.post<any>(this.groupAlbumUrl+'readbygroup', requestBody, Utils.buildSPDKHttpOptions(localStorage.getItem("SPDKSessionKey"), localStorage.getItem("currentAccount")))
      .pipe(
        map(result => {
          return result;
        })
    );
  }

  readGroupAlbumsByAlbum(albumName: string){
    const requestBody = 
    `{
      "albumName" : "${albumName}"
    }`;
    return this.http.post<any>(this.groupAlbumUrl+'readbyalbum', requestBody, Utils.buildSPDKHttpOptions(localStorage.getItem("SPDKSessionKey"), localStorage.getItem("currentAccount")))
      .pipe(
        map(result => {
          return result;
        })
    );
  }

  deleteGroupAlbum(groupName: string, albumName: string){
    const requestBody = 
    `{
      "groupName" : "${groupName}",
      "albumName" : "${albumName}"
    }`;
    return this.http.post<any>(this.groupAlbumUrl+'delete', requestBody, Utils.buildSPDKHttpOptions(localStorage.getItem("SPDKSessionKey"), localStorage.getItem("currentAccount")))
      .pipe(
        map(result => {
          if(result != null){
            return result[0];
          }
        })
    );
  }
}
