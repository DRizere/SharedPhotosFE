import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { Album } from '../album';
import {catchError, map, tap } from 'rxjs/operators';
import { Utils } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class SessionCheckerService {


  private groupMemberUrl = 'https://infinite-coast-90564.herokuapp.com/session'; //URL to accounts API, config later

  constructor(
    private http: HttpClient
  ) { }
  
  validateSession(){
    return this.http.post<any>(this.groupMemberUrl, null, Utils.buildSPDKHttpOptions(localStorage.getItem("SPDKSessionKey"), localStorage.getItem("currentAccount")))
      .pipe(
        map(result => {
          if(result != null){
            return result[0];
          }
        })
    );
  }
}
