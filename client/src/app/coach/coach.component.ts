import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Coach } from '../coach';
import { CoachService } from '../coach.service';
import { Team } from '../team';
import { TeamService } from '../team.service';
import { Comment } from '../comment';
import { CommentsService } from '../comments.service';
import { AuthService } from '../auth.service';
import { User } from '../user';


@Component({
  selector: 'app-coach',
  templateUrl: './coach.component.html',
  styleUrls: ['./coach.component.css']
})
export class CoachComponent implements OnInit {
  coaches: Coach[];
  teams: Team[];
  comments: Comment[];
  user = new User();
  is_coach: boolean;
  is_team_member: boolean;
  is_superuser: boolean;
  // coach: Coach;

  constructor(
    private route: ActivatedRoute,
    private coachService: CoachService,
    private teamService: TeamService,
    private commentsService: CommentsService,
    private auth: AuthService
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
    this.getComments();
    this.getTeams();
    this.getCoaches();
  }

  getComments(): void {
    this.commentsService.getAllComments()
      .subscribe(comments => this.comments = comments );
  }

  getTeams(): void {
    this.teamService.getTeams()
      .subscribe(team => {
        this.teams = team;
    });
  }

  getCoaches(): void {
    this.coachService.getAllCoach()
      .subscribe(coaches => {
        this.coaches = coaches;
        var hasTeamNum = 0;
        var hasCommentNum = 0;
        if (coaches) {
          for (let i = 0; i < this.coaches.length; i++) {
            for (let j = 0; j < this.teams.length; j++) {
              if (this.teams[j].coach_id && this.coaches[i].user == this.teams[j].coach_id) {
                hasTeamNum++;
              }
            }
            this.coaches[i].hasTeamNum = hasTeamNum;
            hasTeamNum = 0;

            for (let j = 0; j < this.comments.length; j++ ) {
              if (this.comments[j].coach == this.coaches[i].user) {
                hasCommentNum++;
              }
            }
            this.coaches[i].hasCommentNum = hasCommentNum;
            hasCommentNum = 0;
          }
        }
      });
  }



}
