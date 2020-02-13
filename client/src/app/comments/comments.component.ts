import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DatePipe, CommonModule } from '@angular/common';

import { TeamDeliverable } from '../teamdeliverable';
import { Comment } from '../comment';
import { CommentsService } from '../comments.service';
import { TeamMemberService } from '../team-member.service';
import { CoachService } from '../coach.service';
import { User } from '../user';
import { Profile } from '../profile';
import { Coach } from '../coach';
import { TeamMember } from '../teamMember';
import { TeamService } from '../team.service';
import { Team } from '../team';



@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  @Input()
  teamId: number;

  team: Team;
  today: number = Date.now();
  date: Date;
  comments: Comment[];
  comment: Comment;
  teamdeliverable= +this.route.snapshot.paramMap.get('id');
  user = new User();
  profile = new Profile();
  coach_photo: string = '';
  coach: Coach;
  is_coach: boolean;
  is_team_member: boolean;
  is_superuser: boolean;
  team_photo: string = '';

  constructor(
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private commentsService: CommentsService,
    private teamMemberService: TeamMemberService,
    private coachService: CoachService,
    private teamService: TeamService,
  ) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    if (this.user.is_superuser) {
      this.is_team_member = false;
      this.is_coach = false;
    } else {
      this.is_team_member = this.user.profile.is_team_member;
      this.is_coach = this.user.profile.is_coach;
    }
    this.profile = this.user.profile;

    if(this.is_coach) {
      this.getCoachDetails(this.user.id);
      this.comment = this.newComment(this.teamdeliverable, this.user.id);
    }

    this.date = new Date(this.today);
    const teamId = this.teamId;
    this.teamdeliverable = +this.route.snapshot.paramMap.get('id');
    this.getComments(this.teamdeliverable, teamId);
    this.getTeamPhoto(teamId);
  }

  getCoachDetails(userId: number): void{
    this.coachService.getCoach(userId)
      .subscribe(coach => {
        this.coach = coach;
        if (this.coach.photo) this.coach_photo = this.coach.photo;
      });
  }

  getTeamPhoto(teamId: number) {
    this.teamService.getTeam(teamId).subscribe(team => {
      this.team = team;
      if (this.team.photo) this.team_photo = this.team.photo;

    })
  }

  getComments(teamdeliverableId: number, teamId: number): void {
    this.commentsService.getComments(teamdeliverableId, teamId)
      .subscribe(comments => {this.comments = comments;});
  }

  newComment(teamdeliverableId: number, coachId:number) : Comment {
    var comment = new Comment();
    comment.teamdeliverable = teamdeliverableId;
    comment.coach = this.user.id;
    comment.text = '';
    return comment; 
  }

  onSubmit() : void {
    if (this.comments && this.comments.length !== 0) {
      this.delete(this.comments[0]);
    }
    this.commentsService.addComment(this.comment, this.teamId)
      .subscribe(comment => {
        if (comment) {
          this.comments.unshift(comment);
          this.comment = this.newComment(comment.teamdeliverable, comment.coach);
        }
      });
  }

  delete(comment: Comment): void {
    this.comments = this.comments.filter(c => c !== comment);
    this.commentsService.deleteComment(comment, this.teamId).subscribe();
  }

}
