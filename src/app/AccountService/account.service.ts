import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { Account } from '../account';

import {catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  //private accountsUrl = 'http://35.235.110.62:80/accounts/'; //URL to accounts API, config later
  private accountsUrl = 'https://infinite-coast-90564.herokuapp.com/accounts/';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  };

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
    return this.http.post<Account>(this.accountsUrl+'login', requestBody, this.httpOptions)
      .pipe(
        map(sessionkey => {
          if(sessionkey[0] != null){
            localStorage.setItem('currentAccount', username);
            localStorage.setItem('SPDKSessionKey', sessionkey[0]);
            return sessionkey;
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
    return this.http.post<Account>(this.accountsUrl+'read', checkExistRequestBody, this.httpOptions)
      .pipe(
        map(account => {
          if(account[0] != null){ //account with that name already exists
            return 1;
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
    return this.http.post<Account>(this.accountsUrl+'create', requestBody, this.httpOptions)
    .pipe(
      map(account => {
        if(account != null){
          return account;
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
