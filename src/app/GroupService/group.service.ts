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
    return this.http.post<any>(this.groupsUrl+'delete', requestBody, Utils.buildSPDKHttpOptions(localStorage.getItem("SPDKSessionKey"), localStorage.getItem("currentAccount")))
      .pipe(
        map(result => {
          return result;
        })
    );
  }

  checkGroupExistance(groupName: string){
    const requestBodyCheckExistance = 
    `{
      "accountName" : "${localStorage.getItem("currentAccount")}"
    }`;
    return this.http.post<any>(this.groupsUrl+'read', requestBodyCheckExistance,  Utils.buildSPDKHttpOptions(localStorage.getItem("SPDKSessionKey"), localStorage.getItem("currentAccount")))
      .pipe(
        map(groups => {
          for (let currGroup of groups){
            if(currGroup.groupName===groupName){
              return 1;
            }
          }
          return 0;
        })
      );
  }

}
