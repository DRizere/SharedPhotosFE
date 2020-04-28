import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { Album } from '../album';
import {catchError, map, tap } from 'rxjs/operators';
import { Utils } from '../utils';


@Injectable({
  providedIn: 'root'
})
export class PictureService {
  
  //private albumsUrl = 'http://35.235.110.62:80/images/'; //URL to accounts API, config later

  private imagesUrl = 'https://infinite-coast-90564.herokuapp.com/images/'; //URL to accounts API, config later

  constructor(
    private http: HttpClient
  ) { }

  getPicturesOfAlbum(albumName: string){
    const requestBody = 
    `{
      "accountName" : "${localStorage.getItem("currentAccount")}",
      "albumName" : "${albumName}"
    }`;
    console.log(requestBody);
    return this.http.post<any>(this.imagesUrl+'read', requestBody,  Utils.buildSPDKHttpOptions(localStorage.getItem("SPDKSessionKey"), localStorage.getItem("currentAccount")))
      .pipe(
        map(result => {
          return result;
        })
    );
  }

  pushPictureToAlbum(pictureName: string, pictureEncoding: string, pictureExtension: string){
    const requestBody = 
    `{
      "accountName" : "${localStorage.getItem("currentAccount")}",
      "albumName" : "${localStorage.getItem("currentAlbum")}",
      "pictureName" : "${pictureName}",
      "base64Encoding": "data:${pictureExtension};base64,${pictureEncoding}"
    }`;
    console.log(requestBody);
    return this.http.post<any>(this.imagesUrl+'create', requestBody,  Utils.buildSPDKHttpOptions(localStorage.getItem("SPDKSessionKey"), localStorage.getItem("currentAccount")))
      .pipe(
        map(result => {
          return result;
        })
    );
  }

  deletePictureFromAlbum(pictureName: string){
    const requestBody = +
    `{
      "accountName" : "${localStorage.getItem("currentAccount")}",
      "albumName" : "${localStorage.getItem("currentAlbum")}",
      "pictureName" : "${pictureName}"
    }`;
    console.log(requestBody);
    return this.http.post<any>(this.imagesUrl+'delete', requestBody,  Utils.buildSPDKHttpOptions(localStorage.getItem("SPDKSessionKey"), localStorage.getItem("currentAccount")))
      .pipe(
        map(result => {
          return result;
        })
    );
  }
}
