import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { Album } from '../album';
import {catchError, map, tap } from 'rxjs/operators';
import { Local } from 'protractor/built/driverProviders';
import { Utils } from '../utils';


@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  
  //private albumsUrl = 'http://35.235.110.62:80/albums/'; //URL to accounts API, config later

  private albumsUrl = 'https://infinite-coast-90564.herokuapp.com/albums/'; //URL to accounts API, config later

  constructor(
    private http: HttpClient
  ) { }

  fetchAlbums(){
    const requestBody = 
    `{
      "accountName" : "${localStorage.getItem("currentAccount")}"
    }`;
    return this.http.post<Album[]>(this.albumsUrl+'read', requestBody,  Utils.buildSPDKHttpOptions(localStorage.getItem("SPDKSessionKey"), localStorage.getItem("currentAccount")))
      .pipe(
        map(albums => {
          if(albums != null){
            return albums;
          } else {
            return null;
          }
        })
    );
  }

  checkAlbumExistance(albumName: string){
    const requestBodyCheckExistance = 
    `{
      "accountName" : "${localStorage.getItem("currentAccount")}"
    }`;
    return this.http.post<any>(this.albumsUrl+'read', requestBodyCheckExistance,  Utils.buildSPDKHttpOptions(localStorage.getItem("SPDKSessionKey"), localStorage.getItem("currentAccount")))
      .pipe(
        map(albums => {
          for (let currAlbum of albums){
            if(currAlbum.albumName===albumName){
              return 1;
            }
          }
          return 0;
        })
      );
  }

  createAlbum(albumName: string){
    const requestBody = 
    `{
      "accountName" : "${localStorage.getItem("currentAccount")}",
      "albumName" : "${albumName}"
    }`;
    return this.http.post<any>(this.albumsUrl+'create', requestBody,  Utils.buildSPDKHttpOptions(localStorage.getItem("SPDKSessionKey"), localStorage.getItem("currentAccount")))
      .pipe(
        map(result => {
          return result;
        })
    );
  }

  deleteAlbum(albumName: string){
    const requestBody = 
    `{
      "accountName" : "${localStorage.getItem("currentAccount")}",
      "albumName" : "${albumName}"
    }`;
    return this.http.post<any>(this.albumsUrl+'delete', requestBody,  Utils.buildSPDKHttpOptions(localStorage.getItem("SPDKSessionKey"), localStorage.getItem("currentAccount")))
      .pipe(
        map(result => {
          return result;
        })
    );
  }

  logout(){
    localStorage.removeItem('currentAlbum');
  }

}
