import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Team } from '../team';
import {TeamService} from '../team.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { from } from 'rxjs'


@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {
  user: User;
  is_superuser: boolean;
  is_team_member: boolean;
  is_coach: boolean;
  coach_id: number;
  teams : Team[];
  closeResult: string;
  url: string;
  team : Team;

  constructor(
    private route: ActivatedRoute,
    private teamService: TeamService,
    private modalService: NgbModal,
    private auth: AuthService
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
        this.coach_id = this.user.profile.user;
       }
    }
    this.getTeams();
    this.team = this.newTeam();
   }
   
   getTeams(): void {
     this.teamService.getTeams()
      .subscribe(teams => {
        var temp = [];
        if(this.coach_id && teams) {
          for (let i=0; i<teams.length; i++) {
            if (teams[i].coach_id && teams[i].coach_id == this.coach_id) {
              if (!teams[i].photo) {
                teams[i].photo = '';
              }
              
              temp.push(teams[i]);
            }
          }
          this.teams = temp; 
        } else {
          this.teams = teams;
        } 
      });
   }


  newTeam() : Team {
    var team = new Team();
    team.name = '';
    team.website = '';
    team.pipeline = '';
    team.maturity_level = null;
    team.tag_line = '';
    team.research_stream = false;
    team.coorporate_existance = false;
    team.date_of_entry = new Date();
    return team;
  }

  onSubmit() : void {
    this.teamService.addTeam(this.team)
      .subscribe(team => {
        if (team) {
          this.teams.unshift(team);
          this.team = this.newTeam();
        }
      });
  }

    delete(team: Team): void {
      this.teams = this.teams.filter(h => h !== team);
      this.teamService.deleteTeam(team).subscribe();
    }


// Modal method
  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
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
      return  `with: ${reason}`;
    }
  }

}
