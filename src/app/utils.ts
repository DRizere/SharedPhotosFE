import { HttpHeaders } from '@angular/common/http';

export class Utils {
    static buildSPDKHttpOptions = (sessionKey: string, currentAccount: string) => ({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'SPDKSessionKey': sessionKey,
          'SPDKKeyAccount': currentAccount
        })
      });

    static buildDefaultHttpOptions = () => ({
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
          })
    })
}