import { Component, OnInit, Input } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DatePipe, CommonModule } from '@angular/common';
import { TeamdeliverableService }  from '../teamdeliverable.service';

import { TeamDeliverable } from '../teamdeliverable';
import { TeamService } from '../team.service';
import { Team } from '../team';


@Component({
  selector: 'app-teamdeliverable-detail',
  templateUrl: './teamdeliverable-detail.component.html',
  styleUrls: ['./teamdeliverable-detail.component.css']
})
export class TeamdeliverableDetailComponent implements OnInit {
    today: number = Date.now();
    date: Date;
    teamdeliverable: TeamDeliverable;
    files: any[];
    file: any;
    user = JSON.parse(localStorage.getItem('user'));
    profile = this.user.profile;
    is_coach: boolean;
    is_team_member: boolean;
    is_superuser: boolean;
    message: string;
    templatePath: string;
    templateName: string;
    teamDeliverableName: string;
    teamDeliverablePath: string;
    team: Team;

  constructor(
    private route: ActivatedRoute,
    private teamdeliverableService: TeamdeliverableService,
    private location: Location,
    private datePipe: DatePipe,
    private teamService: TeamService,
  ) { }

  ngOnInit(): void {
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
    this.profile = this.user.profile;
    this.date = new Date(this.today);
    this.getTeamdeliverable();
  }
  
  initTeam() {
    let initTeam = new Team();
    initTeam.name = '';
    return initTeam;
  }

  getTeamdeliverable(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    const team_id = +this.route.parent.snapshot.paramMap.get('id');

    this.teamdeliverableService.getTeamdeliverable(id, team_id)
      .subscribe(teamdeliverable => {
        this.teamdeliverable = teamdeliverable;
        console.log(teamdeliverable)

        this.teamService.getTeam(teamdeliverable.team).subscribe( team => this.team = team);
        if (teamdeliverable.deliverable.template) {
          this.templatePath = teamdeliverable.deliverable.template;
          this.templateName = teamdeliverable.deliverable.template.split('/deliverables/')[1];
        }
        if (teamdeliverable.file) {
          this.teamDeliverablePath = teamdeliverable.file;
          this.teamDeliverableName = teamdeliverable.file.split('/teamdeliverables/')[1];
        }
      });
  }

  goBack(): void {
    this.location.back();
  }

  isEmptyObject(obj) {
    return (obj && (Object.keys(obj).length === 0));
  }

  deadline_status(deadline: Date): boolean {
    if(!deadline) {
      return true;
    }
    if (this.datePipe.transform(deadline, 'yyyy-MM-dd') > this.datePipe.transform(this.date, 'yyyy-MM-dd')) {
      return true;
    } else {
      return false;
    }
  }


  handleInputChange(e) {
    this.files = e.target.files;
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var reader = new FileReader();
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e) {
    let reader = e.target;
    this.file = reader.result;
    console.log(this.file)
  }

    save(): void {
      let validFile = true;
      let delivId = this.teamdeliverable.deliverable.id;
      this.teamdeliverable.deliverable = delivId;
      this.teamdeliverable.file = this.file
      this.teamdeliverable.status = true;

      this.teamdeliverableService.updateTeamDeliverable(this.teamdeliverable)
        .subscribe( teamdel => {
          if (teamdel) {
            this.teamdeliverable = teamdel;
            this.message = "Submited!";
            if (teamdel.file) {
              this.teamDeliverablePath = teamdel.file;
              this.teamDeliverableName = teamdel.file.split('/teamdeliverables/')[1];
            }
          } else {
            validFile = false;
            this.message = "You have to submit a PDF file.";
          }
        });
      if (!validFile) {
        this.teamdeliverable.file = null
        this.teamdeliverable.status = false;
      }
      this.clear();
    }

    clear() {
      this.files = [];
      this.ngOnInit();
    }




}
