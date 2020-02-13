import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { TeamMember } from '../teamMember';
import { Team } from '../team';
import { User } from '../user';
import { TeamMemberService } from '../team-member.service';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { RealTeamMember } from '../realteammember';

@Component({
  selector: 'app-team-member',
  templateUrl: './team-member.component.html',
  styleUrls: ['./team-member.component.css']
})
export class TeamMemberComponent implements OnInit {
  @Input()
  team: Team;

  teamMembers: RealTeamMember[];
  teamId: number;
  teamMember: RealTeamMember;
  editTeamMember: RealTeamMember;
  addTeamMember: RealTeamMember;
  closeResult: string;
  user: User;
  addMemberFlag: boolean;
  is_team_member: boolean;
  is_superuser: boolean;
  is_coach: boolean;

  constructor(
    private route: ActivatedRoute,
    private teamMemberService: TeamMemberService,
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
    const teamIdUrl = +this.route.snapshot.paramMap.get('id');
    const team = this.team;
    this.teamId = teamIdUrl;
    this.teamMember = this.newRealTeamMember(this.teamId);
    this.addTeamMember = this.newRealTeamMember(this.teamId);
    if(teamIdUrl) {
      return this.teamMemberService.getTeamMembers(teamIdUrl)
        .subscribe(teamMembers => {
          let temp : RealTeamMember[] = [];
          for(let i = 0; i < teamMembers.length; i++) {
            if (teamMembers[i].team_id == this.teamId) {
              temp.push(teamMembers[i])
            }
          }
          this.teamMembers = temp;
        });
    }
  }

  newRealTeamMember(teamId: number) : RealTeamMember {
    var teamMember = new RealTeamMember();
    teamMember.id = null;
    teamMember.name = '';
    teamMember.role = '';
    teamMember.team_id = teamId;
    return teamMember;
  }

  edit(teamMember) {
    this.editTeamMember = teamMember;
  }

  update() {
    if (this.editTeamMember) {
      this.teamMemberService.updateTeamMember(this.editTeamMember)
        .subscribe(teamMember => {
        });
      this.editTeamMember = this.newRealTeamMember(this.teamId);
    }
  }

  create() {
    if(this.addMemberFlag) {
      this.teamMemberService.realAddTeamMember(this.addTeamMember)
        .subscribe(teamMember => {
          this.teamMembers.push(teamMember);
        });
      this.addMemberFlag = false;
    }
  }
  addmember() {
    this.addMemberFlag = true;
    this.addTeamMember = this.newRealTeamMember(this.teamId);
  }

}
