import { HelpLink } from './helpLink';

export class Deliverable {
  id: number;
  title: string;
  description: string;
  template: string;
  release_date: string;
  deadline: number;
  pipeline:string;
  icon:string;
  // links: HelpLink[];
}
