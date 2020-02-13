import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';

import {
  debounceTime, distinctUntilChanged, switchMap, tap, catchError
 } from 'rxjs/operators';

import { Team } from '../team';
import { TeamService } from '../team.service';

@Component({
  selector: 'app-team-search',
  templateUrl: './team-search.component.html',
  styleUrls: [ './team-search.component.css' ]
})
export class TeamSearchComponent {
  public model: any;
  searching = false;
  searchFailed = false;

  public teams$: Observable<Team[]>;

  constructor(private router: Router,
              private teamService: TeamService) {}

  // Push a search term into the observable stream.
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>
                this.teamService.searchTeams(term).pipe(
                  tap(() => this.searchFailed = false),
                  catchError(() => {
                    console.log('Failed!');
                    this.searchFailed = true;
                    return of([]);
                  }))
               ),
      tap(() => {this.searching = false;})
    )

  formatter(b: Team): string {
    return b.name;
  }

  selectedItem(event) : void {
    var team = event.item;
    this.router.navigate([`/teams/${team.id}`]);
  }

}
