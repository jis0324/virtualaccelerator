import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DatePipe, CommonModule } from '@angular/common';
import { User } from '../user';
import { Team } from '../team';
import { TeamMemberService } from '../team-member.service';
import { TeamDeliverable } from '../teamdeliverable';
import { Deliverable } from '../deliverable';
import { TeamdeliverableService } from '../teamdeliverable.service';
import { DeliverableService } from '../deliverable.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-deliverables-team',
  templateUrl: './deliverables-team.component.html',
  styleUrls: ['./deliverables-team.component.css']
})
export class DeliverablesTeamComponent implements OnInit {

  today: number = Date.now();
  date: Date;
  teamDeliverables: TeamDeliverable[];
  deliverables : Deliverable[];
  team: Team;
  user: User;
  is_team_member: boolean;


  constructor(
    private route: ActivatedRoute,
    private teamMemberService: TeamMemberService,
    private auth: AuthService,
    private datePipe: DatePipe,
    private teamDeliverableService: TeamdeliverableService,
    private deliverableService: DeliverableService,
  ) { }


   ngOnInit() {
     this.user = JSON.parse(localStorage.getItem('user'));
     this.is_team_member = this.user.profile.is_team_member;
     if(this.user.profile.is_team_member) {
       this.getTeamMemberDetails(this.user.id);
     }
     this.date = new Date(this.today);
     this.getDeliverables();
   }


   getTeamMemberDetails(userId: number): void{
     this.teamMemberService.getTeamMember(userId)
        .subscribe(teamMember => {
            this.team = teamMember.team;
            this.getTeamDeliverables(teamMember.team.id);
        });
    }

   deliverable_color(deadline: Date): boolean {
     if(!deadline) {
       return true;
     }
     if (this.datePipe.transform(deadline, 'yyyy-MM-dd') > this.datePipe.transform(this.date, 'yyyy-MM-dd')) {
       return true;
     } else {
       return false;
     }
   }

   getTeamDeliverables(teamId): void {
     this.teamDeliverableService.getTeamDeliverables(teamId)
       .subscribe(teamDeliverables => this.teamDeliverables = teamDeliverables);
   }

   getDeliverables(): void {
     this.deliverableService.getDeliverables()
      .subscribe(deliverables => this.deliverables = deliverables);
   }


}
