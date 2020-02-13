import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { catchError } from 'rxjs/operators';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  message: string;
  isLoggedIn: boolean = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.isLoggedIn = this.auth.isLoggedIn;
  }

  login(username: any, password: any) {
    this.auth.login(username, password)
      .subscribe(res => {
        if (res) {
          this.router.navigate(['/users', username]);
          setTimeout(() => {
            location.reload();
          }, 200);
        } else {
          this.message = "Wrong username or password."
        }
    });
  }

  logout() {
    this.auth.logout();
    location.reload();
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 500);
    
  }
}
