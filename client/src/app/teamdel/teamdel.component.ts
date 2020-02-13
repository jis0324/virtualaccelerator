import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DatePipe, CommonModule } from '@angular/common';

import { DeliverableService } from '../deliverable.service';
import { TeamDeliverable } from '../teamdeliverable';
import { Deliverable } from '../deliverable';
import { TeamdeliverableService } from '../teamdeliverable.service';
import { User } from '../user';

@Component({
  selector: 'app-teamdel',
  templateUrl: './teamdel.component.html',
  styleUrls: ['./teamdel.component.css']
})
export class TeamdelComponent implements OnInit {
  @Input()
  team: number;

  user: User;
  is_superuser: boolean;
  is_team_member: boolean;
  is_coach: boolean;
  today: number = Date.now();
  teamDeliverables: TeamDeliverable[];
  teamDeliverable: TeamDeliverable;

  constructor(
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private teamDeliverableService: TeamdeliverableService,
    private deliverableService: DeliverableService,
  ) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.is_superuser = this.user.is_superuser;
    if(this.user.is_superuser) {
      this.is_team_member = false;
      this.is_coach = false;
    } else {
      this.is_team_member = this.user.profile.is_team_member;
      this.is_coach = this.user.profile.is_coach;
      if(this.is_coach) {
       }
    }
    const teamId = this.team;
    this.teamDeliverableService.getTeamDeliverables(teamId)
      .subscribe(
        teamDeliverables => this.teamDeliverables = teamDeliverables);
  }


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
