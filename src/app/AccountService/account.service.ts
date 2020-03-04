import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { Account } from '../account';

import {catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private accountsUrl = 'http://35.235.110.62:80/accounts/'; //URL to accounts API, config later

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  };

  constructor(
    private http: HttpClient
  ) { 
  }

  login(username: string) {
    const requestBody = 
    `{
      "accountName" : "${username}"
    }`;
    return this.http.post<Account>(this.accountsUrl+'read', requestBody, this.httpOptions)
      .pipe(
        map(account => {
          if(account[0] != null){
            localStorage.setItem('currentAccount', account[0].accountName);
            return account;
          } else {
            return null;
          }
        })
    );
  }

  logout(){
    localStorage.removeItem('currentAccount');
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

  createAccount(username: string, name: string, email: string) {
    const requestBody = 
    `{
      "accountName" : "${username}",
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
