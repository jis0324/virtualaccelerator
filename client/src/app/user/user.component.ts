import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder } from "@angular/forms";
import { Router } from '@angular/router';
import { User } from '../user';
import { Profile } from '../profile';
import { TeamMember } from '../teamMember';
import { Coach } from '../coach';
import { TeamMemberService } from '../team-member.service';
import { CoachService } from '../coach.service';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { FormArray, Validators } from "@angular/forms";
import { UploadFileService } from '../upload-file.service'
import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { DeliverableService } from '../deliverable.service';
import { DatePipe } from '@angular/common';
import { TeamdeliverableService } from '../teamdeliverable.service';
import { TeamDeliverable } from '../teamdeliverable';
import { Team } from '../team';
import { TeamService } from '../team.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user = new User();
  username: string;
  id = null;
  profile = new Profile();
  is_superuser: boolean;
  is_coach: boolean;
  is_team_member: boolean;
  teamMember: TeamMember;
  team: Team;
  coach: Coach;
  editTeamMember: TeamMember;
  editCoach: Coach;
  editUser: User;
  photo: any;
  changedImage: boolean = false;
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
    private router: Router,
    private userService: UserService,
    private teamMemberService: TeamMemberService,
    private coachService: CoachService,
    private auth: AuthService,
    public fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private uploadFileService: UploadFileService,
    private http: HttpClient,
    private deliverableService: DeliverableService,
    private datePipe: DatePipe,
    private teamDeliverableService: TeamdeliverableService,
    private teamService: TeamService,
  ) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.username = this.user.username;
    this.id = this.user.id;
    this.is_superuser = this.user.is_superuser;
    console.log(this.user);
    if (this.user.is_superuser) {
      this.is_team_member = false;
      this.is_coach = false;
    } else {
      this.is_team_member = this.user.profile.is_team_member;
      this.is_coach = this.user.profile.is_coach;
    }
    if (this.user.is_superuser) {
      this.router.navigate(['/dashboard']);
    } else if (this.user.profile.is_team_member) {
      this.teamMember = this.newTeamMember();
      this.getTeamMemberDetails(this.user.id);
    } else if (this.user.profile.is_coach) {
      this.coach = this.newCoach();
      this.getCoachDetails(this.user.id);
    }
  }

  newTeamMember(): TeamMember {
    var teamMember = new TeamMember();
    teamMember.name = '';
    teamMember.team = this.team;
    // teamMember.photo = '';
    teamMember.email = '';
    teamMember.phone = '';
    teamMember.role = '';
    teamMember.field = '';
    return teamMember;
  }

  newCoach(): Coach {
    var coach = new Coach();
    coach.name = '';
    // teamMember.photo = '';
    coach.email = '';
    coach.phone = '';
    coach.organization = '';
    coach.field = '';
    coach.job_title = '';
    return coach;
  }

  getTeamMemberDetails(userId: number): void {
    this.teamMemberService.getTeamMember(userId)
      .subscribe(teamMember => {
        this.teamMember = teamMember;
        this.team = teamMember.team;
        let today = this.datePipe.transform(new Date(Date.now()), 'yyyy-MM-dd');
        this.deliverableService.getDeliverables()
          .subscribe(deliverables => {
            this.teamDeliverableService.getTeamDeliverables(teamMember.team.id)
              .subscribe(teamDeliverables => {
                for (let i = 0; i < deliverables.length; i++) {
                  let isExist = false;
                  for (let j = 0; j < teamDeliverables.length; j++) {
                    if (deliverables[i].id == teamDeliverables[j].deliverable.id) {
                      isExist = true;
                    }
                  }
                  if (!isExist) {
                    let duration = deliverables[i].deadline;
                    let teamDeliverableDeadline = this.getTeamDeliverableDeadline(deliverables[i].deadline, today);

                    let newTeamDeliverable = new TeamDeliverable();
                    newTeamDeliverable.deadline = teamDeliverableDeadline;
                    newTeamDeliverable.deliverable = deliverables[i].id;
                    newTeamDeliverable.team = teamMember.team.id;

                    this.teamDeliverableService.addTeamDeliverable(newTeamDeliverable)
                      .subscribe();

                    
                  }
                }
              })
          });
        if ( !this.team.login_date_1st ) {
          this.team.login_date_1st = today;
          this.teamService.updateTeam(this.team).subscribe();
        }
          
        setTimeout(() => {
          this.router.navigate(['teams/', teamMember.team.id]);
        }, 1000);
      });
  }

  getCoachDetails(userId: number): void {
    this.coachService.getCoach(userId)
      .subscribe(coach => {
        this.coach = coach;
        if (this.coach.photo) {
          this.imageUrl = this.coach.photo;
        };
      });
  }

  editCoachMethod(coach) {
    this.editCoach = coach;
  }

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
      alert('Please fill all the required fields to create a super hero!')
      return false;
    } else {
      console.log(this.registrationForm.value)
    }
  }

  updateCoach() {
    if (this.editCoach) {
      if (this.passwordResetForm.npassword == this.passwordResetForm.ncpassword) {
        document.getElementsByClassName('coach-npassword-error')[0].innerHTML = '';

        if (this.changedImage) {
          this.editCoach.photo = this.registrationForm.value.file;
          this.changedImage = false;
        } else {
          delete this.editCoach.photo;
        }

        this.coachService.updateCoach(this.editCoach)
          .subscribe(coach => {
            this.coach = coach;

            if (coach.name) {
              let updatedUser = new User();
              // auth_user table
              updatedUser.id = coach.user;
              updatedUser.username = this.user.username;
              updatedUser.password = this.user.password;
              updatedUser.is_superuser = this.is_superuser
              // vap_usertable
              // updatedUser.profile.name = coach.name;
              // updatedUser.profile.email = coach.email;
              // updatedUser.profile.phone = coach.phone;
              // updatedUser.profile.is_team_member = this.is_team_member;
              // updatedUser.profile.is_coach = this.is_coach;
              // updatedUser.profile.user = coach.user;

              // localStorage.remove('user');
              // localStorage.setItem('user', JSON.stringify(updatedUser));
            }
          });

        if (this.passwordResetForm.npassword) {

          var passwordResetData = {
            username: this.user.username,
            password: this.passwordResetForm.npassword,
          }

          this.coachService.resetPassword(passwordResetData)
            .subscribe();

        }

        this.editCoach = this.newCoach();

      } else {
        document.getElementsByClassName('coach-npassword-error')[0].innerHTML = 'Input newpassword correctly!';
      }
    }
  }


  getTeamDeliverableDeadline(arg1: number, arg2: any) {
    var deliverableDeadline = new Date(this.datePipe.transform(arg2, 'yyyy-MM-dd'));
    var difference_In_Days = arg1 * 1000 * 3600 * 24;
    var difference_In_Time = new Date(deliverableDeadline.getTime() + difference_In_Days);
    var teamDeliverableDeadline = this.datePipe.transform(difference_In_Time, 'yyyy-MM-dd');

    return teamDeliverableDeadline;
  }

}

class ImageSnippet {
  constructor(public src: string, public file: File) { }
}
