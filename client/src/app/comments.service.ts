import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';

import { TeamDeliverable } from './teamdeliverable';
import { Comment } from './comment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  /** GET All comments from the server */
  getAllComments(): Observable<Comment[]> {
    let url = `api/allcomments`;
    return this.http.get<Comment[]>(url)
      .pipe(
        tap(comments => this.log(`fetched allcomments`)),
        catchError(this.handleError('getAllComments', []))
      );
  }

  /** GET comments from the server */
  getComments(teamdeliverableId: number, teamId: number): Observable<Comment[]> {
    let url = `api/teams/${teamId}/teamdeliverables/${teamdeliverableId}/comments`;
    return this.http.get<Comment[]>(url)
      .pipe(
        tap(comments => this.log(`fetched comments`)),
        catchError(this.handleError('getComments', []))
      );
  }

  /** GET comments by id. Will 404 if id not found */
  getComment(id: number, team: number, teamdeliverableId: number): Observable<Comment> {
    const url = `api/teams/${team}/teamdeliverables/${teamdeliverableId}/comments/${id}`;
    return this.http.get<Comment>(url).pipe(
      tap(_ => this.log(`fetched comment id=${id}`)),
      catchError(this.handleError<Comment>(`getComment id=${id}`))
    );
  }

  /** POST: add a new comment to the server */
  addComment(comment: Comment, teamId: number): Observable<Comment> {
    let url = `api/teams/${teamId}/teamdeliverables/${comment.teamdeliverable}/comments`;
    return this.http.post<Comment>(url, comment, httpOptions).pipe(
      tap((comment: Comment) => this.log(`added comment w/ id=${comment.id}`)),
      catchError(this.handleError<Comment>('addComment'))
    );
  }

  /** PUT: update the comment on the server */
  updateComment (comment: Comment, teamId: number): Observable<any> {
    const url = `api/teams/${teamId}/teamdeliverables/${comment.teamdeliverable}/comments/${comment.id}`;
    return this.http.put(url, comment, httpOptions).pipe(
      tap(_ => this.log(`updated comment id=${comment.id}`)),
      catchError(this.handleError<any>('updateComment'))
    );
  }

  /** DELETE: delete the xomment from the server */
  deleteComment(comment: Comment, teamId: number): Observable<Comment> {
    const url = `api/teams/${teamId}/teamdeliverables/${comment.teamdeliverable}/comments/${comment.id}`;
    return this.http.delete<Comment>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted comment id=${comment.id}`)),
      catchError(this.handleError<Comment>('deleteComment'))
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
