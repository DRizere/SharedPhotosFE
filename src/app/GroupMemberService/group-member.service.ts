import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { Album } from '../album';
import {catchError, map, tap } from 'rxjs/operators';
import { Utils } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class GroupMemberService {

  private groupMemberUrl = 'https://infinite-coast-90564.herokuapp.com/groupmember/'; //URL to accounts API, config later

  constructor(
    private http: HttpClient
  ) { }
  
  createGroupMember(accountName: string, groupName: string){
    const requestBody = 
    `{
      "accountName" : "${accountName}",
      "groupName" : "${groupName}"
    }`;
    console.log(requestBody);
    return this.http.post<any>(this.groupMemberUrl+'create', requestBody, Utils.buildSPDKHttpOptions(localStorage.getItem("SPDKSessionKey"), localStorage.getItem("currentAccount")))
      .pipe(
        map(result => {
          return result;
        })
    );
  }

  readGroupMembersByGroup(groupName: string){
    const requestBody = 
    `{
      "groupName" : "${groupName}"
    }`;
    console.log(requestBody);
    return this.http.post<any>(this.groupMemberUrl+'readbygroup', requestBody, Utils.buildSPDKHttpOptions(localStorage.getItem("SPDKSessionKey"), localStorage.getItem("currentAccount")))
      .pipe(
        map(result => {
          return result;
        })
    );
  }

  readGroupMembersByMember(accountName: string){
    const requestBody = 
    `{
      "accountName" : "${accountName}"
    }`;
    console.log(requestBody);
    return this.http.post<any>(this.groupMemberUrl+'readbymember', requestBody, Utils.buildSPDKHttpOptions(localStorage.getItem("SPDKSessionKey"), localStorage.getItem("currentAccount")))
      .pipe(
        map(result => {
          return result;
        })
    );
  }

  deleteGroupMember(groupName: string, accountName: string){
    const requestBody = 
    `{
      "groupName" : "${groupName}",
      "accountName" : "${accountName}"
    }`;
    console.log(requestBody);
    return this.http.post<any>(this.groupMemberUrl+'delete', requestBody, Utils.buildSPDKHttpOptions(localStorage.getItem("SPDKSessionKey"), localStorage.getItem("currentAccount")))
      .pipe(
        map(result => {
          return result;
        })
    );
  }

  updateGroupMember(groupName: string, accountName: string){
    const requestBody = 
    `{
      "groupName" : "${groupName}",
      "accountName" : "${accountName}",
      "membershipStatus" : 1
    }`;
    console.log(requestBody);
    return this.http.post<any>(this.groupMemberUrl+'update', requestBody, Utils.buildSPDKHttpOptions(localStorage.getItem("SPDKSessionKey"), localStorage.getItem("currentAccount")))
      .pipe(
        map(result => {
          return result;
        })
    );
  }
}
