import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DatePipe, CommonModule } from '@angular/common';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import { TeamDeliverable } from '../teamdeliverable';
import { Deliverable } from '../deliverable';
import { TeamdeliverableService } from '../teamdeliverable.service';
import {DeliverableService} from '../deliverable.service';


@Component({
  selector: 'app-coach-deliverables',
  templateUrl: './coach-deliverables.component.html',
  styleUrls: ['./coach-deliverables.component.css']
})
export class CoachDeliverablesComponent implements OnInit {

  today: number = Date.now();
  date: Date;
  teamDeliverables: TeamDeliverable[];


  constructor(
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private teamDeliverableService: TeamdeliverableService,
  ) { }

  ngOnInit() {
    this.date = new Date(this.today);
    this.getAllTeamDeliverables();
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

  getAllTeamDeliverables(): void {
    this.teamDeliverableService.getAllTeamDeliverables()
      .subscribe(teamDeliverables => this.teamDeliverables = teamDeliverables.slice(0, 15));
  }

}
