import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';

import { File } from './file';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  /** POST: add new file to the server */
  addFile(file: File): Observable<any> {
    const headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    let url = `api/images/create/`;
    // console.log(JSON.stringify({ file: file.file, remark: file.remark }))
    return this.http.post<File>(url, file, httpOptions).pipe(
      tap((file: File) => this.log(`added file w/ id=${file.id}`)),
      catchError(this.handleError('addFile', []))
    );
  }

  public uploadImage(image: File): Observable<any> {
    let url = `api/images/profile/`;

    return this.http.post<File>(url, image, httpOptions);
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
