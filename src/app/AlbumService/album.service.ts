import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { Album } from '../album';
import {catchError, map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  
  //private albumsUrl = 'http://35.235.110.62:80/albums/'; //URL to accounts API, config later

  private albumsUrl = 'https://76.102.40.223:8443/albums/'; //URL to accounts API, config later
  
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  };

  constructor(
    private http: HttpClient
  ) { }

  fetchAlbums(){
    const requestBody = 
    `{
      "accountName" : "${localStorage.getItem("currentAccount")}"
    }`;
    return this.http.post<Album[]>(this.albumsUrl+'read', requestBody, this.httpOptions)
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
    return this.http.post<any>(this.albumsUrl+'read', requestBodyCheckExistance, this.httpOptions)
      .pipe(
        map(albums => {
          for (let currAlbum of albums){
            if(currAlbum.albumName===albumName){
              return 1;
            }
          }
        })
      );
  }

  createAlbum(albumName: string){
    const requestBody = 
    `{
      "accountName" : "${localStorage.getItem("currentAccount")}",
      "albumName" : "${albumName}"
    }`;
    return this.http.post<any>(this.albumsUrl+'create', requestBody, this.httpOptions)
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
    return this.http.post<any>(this.albumsUrl+'delete', requestBody, this.httpOptions)
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
