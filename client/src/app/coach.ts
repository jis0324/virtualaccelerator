import { Team } from './team';

export class Coach {
// auth_user table
  user: number;
  password: string;
  username: string;
//vap_user table
  name: string;
  phone: string;
  email: string;
// vap_coach table
  job_title: string;
  organization: string;
  field: string;
  photo: string;
  about_me: string;

// ....
  hasTeamNum: number;
  hasCommentNum: number;
  teams: Team[];
}
