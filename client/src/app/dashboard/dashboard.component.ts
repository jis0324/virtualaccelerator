import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Team } from '../team';
import { Coach } from '../coach';
import { Deliverable } from '../deliverable';
import { TeamDeliverable } from '../teamdeliverable';
import { Comment } from '../comment';
import { TeamService } from '../team.service';
import { CoachService } from '../coach.service';
import { DeliverableService } from '../deliverable.service';
import { TeamdeliverableService } from '../teamdeliverable.service';
import { CommentsService } from '../comments.service';
import { DatePipe } from '@angular/common';
import { User } from '../user';


import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  teams: Team[];
  coaches: Coach[];
  deliverables: Deliverable[];
  teamDeliverables: TeamDeliverable[];
  comments: Comment[];
  openedTeamDeliverables: number;
  hasDeliverableTeams: number;
  coachNum: any = [];
  today: number = Date.now();
  date: Date;
  user = new User();
  is_coach: boolean;
  is_team_member: boolean;
  is_superuser: boolean;
  hasNotCommentTeamDel: number = 0;
  constructor(
    private teamService: TeamService,
    private coachService: CoachService,
    private deliverableService: DeliverableService,
    private teamDeliverableService: TeamdeliverableService,
    private commentsService: CommentsService,
    private datePipe: DatePipe,
    private auth: AuthService,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.is_superuser = this.user.is_superuser;
    if (this.user.is_superuser) {
      this.is_team_member = false;
      this.is_coach = false;
    } else {
      this.is_team_member = this.user.profile.is_team_member;
      this.is_coach = this.user.profile.is_coach;
    }
    this.date = new Date(this.today);
    this.getTeams();
    this.getCoaches();
    this.getDeliverables();
    this.getTeamDeliverables();
    this.openedTeamDeliverables = 0;
  }

  getTeams(): void {
    this.teamService.getTeams()
      .subscribe(teams => {
        this.teams = teams;
        var coachNum = [];
        for (let i = 0; i < teams.length; i++) {
          if (!coachNum.includes(teams[i].coach_id) && teams[i].coach_id) {
            coachNum.push(teams[i].coach_id)
          }
        }
        this.coachNum = coachNum;
      });
  }

  getCoaches(): void {
    this.coachService.getAllCoach()
      .subscribe(coach => {
        this.coaches = coach;
      });
  }

  getDeliverables(): void {
    this.deliverableService.getDeliverables()
      .subscribe(deliverlables => {
        this.deliverables = deliverlables;
      });
  }

  getTeamDeliverables(): void {
    this.teamDeliverableService.getAllTeamDeliverables()
      .subscribe(teamDeliverable => {
        this.teamDeliverables = teamDeliverable;
        var output = [];
        for (let i = 0; i < teamDeliverable.length; i++) {
          if (!teamDeliverable[i].status) {
            this.openedTeamDeliverables++;
            if (!output.includes(teamDeliverable[i].team.id)) {
              output.push(teamDeliverable[i]['team']['id']);
            }
            this.hasDeliverableTeams = output.length;
          } else {
            this.commentsService.getAllComments()
              .subscribe(comments => {
                console.log(comments)
                let isExist = false;
                for(let j=0; j < comments.length; j++ ) {
                  if (comments[j].teamdeliverable == teamDeliverable[i].id) {
                    isExist = true;
                    break;
                  }
                }
                if(!isExist) {
                  this.hasNotCommentTeamDel++;
                }
              });
          }
        }

      })
  }
}


