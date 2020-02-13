import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User } from './user';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersUrl = 'api/users'

  constructor(private http: HttpClient,
              private messageService: MessageService) { }

  private log(message: string): void {
    this.messageService.add('UserService: ' + message);
  }

  getUsers(): Observable<User[]> {
    const url = `${this.usersUrl}`;
    return this.http.get<User[]>(url)
    .pipe(
      tap(_ => this.log('fetched users')),
      catchError(this.handleError('getUsers', []))
    );
  }

  /** GET user by id. Will 404 if id not found */
  getUser(username: string): Observable<User> {
    const url = `${this.usersUrl}/${username}`;
    return this.http.get<User>(url).pipe(
      tap(_ => this.log(`fetched user username=${username}`)),
      catchError(this.handleError<User>(`getUser username=${username}`))
    );
  }

  // getCoaches(is_coach: boolean): Observable<User[]> {
  //   const url = `${this.usersUrl}`;
  //   return this.http.get<User[]>(url)
  //   .pipe(
  //     tap(_ => this.log(`fetched users is_coach=${is_coach}`)),
  //     catchError(this.handleError('getUsers', []))
  //   );
  // }

  /** PUT: update the user on the server */
updateUser (user: User): Observable<any> {
  const url = `${this.usersUrl}/${user.id}`;
  return this.http.put(url, user, httpOptions).pipe(
    tap(_ => this.log(`updated user id=${user.id}`)),
    catchError(this.handleError<any>('updateUser'))
  );
}


/** DELETE: delete the user from the server */
deleteUser(user: User | number): Observable<User> {
  const id = typeof user === 'number' ? user : user.id;
  const url = `${this.usersUrl}/${id}`;

  return this.http.delete<User>(url, httpOptions).pipe(
    tap(_ => this.log(`deleted user id=${id}`)),
    catchError(this.handleError<User>('deleteUser'))
  );
}


  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
