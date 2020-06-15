import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { Account } from '../account';

import {catchError, map, tap } from 'rxjs/operators';

import { Utils } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  //private accountsUrl = 'http://35.235.110.62:80/accounts/'; //URL to accounts API, config later
  private accountsUrl = 'https://infinite-coast-90564.herokuapp.com/accounts/';

  constructor(
    private http: HttpClient
  ) { 
  }

  login(username: string, password: string) {
    const requestBody = 
    `{
      "accountName" : "${username}",
      "accountPass" : "${password}"
    }`;
    return this.http.post<HttpResponse<String>>(this.accountsUrl+'login', requestBody, Utils.buildDefaultHttpOptions())
      .pipe(
        map(response => {
          if(response !== null && response[0] !== null){
            localStorage.setItem('currentAccount', username);
            localStorage.setItem('SPDKSessionKey', response[0]);
            return 0;
          } else {
            return null;
          }
        })
    );
  }

  logout(){
    localStorage.removeItem('currentAccount');
    localStorage.removeItem('SPDKSessionKey');
  }

  checkAccountExistance(username: string){
    const checkExistRequestBody = 
    `{
      "accountName" : "${username}"
    }`;
    return this.http.post<Account>(this.accountsUrl+'read', checkExistRequestBody, Utils.buildDefaultHttpOptions())
      .pipe(
        map(response => {
          if(response[0] != null){ //account with that name already exists
            return 1;
          } else {
            return 0;
          }
        })
      );
  }

  createAccount(username: string, name: string, email: string, password: string) {
    const requestBody = 
    `{
      "accountName" : "${username}",
      "accountPass" : "${password}",
      "accountOwner" : "${name}",
      "email" : "${email}",
      "roleType" : "user"
    }`;
    return this.http.post(this.accountsUrl+'create', requestBody, Utils.buildDefaultHttpOptions())
    .pipe(
      map(response => {
        if(response != null){
          return response[0];
        }
      })
    );
  }

  private handleError<T> (operation='operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    }
  }
}
