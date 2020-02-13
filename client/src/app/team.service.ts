import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Team } from './team';
import { TeamAbout } from './team-about';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})


export class TeamService {

  private teamsUrl = 'api/teams'

  constructor(private http: HttpClient,
    private messageService: MessageService) { }

  private log(message: string): void {
    this.messageService.add('TeamService: ' + message);
  }

  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(this.teamsUrl)
      .pipe(
        tap(_ => this.log('fetched teams')),
        catchError(this.handleError('getTeams', []))
      );
  }

  /** GET team by id. Will 404 if id not found */
  getTeam(id: number): Observable<Team> {
    const url = `${this.teamsUrl}/${id}`;
    return this.http.get<Team>(url).pipe(
      tap(_ => this.log(`fetched team id=${id}`)),
      catchError(this.handleError<Team>(`getTeam id=${id}`))
    );
  }

   /** PUT: update the team on the server */
  updateTeam(team: Team): Observable<any> {
    console.log(team)
    if (team.photo) {
      const url = `${this.teamsUrl}/${team.id}`;
      return this.http.put(url, team, httpOptions).pipe(
        tap(_ => this.log(`updated team id=${team.id}`)),
        catchError(this.handleError<any>('updateTeam'))
      );
    } else {
      const url = `api/updateTeamWithoutPhoto/${team.id}`;
      return this.http.put(url, team, httpOptions).pipe(
        tap(_ => this.log(`updated team id=${team.id}`)),
        catchError(this.handleError<any>('updateTeam'))
      );
    }

   
  }

  updateTeamToCoach(team: Team): Observable<any> {
    var param = {
      'id': team.id,
      'name': team.name,
      'pipeline': team.pipeline,
      'maturity_level': team.maturity_level,
      'coach_id': team.coach_id
    }
    const url = `api/updateTeamToCoach/${team.id}`;
    return this.http.put(url, param, httpOptions).pipe(
      tap(_ => this.log(`updated team id=${team.id}`)),
      catchError(this.handleError<any>('updateTeam'))
    );
  }
  // updateTeamAbout (teamAbout: TeamAbout): Observable<any> {
  //   const url = `${this.teamsUrl}/${teamAbout.id}`;
  //   return this.http.put(url, teamAbout, httpOptions).pipe(
  //     tap(_ => this.log(`updated teamAbout id=${teamAbout.id}`)),
  //     catchError(this.handleError<any>('updateTeamAbout'))
  //   );
  // }

  /** POST: add a new team to the server */
  addTeam(team: Team): Observable<Team> {
    alert()
    let url = `api/teams`;
    return this.http.post<Team>(url, team, httpOptions).pipe(
      tap((team: Team) => this.log(`added team w/ id=${team.id}`)),
      catchError(this.handleError<Team>('addTeam'))
    );
  }

  /** DELETE: delete the team from the server */
  deleteTeam(team: Team | number): Observable<Team> {
    const id = typeof team === 'number' ? team : team.id;
    const url = `${this.teamsUrl}/${id}`;

    return this.http.delete<Team>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted team id=${id}`)),
      catchError(this.handleError<Team>('deleteTeam'))
    );
  }

  /* GET teams whose title contains search term */
  searchTeams(term: string): Observable<Team[]> {
    if (!term.trim()) {
      // if not search term, return empty team array.
      return of([]);
    }
    return this.http.get<Team[]>(`api/teams/?name=${term}`).pipe(
      tap(_ => this.log(`found teams matching "${term}"`)),
      catchError(this.handleError<Team[]>('searchTeams', []))
    );
  }



  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T) {
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
