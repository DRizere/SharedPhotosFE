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
  private publicAlbumsUrl = 'https://infinite-coast-90564.herokuapp.com/public/albums/'; //URL to accounts API, config later

  constructor(
    private http: HttpClient
  ) { }

  fetchAlbums(accountName: string){
    const requestBody = 
    `{
      "accountName" : "${accountName}"
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

  checkAlbumExistance(albumName: string, accountName: String){
    const requestBodyCheckExistance = 
    `{
      "accountName" : "${accountName}"
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

  createAlbum(albumName: string, accountName: string){
    const requestBody = 
    `{
      "accountName" : "${accountName}",
      "albumName" : "${albumName}"
    }`;
    return this.http.post<any>(this.albumsUrl+'create', requestBody,  Utils.buildSPDKHttpOptions(localStorage.getItem("SPDKSessionKey"), localStorage.getItem("currentAccount")))
      .pipe(
        map(result => {
          if(result != null){
            return result[0];
          }
        })
    );
  }

  deleteAlbum(albumName: string, accountName: string){
    const requestBody = 
    `{
      "accountName" : "${accountName}",
      "albumName" : "${albumName}"
    }`;
    return this.http.post<any>(this.albumsUrl+'delete', requestBody,  Utils.buildSPDKHttpOptions(localStorage.getItem("SPDKSessionKey"), localStorage.getItem("currentAccount")))
      .pipe(
        map(result => {
          if(result != null){
            return result[0];
          }
        })
    );
  }


  makePublic(albumName: string, accountName: string){
    const requestBody = 
    `{
      "accountName" : "${accountName}",
      "albumName" : "${albumName}"
    }`;
    return this.http.post<any>(this.albumsUrl+'public', requestBody,  Utils.buildSPDKHttpOptions(localStorage.getItem("SPDKSessionKey"), localStorage.getItem("currentAccount")))
      .pipe(
        map(result => {
          if(result != null){
            return result[0];
          }
        })
    );
  }

  makePrivate(albumName: string, accountName: string){
    const requestBody = 
    `{
      "accountName" : "${accountName}",
      "albumName" : "${albumName}"
    }`;
    return this.http.post<any>(this.albumsUrl+'unpublic', requestBody,  Utils.buildSPDKHttpOptions(localStorage.getItem("SPDKSessionKey"), localStorage.getItem("currentAccount")))
      .pipe(
        map(result => {
          if(result != null){
            return result[0];
          }
        })
    );
  }

  logout(){
    localStorage.removeItem('currentAlbum');
  }

  /*************************************************
  ************** Public Album Methods **************
  **************************************************/

  fetchPublicAlbums(){
    return this.http.get<Album[]>(this.publicAlbumsUrl+'read')
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

  checkPublicAlbumExistance(albumName: string){
    return this.http.get<any>(this.publicAlbumsUrl+'read')
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

  createPublicAlbum(albumName: string){
    const requestBody = 
    `{
      "albumName" : "${albumName}"
    }`;
    return this.http.post(this.publicAlbumsUrl+'create', requestBody, Utils.buildDefaultHttpOptions())
      .pipe(
        map(result => {
          if(result != null){
            return result[0];
          }
        })
    );
  }

  deletePublicAlbum(albumName: string){
    const requestBody = 
    `{
      "albumName" : "${albumName}"
    }`;
    return this.http.post<any>(this.publicAlbumsUrl+'delete', requestBody, Utils.buildDefaultHttpOptions())
      .pipe(
        map(result => {
          if(result != null){
            return result[0];
          }
        })
    );
  }


}
