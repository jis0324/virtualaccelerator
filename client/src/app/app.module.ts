import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule }    from '@angular/common/http';
import { DatePipe, CommonModule } from '@angular/common'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './token.interceptor';
import { mergeMap } from 'rxjs/operators';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TeamsComponent } from './teams/teams.component';
import { TeamMemberComponent } from './team-member/team-member.component';
import { TeamDetailComponent } from './team-detail/team-detail.component';
import { MessagesComponent } from './messages/messages.component';
import { AppRoutingModule } from './app-routing.module';
import { DeliverableComponent } from './deliverable/deliverable.component';
import { TeamSearchComponent } from './team-search/team-search.component';
import { TeamMemberService } from './team-member.service';
import { TeamService } from './team.service';
import { DeliverableService } from './deliverable.service';
import { TeamdeliverableComponent } from './teamdeliverable/teamdeliverable.component';
import { TeamdeliverableDetailComponent } from './teamdeliverable-detail/teamdeliverable-detail.component';
import { TeamdeliverableService } from './teamdeliverable.service';
import { TeamdelComponent } from './teamdel/teamdel.component';
import { LoginComponent } from './login/login.component';
import { AuthService } from './auth.service';
import { UserComponent } from './user/user.component';
import { UserService } from './user.service';
import { TeamCardComponent } from './team-card/team-card.component';
import { DeliverablesTeamComponent } from './deliverables-team/deliverables-team.component';
import { CommentsComponent } from './comments/comments.component';
import { CoachDeliverablesComponent } from './coach-deliverables/coach-deliverables.component';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { CourseComponent } from './course/course.component';
import { HorizontalTimelineComponent } from './course/component/horizontal-timeline.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CoachComponent } from './coach/coach.component';
import { CoachDetailComponent } from './coach-detail/coach-detail.component';
import { CoachDetailDeliverableComponent } from './coach-detail-deliverable/coach-detail-deliverable.component';

@NgModule({
  declarations: [
    AppComponent,
    TeamsComponent,
    TeamMemberComponent,
    TeamDetailComponent,
    MessagesComponent,
    DeliverableComponent,
    TeamSearchComponent,
    TeamdeliverableComponent,
    TeamdeliverableDetailComponent,
    TeamdelComponent,
    LoginComponent,
    UserComponent,
    TeamCardComponent,
    DeliverablesTeamComponent,
    CommentsComponent,
    CoachDeliverablesComponent,
    UploadFileComponent,
    CourseComponent,
    HorizontalTimelineComponent,
    DashboardComponent,
    CoachComponent,
    CoachDetailComponent,
    CoachDetailDeliverableComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule
  ],
  providers: [DatePipe, TeamMemberService, TeamService, DeliverableService, TeamdeliverableService, UserService, AuthService, {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
