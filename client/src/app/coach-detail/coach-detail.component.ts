import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Coach } from '../coach';
import { Team } from '../team';
import { CoachService } from '../coach.service';
import { TeamService } from '../team.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TeamDeliverable } from '../teamdeliverable';
import { TeamdeliverableService } from '../teamdeliverable.service';
import { DatePipe } from '@angular/common';
import { User } from '../user';
import { CommentsService } from '../comments.service';
import { Comment } from '../comment';

@Component({
  selector: 'app-coach-detail',
  templateUrl: './coach-detail.component.html',
  styleUrls: ['./coach-detail.component.css']
})
export class CoachDetailComponent implements OnInit {
  user = new User();
  coach: Coach;
  is_coach: boolean;
  is_team_member: boolean;
  is_superuser: boolean;
  teams: Team[];
  teamsWithoutCoach = [];
  coachTeams = [];
  closeResult: string;
  message: string;
  addedTeam: Team;
  teamDeliverables: TeamDeliverable[];
  today: number = Date.now();
  photo: any = '';
  coachId: number = +this.route.snapshot.paramMap.get('id');
  comments: Comment[];
  currentJustify = 'start';
  currentOrientation = 'vertical';
  delayed_days: string = '';
  
  constructor(
    private route: ActivatedRoute,
    private coachService: CoachService,
    private teamService: TeamService,
    private modalService: NgbModal,
    private teamdeliverableService: TeamdeliverableService,
    private datePipe: DatePipe,
    private commentService: CommentsService,
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
    this.addedTeam = this.initTeam();
    this.coach = this.initCoach();
    this.getTeamWithoutCoach();
    this.getCoach();
    this.getAllComments();
  }
  initTeam(): Team {
    var newTeam = new Team();
    newTeam.id = 0;
    newTeam.website = '';
    newTeam.tag_line = '';
    newTeam.research_stream = false;
    newTeam.pipeline = '';
    newTeam.photo = '';
    newTeam.name = '';
    newTeam.maturity_level = 0;
    newTeam.coorporate_existance = false;
    newTeam.date_of_entry = new Date();
    return newTeam;
  }
  initCoach(): Coach {
    var newCoach = new Coach();
    newCoach.user = 0;
    newCoach.password = '';
    newCoach.username = '';
    newCoach.about_me = '';
    newCoach.job_title = '';
    newCoach.organization = '';
    newCoach.field = '';
    newCoach.teams = [];
    newCoach.name = '';
    newCoach.photo = '';
    newCoach.email = '';
    newCoach.phone = '';
    newCoach.hasTeamNum = 0;
    return newCoach;
  }

  getAllComments(): void {
    this.commentService.getAllComments().subscribe(comments => this.comments = comments);
  }

  getCoach(): void {
    this.coachService.getCoach(this.coachId)
      .subscribe(coach => {
        this.coach = coach;
        console.log(this.is_superuser)
        if (coach.photo) {
          this.photo = coach.photo;
        }
      });
  }
  getTeamDeliverable(coachTeam: Team) {
    this.teamdeliverableService.getTeamDeliverables(coachTeam.id)
      .subscribe(deliverable => {
        coachTeam.temp = deliverable;
        return coachTeam;
      })
  }

  getTeamWithoutCoach() {
    this.teamService.getTeams()
      .subscribe(team => {
        this.teams = team;
        if (this.teams) {
          for (let i = 0; i < this.teams.length; i++) {
            var teamDeliverable = this.getTeamDeliverable(this.teams[i]);
            this.teams[i].temp = teamDeliverable;
            if (this.coachId == this.teams[i].coach_id) {
              this.coachTeams.push(this.teams[i]);
            } else if (!this.teams[i].coach_id) {
              this.teamsWithoutCoach.push(this.teams[i]);
            }
          }
        }
      });
  }

  deleteTeam(delteam: Team) {
    if (delteam.id) {
      delteam.coach_id = 0;
      this.teamService.updateTeamToCoach(delteam)
        .subscribe(deletedTeam => {
          for (let i = 0; i < this.coachTeams.length; i++) {
            if (this.coachTeams[i].id == deletedTeam.id) {
              this.teamsWithoutCoach.unshift(this.coachTeams[i]);
              this.coachTeams.splice(i, 1);
              break;
            }
          }

        }
        );
    }
  }

  onSubmit(): void {
    if (this.addedTeam.id) {
      this.message = "";
      this.addedTeam.coach_id = this.coach.user;
      this.teamService.updateTeamToCoach(this.addedTeam)
        .subscribe(addTeam => {
          this.coachTeams.push(this.addedTeam);
          this.addedTeam = this.initTeam();
          this.modalService.dismissAll();
          for (let i = 0; i < this.teamsWithoutCoach.length; i++) {
            if (this.teamsWithoutCoach[i].id == addTeam.id) {
              this.teamsWithoutCoach.splice(i, 1);
              break;
            }
          }
        });
    } else {
      this.message = "You did't select the team."
    }

  }

  // Modal method
  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  // Modal method
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  public beforeChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'bar') {
      $event.preventDefault();
    }
  };


  deliverable_color(deadline: Date): boolean {
    if (!deadline) {
      return true;
    }
    if (this.datePipe.transform(deadline, 'yyyy-MM-dd') > this.datePipe.transform(this.today, 'yyyy-MM-dd')) {
      return true;
    } else {
      return false;
    }
  }

  get_image_name(teamdeliverable: TeamDeliverable) {
    if (teamdeliverable.status) {
      let isComment = false;
      for (let i=0; i< this.comments.length; i++) {
        console.log(this.comments[i]);
        if (this.comments[i].teamdeliverable == teamdeliverable.id ) {
          isComment = true;
          return '../../assets/img/teams/check.png';
        }
      }
      if (!isComment) {
        if ( this.getDateFromDays( 10, this.datePipe.transform(teamdeliverable.deadline, 'yyyy-MM-dd')) > this.datePipe.transform(this.today, 'yyyy-MM-dd') ) {
          this.delayed_days = '';
        } else {
          this.delayed_days = '' + this.getDifferenceDaysFromDate(this.datePipe.transform(this.today, 'yyyy-MM-dd'), this.getDateFromDays( 10, this.datePipe.transform(teamdeliverable.deadline, 'yyyy-MM-dd'))) + '  days delay';
        }
        return '../../assets/img/teams/warning.png';
      }
    //           return '../../assets/img/teams/check.png';
    } else {
      if (this.datePipe.transform(teamdeliverable.deadline, 'yyyy-MM-dd') < this.datePipe.transform(this.today, 'yyyy-MM-dd')) {
        this.delayed_days = 'team delayed  ' + this.getDifferenceDaysFromDate(this.datePipe.transform(this.today, 'yyyy-MM-dd'), this.datePipe.transform(teamdeliverable.deadline, 'yyyy-MM-dd')) + '  days';
      } 
      return '../../assets/img/teams/warning.png';
    }
    
  }

  getDateFromDays(arg1: any, arg2: any) {
    var deliverableDeadline = new Date(this.datePipe.transform(arg2, 'yyyy-MM-dd'));
    var difference_In_Days = arg1 * 1000 * 3600 * 24;
    var difference_In_Time = new Date(deliverableDeadline.getTime() + difference_In_Days);
    var teamDeliverableDeadline = this.datePipe.transform(difference_In_Time, 'yyyy-MM-dd');

    return teamDeliverableDeadline;
  }

  getDifferenceDaysFromDate(arg1: any, arg2: any) {
    var realese = new Date(this.datePipe.transform(arg2, 'yyyy-MM-dd'));
    var deadline = new Date(this.datePipe.transform(arg1, 'yyyy-MM-dd'))
    var difference_In_Time = realese.getTime() - deadline.getTime();
    var difference_In_Days = difference_In_Time / (1000 * 3600 * 24);
    return Math.abs(difference_In_Days);
  }

}
