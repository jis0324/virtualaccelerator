import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of} from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { map, catchError } from 'rxjs/operators';


import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';



@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private router: Router, private http: HttpClient,) {}

  intercept(req: HttpRequest<any>,
            next: HttpHandler): Observable<HttpEvent<any>> {

    const token = localStorage.getItem('vap-jwt-access-token');
    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(authReq);
    }
    else {
      return next.handle(req);
    }


    return <any>next.handle(req).pipe(catchError(err => {
      console.log(err);
      if (err.status === 401) {
        if (err.error.message == "Token is exp") {
        //Genrate params for token refreshing
            let params = {
              token: token,
              refreshToken: localStorage.getItem('vap-jwt-refresh-token'),
            };
            return this.http.post(`api/token/`, params).pipe(
              map((data: any) => {
            //If reload successful update tokens
            if (data.status == 200) {
            //Update tokens
             localStorage.setItem('vap-jwt-access-token', data.result.token);
             localStorage.setItem('vap-jwt-refresh-token', data.result.refreshToken);
            //Clone our fieled request ant try to resend it
             const authReq = req.clone({
               setHeaders: {
                 Authorization: `Bearer ${data.result.token}`
                }
              });
              return next.handle(authReq)
            }
          }
        ));
        }
      }
    }));
  }
}
