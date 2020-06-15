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
  private publicImagesUrl = 'https://infinite-coast-90564.herokuapp.com/public/images/'; //URL to accounts API, config later

  constructor(
    private http: HttpClient
  ) { }

  getPicturesOfAlbum(currentAccount: string, albumName: string){
    const requestBody = 
    `{
      "accountName" : "${currentAccount}",
      "albumName" : "${albumName}"
    }`;
    return this.http.post<any>(this.imagesUrl+'read', requestBody,  Utils.buildSPDKHttpOptions(localStorage.getItem("SPDKSessionKey"), localStorage.getItem("currentAccount")))
      .pipe(
        map(result => {
          return result;
        })
    );
  }

  pushPictureToAlbum(currentAccount: string, currentAlbum: string, pictureName: string, pictureEncoding: string, pictureExtension: string){
    const requestBody = 
    `{
      "accountName" : "${currentAccount}",
      "albumName" : "${currentAlbum}",
      "pictureName" : "${pictureName}",
      "base64Encoding": "data:${pictureExtension};base64,${pictureEncoding}"
    }`;
    return this.http.post<any>(this.imagesUrl+'create', requestBody,  Utils.buildSPDKHttpOptions(localStorage.getItem("SPDKSessionKey"), localStorage.getItem("currentAccount")))
      .pipe(
        map(result => {
          return result[0];
        })
    );
  }

  deletePictureFromAlbum(currentAccount: string,  currentAlbum: string, pictureName: string){
    const requestBody = 
    `{
      "accountName" : "${currentAccount}",
      "albumName" : "${currentAlbum}",
      "pictureName" : "${pictureName}"
    }`;
    return this.http.post<any>(this.imagesUrl+'delete', requestBody,  Utils.buildSPDKHttpOptions(localStorage.getItem("SPDKSessionKey"), localStorage.getItem("currentAccount")))
      .pipe(
        map(result => {
          if(result != null){
            return result[0];
          }
        })
    );
  }

  /*************************************************
  ************* Public Picture Methods *************
  **************************************************/

  getPublicPicturesOfAlbum(accountName: string, albumName: string){
    const requestBody = 
    `{
      "albumName" : "${albumName}",
      "accountName" : "${accountName}"
    }`;
    return this.http.post<any>(this.publicImagesUrl+'read', requestBody, Utils.buildDefaultHttpOptions())
      .pipe(
        map(result => {
          return result;
        })
    );
  }

  pushPublicPictureToAlbum(currentAccount: string, currentAlbum: string, pictureName: string, pictureEncoding: string, pictureExtension: string){
    const requestBody = 
    `{
      "accountName" : "${currentAccount}",
      "albumName" : "${currentAlbum}",
      "pictureName" : "${pictureName}",
      "base64Encoding": "data:${pictureExtension};base64,${pictureEncoding}"
    }`;
    return this.http.post<any>(this.publicImagesUrl+'create', requestBody,  Utils.buildSPDKHttpOptions(localStorage.getItem("SPDKSessionKey"), localStorage.getItem("currentAccount")))
      .pipe(
        map(result => {
          if(result != null){
            return result[0];
          }
        })
    );
  }

  deletePublicPictureFromAlbum(currentAccount: string,  currentAlbum: string, pictureName: string){
    const requestBody = 
    `{
      "accountName" : "${currentAccount}",
      "albumName" : "${currentAlbum}",
      "pictureName" : "${pictureName}"
    }`;
    return this.http.post<any>(this.publicImagesUrl+'delete', requestBody,  Utils.buildSPDKHttpOptions(localStorage.getItem("SPDKSessionKey"), localStorage.getItem("currentAccount")))
      .pipe(
        map(result => {
          if(result != null){
            return result[0];
          }
        })
    );
  }
}
