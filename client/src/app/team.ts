import { Deliverable } from './deliverable';
import { Coach } from './coach';

export class Team {
  id: number;
  name: string;
  photo: string;
  website: string;
  pipeline: string;
  maturity_level: number;
  date_of_entry: Date;
  tag_line: string;
  research_stream: boolean;
  coorporate_existance: boolean;
  about: string;
  deliverables: Deliverable[];
  coach_id: number;
  login_date_1st: string;
  coach: Coach;
  temp: any;
}
