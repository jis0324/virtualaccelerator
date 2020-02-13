import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { User } from './user';
import { Profile } from './profile';
import {UserService} from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Accelerator';
  userdata = new User();
  id = null;
  profile = new Profile();
  name = '';
  email = '';
  phone = '';
  is_coach: Boolean;
  is_team_member: Boolean;
  is_superuser: boolean;
  isLoggedIn: boolean = false;

  constructor(private auth: AuthService, private userService: UserService) {}

  ngOnInit() {
    if (localStorage.getItem('vap-jwt-access-token') !== null || localStorage.getItem('vap-jwt-refresh-token') !== null) {
      this.auth.isLoggedIn = true;
      this.isLoggedIn = this.auth.isLoggedIn;
      let user = JSON.parse(localStorage.getItem('user'));
      this.profile = user.profile;
      this.userdata = user;
    }
  }

}
