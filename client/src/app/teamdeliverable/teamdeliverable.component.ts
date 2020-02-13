import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DatePipe, CommonModule } from '@angular/common';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../user';

import { TeamDeliverable } from '../teamdeliverable';
import { Deliverable } from '../deliverable';
import { Comment } from '../comment';
import { TeamdeliverableService } from '../teamdeliverable.service';
import { DeliverableService } from '../deliverable.service';
import { CommentsService } from '../comments.service';
import { TeamService } from '../team.service';
import { Team } from '../team';

@Component({
  selector: 'app-teamdeliverable',
  templateUrl: './teamdeliverable.component.html',
  styleUrls: ['./teamdeliverable.component.css', './teamdeliverable.component.scss'],
})
export class TeamdeliverableComponent implements OnInit {
  is_superuser: boolean;
  is_coach: boolean;
  is_team_member: boolean;
  user: User;
  today: number = Date.now();
  date: Date;
  teamDeliverables: TeamDeliverable[];
  teamDeliverable: TeamDeliverable;
  deliverables: Deliverable[];
  valids: Deliverable[];
  closeResult: string;
  message: string;
  team: Team;

  constructor(
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private teamDeliverableService: TeamdeliverableService,
    private deliverableService: DeliverableService,
    private commentsService: CommentsService,
    private modalService: NgbModal,
    private teamService: TeamService,
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
    this.team = this.initTeam();
    this.date = new Date(this.today);
    const teamId = +this.route.snapshot.paramMap.get('id');
    this.getDeliverables();
    this.teamDeliverable = this.newTeamDeliverable(teamId);
    this.getTeamDeliverables(teamId);
    this.teamService.getTeam(teamId).subscribe(team=> this.team = team);
  }

  initTeam() {
    let initTeam = new Team();
    initTeam.name = '';
    return initTeam;
  }

  deliverable_color(deadline: Date): boolean {
    if (!deadline) {
      return true;
    }
    if (this.datePipe.transform(deadline, 'yyyy-MM-dd') > this.datePipe.transform(this.date, 'yyyy-MM-dd')) {
      return true;
    } else {
      return false;
    }
  }

  deliverable_color_10(deadline: Date): boolean {
    if (!deadline) {
      return true;
    }
    if (this.getDateAfterDays(10, this.datePipe.transform(deadline, 'yyyy-MM-dd')) > this.datePipe.transform(this.date, 'yyyy-MM-dd')) {
      return true;
    } else {
      return false;
    }
  }

  getTimeDifference(arg: Date) {
    var today = new Date(this.datePipe.transform(this.date, 'yyyy-MM-dd')); 
    var deadline = new Date(this.datePipe.transform(arg, 'yyyy-MM-dd'))
    var difference_In_Time = today.getTime() - deadline.getTime();
    var difference_In_Days = difference_In_Time / (1000 * 3600 * 24);
    return Math.abs(difference_In_Days);
    // console.log(this.datePipe.transform(this.date, 'yyyy-MM-dd'))

  }

  getTimeDifference_10(arg: Date) {
    var today = new Date(this.datePipe.transform(this.date, 'yyyy-MM-dd')); 
    var deadline = new Date(this.getDateAfterDays(10, this.datePipe.transform(arg, 'yyyy-MM-dd')) )
    var difference_In_Time = today.getTime() - deadline.getTime();
    var difference_In_Days = difference_In_Time / (1000 * 3600 * 24);
    return Math.abs(difference_In_Days);
    // console.log(this.datePipe.transform(this.date, 'yyyy-MM-dd'))

  }

  
  getDateAfterDays(arg1: number, arg2: any) {
    var deliverableDeadline = new Date(arg2);
    var difference_In_Days = arg1 * 1000 * 3600 * 24;
    var difference_In_Time = new Date(deliverableDeadline.getTime() + difference_In_Days);
    var teamDeliverableDeadline = this.datePipe.transform(difference_In_Time, 'yyyy-MM-dd');

    return teamDeliverableDeadline;
  }

  getTeamDeliverables(teamId): void {   
    this.teamDeliverableService.getTeamDeliverables(teamId)
    .subscribe(teamDeliverables => {
        for (let i = 0; i < teamDeliverables.length; i++) {
          this.commentsService.getComments(teamDeliverables[i].id, teamDeliverables[i].team)
            .subscribe(comment => {
              if (comment.length) teamDeliverables[i].comment = comment[0].text;
            })
        }
        this.teamDeliverables = teamDeliverables;
      });
  }

  getDeliverables(): void {
    this.deliverableService.getDeliverables()
      .subscribe(deliverables => {this.deliverables = deliverables;console.log(deliverables)});
  }

  newTeamDeliverable(teamId: number): TeamDeliverable {
    var teamDeliverable = new TeamDeliverable();
    teamDeliverable.deliverable = null;
    teamDeliverable.team = teamId;
    teamDeliverable.deadline = null;
    return teamDeliverable;
  }

  // onSubmit() : void {
  //   this.teamDeliverableService.addTeamDeliverable(this.teamDeliverable)
  //     .subscribe(teamDeliverable => {
  //       if (teamDeliverable) {
  //         this.teamDeliverables.unshift(teamDeliverable);
  //         this.teamDeliverable = this.newTeamDeliverable(teamDeliverable.team);
  //         this.message = "";
  //       } else {
  //         this.message = "This deliverable has been already added.";
  //       }
  //     });
  // }

  getEvenOrOdd(index) {
    if (index === 0) {
      return 'odd';
    } else if (index % 2 === 0) {
      return 'odd';
    } else if (index % 2 === 1) {
      return 'even';
    }
  }
  getstyle(index) {
    if (index === 0 || index % 2 === 0) {
      return '0 50% 0 0';
    } else if (index % 2 === 1) {
      return '0 0 0 50%';
    }
  }

  getTeamDeliverableName(name: string) {
    if (name) {
      return name.split('/teamdeliverables/')[1];
    } else {
      return '';
    }
      
  }

  getTeamDeliverablePath(path: string) {
    if (path) {
      return path;
    } else {
      return '';
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

}
