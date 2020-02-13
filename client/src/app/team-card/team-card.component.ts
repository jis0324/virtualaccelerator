import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, Input } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { Team } from '../team';
import { User } from '../user';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TeamService } from '../team.service';
import { UserService } from '../user.service';
import { UploadFileService } from '../upload-file.service'
import { Coach } from '../coach';
import { CoachService } from '../coach.service';
import { from } from 'rxjs';


@Component({
  selector: 'app-team-card',
  templateUrl: './team-card.component.html',
  styleUrls: ['./team-card.component.css']
})

export class TeamCardComponent implements OnInit {

  user: User;
  is_superuser: boolean;
  is_coach: boolean;
  is_team_member: boolean;
  editTeam: Team;
  editTeamAboutFlag: boolean;
  editTeamDataFlag: boolean;
  file: any;
  team: Team;
  changedImage: boolean = false;
  coachOfTeam: string = '';
  passwordResetForm = {
    npassword: '',
    ncpassword: '',
  };

  /*##################### Registration Form #####################*/
  registrationForm = this.fb.group({
    file: [null]
  })
  /*########################## File Upload ########################*/
  @ViewChild('fileInput') el: ElementRef;
  imageUrl: any = '';



  constructor(
    private route: ActivatedRoute,
    private teamService: TeamService,
    private coachService: CoachService,
    private userService: UserService,
    public fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private uploadFileService: UploadFileService

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
    this.editTeamAboutFlag = false;
    this.editTeamDataFlag = false;
    this.team = this.initTeam();
    this.getTeam();
  }

  getTeam(): void {
    var id = +this.route.snapshot.paramMap.get('id');
    this.teamService.getTeam(id)
      .subscribe(team => {
        if (team.coach_id) {
          this.coachService.getCoach(team.coach_id)
            .subscribe(coach => {
              this.team.coach = coach;
              this.coachOfTeam = coach.name;
            })
        }
        this.team = team;
        if (this.team.photo) {
          this.imageUrl = this.team.photo;
        }
      });
  }

  initCoach(): Coach {
    var newCoach = new Coach();
    newCoach.name = '';
    return newCoach;
  }

  initTeam(): Team {
    var team = new Team();
    team.name = '';
    team.website = '';
    team.pipeline = '';
    team.photo = '';
    team.maturity_level = 0;
    team.tag_line = '';
    team.research_stream = false;
    team.coorporate_existance = false;
    team.date_of_entry = new Date();
    team.about = '';
    team.coach_id = 0;
    team.coach = this.initCoach();
    return team;
  }

  editTeamAbout() {
    this.editTeamAboutFlag = true;
  }

  editTeamData() {
    this.editTeamDataFlag = true;
  }

  updateTeamSubmit() {
    if (this.passwordResetForm.ncpassword == this.passwordResetForm.npassword) {
      console.log(this.team)
      if (this.changedImage) {
        this.team.photo = this.registrationForm.value.file;
        this.changedImage = false;
      } else {
        delete this.team.photo;
      }

      this.teamService.updateTeam(this.team)
        .subscribe(team => {
          this.editTeamDataFlag = false;
          this.editTeamAboutFlag = false;
        });

      if (this.passwordResetForm.npassword) {

        var passwordResetData = {
          username: this.user.username,
          password: this.passwordResetForm.npassword,
        }
        this.coachService.resetPassword(passwordResetData)
          .subscribe();
      }
    } else {
      document.getElementById('teammember-npassword-error').innerHTML = 'Input Confirm Password Correctly!';
      document.getElementById('teammember-npassword-error').style.marginTop = '30px';
    }
  }
  // getTeamMemberDetails(userId: number): void {
  //   this.teamMemberService.getTeamMember(userId)
  //     .subscribe(teamMember => {
  //       this.teamMember = teamMember;
  //       // this.team = teamMember.team;
  //     });
  // }


  // newTeamMember(): TeamMember {
  //   var teamMember = new TeamMember();
  //   teamMember.name = '';
  //   teamMember.team = this.team;
  //   // teamMember.photo = '';
  //   teamMember.email = '';
  //   teamMember.phone = '';
  //   teamMember.role = '';
  //   teamMember.field = '';
  //   teamMember.cpassword = '';
  //   teamMember.npassword = '';
  //   teamMember.ncpassword = '';
  //   return teamMember;
  // }

  // editTeamMethod(teamMember) {
  //   console.log(this.team)
  //   teamMember.team = this.team;
  //   this.editTeamMember = teamMember;
  // }

  // updateTeam() {
  //   console.log(this.teamMember)
  //   console.log(this.editTeamMember);
  //   if (this.editTeamMember) {
  //     if (this.teamMember.npassword == this.teamMember.ncpassword) {
  //       document.getElementsByClassName('teammember-npassword-error')[0].innerHTML = '';
  //       this.editTeamMember.team = this.editTeamMember.team.id;
  //       this.teamMemberService.updateTeamMember(this.editTeamMember)
  //         .subscribe(teamMember => {
  //           this.teamMember = teamMember;
  //           let updatedUser = new User();
  //           updatedUser.id = teamMember.user;
  //           updatedUser.username = this.user.username;
  //           updatedUser.profile.cpassword = teamMember.cpassword;
  //           updatedUser.profile.npassword = teamMember.npassword;
  //           updatedUser.profile.name = teamMember.name;
  //           updatedUser.profile.email = teamMember.email;
  //           updatedUser.profile.phone = teamMember.phone;
  //           updatedUser.profile.is_team_member = this.is_team_member;
  //           updatedUser.profile.is_coach = this.is_coach;
  //           console.log(updatedUser);
  //           console.log(this.user);
  //           localStorage.remove('user');
  //           localStorage.setItem('user', JSON.stringify(updatedUser));

  //         });
  //       // location.reload();
  //       this.editTeamMember = undefined;
  //     } else {
  //       document.getElementsByClassName('teammember-npassword-error')[0].innerHTML = 'Input newpassword correctly!';
  //     }
  //   }

  // }

  uploadFile(event) {
    this.changedImage = true;
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.imageUrl = reader.result;
        this.registrationForm.patchValue({
          file: reader.result
        });
      }
      // ChangeDetectorRef since file is loading outside the zone
      this.cd.markForCheck();
    }
  }

  // Submit Registration Form
  onSubmit() {
    if (!this.registrationForm.valid) {
      return false;
    } else {
    }
  }

}
