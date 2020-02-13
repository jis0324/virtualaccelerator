import { Component, Input, OnInit } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Team } from '../team'
import { TeamDeliverable } from '../teamdeliverable';
import { ActivatedRoute } from '@angular/router';
import { CoachService } from '../coach.service';
import { TeamService } from '../team.service';
import { Coach } from '../coach';
import { TeamdeliverableService } from '../teamdeliverable.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-coach-detail-deliverable',
  templateUrl: './coach-detail-deliverable.component.html',
  styleUrls: ['./coach-detail-deliverable.component.css'],
})
export class CoachDetailDeliverableComponent {

  @Input()
  coachTeams: Team[]

  coach: Coach;
  teams: Team[];
  // coachTeams = [];
  // teamDeliverable: TeamDeliverable;
  teamDeliverables: TeamDeliverable[];
  today: number = Date.now();

  t: any;
  currentJustify = 'start';
  currentOrientation = 'vertical';

  constructor(
    private route: ActivatedRoute,
    private coachService: CoachService,
    private teamService: TeamService,
    private teamdeliverableService: TeamdeliverableService,
    private datePipe: DatePipe,
    ) { }

  ngOnInit() {
    this.getCoach();
    this.getCoachTeams();
  }

  getCoach(): void {
    var id = +this.route.snapshot.paramMap.get('id');
    this.coachService.getCoach(id)
      .subscribe(coach => {
        this.coach = coach;
      });
  }

  // getCoachTeams() {
  //   this.teamService.getTeams()
  //     .subscribe(team => {
  //       this.teams = team;
  //       for (let i = 0; i < this.teams.length; i++) {
  //         if (this.teams[i].coach_id && this.coach.user == this.teams[i].coach_id) {
  //           this.teamdeliverableService.getTeamDeliverables(this.teams[i].id)
  //             .subscribe(deliverable => {
  //               this.teams[i].temp=deliverable;
  //               this.coachTeams.push(this.teams[i]);
  //             })
  //         }
  //       }
  //       console.log(this.coachTeams)
  //     });
  // }

  getCoachTeams() {
    // this.teamService.getTeams()
    //   .subscribe(team => {
    //     this.teams = team;
    if (this.coachTeams) {
      for (let i = 0; i < this.coachTeams.length; i++) {
        this.teamdeliverableService.getTeamDeliverables(this.coachTeams[i].id)
          .subscribe(deliverable => {
            console.log(deliverable);
            // this.teams[i].temp=deliverable;
            this.coachTeams[i].temp.push(deliverable);
            return;
          })
      }
    }
    console.log(this.coachTeams)
    // });
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
}
