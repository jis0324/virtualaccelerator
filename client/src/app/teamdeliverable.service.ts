import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';

import { TeamDeliverable } from './teamdeliverable';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TeamdeliverableService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  /** GET teamdeliverables from the server */
  getTeamDeliverables(teamId: number): Observable<TeamDeliverable[]> {
    let url = `api/teams/${teamId}/teamdeliverables`;
    return this.http.get<TeamDeliverable[]>(url)
      .pipe(
        tap(teamdeliverables => this.log(`fetched teamdeliverables`)),
        catchError(this.handleError('getTeamDeliverables', []))
      );
  }

  /** GET teamdeliverables from the server */
  getAllTeamDeliverables(): Observable<TeamDeliverable[]> {
    let url = `api/teamdeliverables`;
    return this.http.get<TeamDeliverable[]>(url)
      .pipe(
        tap(teamdeliverables => this.log(`fetched teamdeliverables`)),
        catchError(this.handleError('getAllTeamDeliverables', []))
      );
  }

  /** GET teamdeliverable by id. Will 404 if id not found */
  getTeamdeliverable(id: number, team: number): Observable<TeamDeliverable> {
    const url = `api/teams/${team}/teamdeliverables/${id}`;
    return this.http.get<TeamDeliverable>(url).pipe(
      tap(_ => this.log(`fetched teamdeliverable id=${id}`)),
      catchError(this.handleError<TeamDeliverable>(`getTeamdeliverable id=${id}`))
    );
  }

  /** POST: add a new teamdeliverable to the server */
  addTeamDeliverable(teamdeliverable: TeamDeliverable): Observable<any> {
    let url = `api/teams/${teamdeliverable.team}/teamdeliverables`;
    return this.http.post<TeamDeliverable>(url, teamdeliverable, httpOptions).pipe(
      tap((teamdeliverable: TeamDeliverable) => this.log(`added teamdeliverable w/ id=${teamdeliverable.id}`)),
      catchError(this.handleError<TeamDeliverable>(`addTeamdeliverable`))
    );
  }


  /** PUT: update the team deliverable on the server */
  updateTeamDeliverable (teamdeliverable: TeamDeliverable): Observable<any> {
    const url = `api/uploadteamdeliverables/${teamdeliverable.id}`;
    return this.http.put(url, teamdeliverable, httpOptions).pipe(
      tap(_ => this.log(`updated teamdeliverable id=${teamdeliverable.id}`)),
      catchError(this.handleError<TeamDeliverable>(`addTeamdeliverable`))
    );
  }

  /** PUT: update the team deliverable without deliverable on the server */
  updateTeamDeliverableWithoutFile (teamdeliverable: TeamDeliverable): Observable<any> {
    const url = `api/updateTeamDeliverableWithoutFile/${teamdeliverable.id}`;
    return this.http.put(url, teamdeliverable, httpOptions).pipe(
      tap(_ => this.log(`updated teamdeliverable id=${teamdeliverable.id}`)),
      catchError(this.handleError<TeamDeliverable>(`addTeamdeliverable`))
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

      console.error(error); // log to console instead

      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string): void {
    this.messageService.add('TeamDeliverableService: ' + message);
  }

}
