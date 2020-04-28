import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { Album } from '../album';
import {catchError, map, tap } from 'rxjs/operators';
import { Utils } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private groupsUrl = 'https://infinite-coast-90564.herokuapp.com/groups/'; //URL to accounts API, config later

  constructor(
    private http: HttpClient
  ) { }

  createGroup(groupOwner: string, groupName: string){
    const requestBody = 
    `{
      "groupOwner" : "${groupOwner}",
      "groupName" : "${groupName}"
    }`;
    console.log(requestBody);
    return this.http.post<any>(this.groupsUrl+'create', requestBody, Utils.buildSPDKHttpOptions(localStorage.getItem("SPDKSessionKey"), localStorage.getItem("currentAccount")))
      .pipe(
        map(result => {
          return result;
        })
    );
  }

  readGroups(groupOwner: string){
    const requestBody = 
    `{
      "groupOwner" : "${groupOwner}"
    }`;
    console.log(requestBody);
    return this.http.post<any>(this.groupsUrl+'read', requestBody, Utils.buildSPDKHttpOptions(localStorage.getItem("SPDKSessionKey"), localStorage.getItem("currentAccount")))
      .pipe(
        map(result => {
          return result;
        })
    );
  }

  deleteGroup(groupName: string, groupOwner: string){
    const requestBody = 
    `{
      "groupOwner" : "${groupOwner}",
      "groupName" : "${groupName}"
    }`;
    console.log(requestBody);
    return this.http.post<any>(this.groupsUrl+'delete', requestBody, Utils.buildSPDKHttpOptions(localStorage.getItem("SPDKSessionKey"), localStorage.getItem("currentAccount")))
      .pipe(
        map(result => {
          return result;
        })
    );
  }


}
