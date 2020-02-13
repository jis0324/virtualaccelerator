import { Component, OnInit, Input } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { User } from '../user';

@Component({
  selector: 'app-team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.css']
})
export class TeamDetailComponent implements OnInit {
  user: User;
  is_team_member: boolean;
  is_superuser: boolean;
  is_coach: boolean;
  constructor(
    private location: Location
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
  }

  goBack(): void {
    this.location.back();
  }
}
