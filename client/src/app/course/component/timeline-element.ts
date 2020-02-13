import { Deliverable } from 'src/app/deliverable';

export interface TimelineElement {
  date: Date;
  title: string;
  selected?: boolean;
  content: Deliverable[];
}
