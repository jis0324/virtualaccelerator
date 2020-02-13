import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UserService } from './user.service';

class Credentials {
  constructor(public username: string, public password: string) {

  }
}

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn: boolean = false;

  constructor(private http: HttpClient, private userService: UserService) { }

  login(username:any, password:any) : Observable<boolean> {
    const authUrl = `api/token/`;
    var credentials = new Credentials(username, password);
    return this.http
      .post(authUrl, credentials, httpOptions).pipe(
        map(results => {
          if (results['access']) {
            localStorage.setItem('vap-jwt-access-token',
                                 results['access']);
            this.isLoggedIn = true;
            if (results['refresh']) {
              localStorage.setItem('vap-jwt-refresh-token',
                                   results['refresh']);
            }
            this.userService.getUser(username).subscribe(user => {
              localStorage.setItem('user', JSON.stringify(user))
            });

            return true;
          } else {
            console.log("Return false");
            return false;
          }
        }),
        catchError(error => {
          console.log("Return false catchError");
          console.log(`Login service: ${error}`);
          return of(false);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('vap-jwt-access-token');
    localStorage.removeItem('vap-jwt-refresh-token');
    this.isLoggedIn = false;
  }
}
