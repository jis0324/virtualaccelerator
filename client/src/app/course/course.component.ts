import { Component, OnInit } from '@angular/core';
import { TimelineElement } from './component/timeline-element';
import { DeliverableService } from '../deliverable.service'
import { Deliverable } from '../deliverable';

@Component({
    selector: 'app-course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.scss']
})

export class CourseComponent implements OnInit {
    courseFlow: TimelineElement[] = [
        { date: new Date(2020, 1, 1), selected: true, title: 'Team Manifesto', content: [] },
        { date: new Date(2020, 2, 1), title: 'Business Model', content: [] },
        { date: new Date(2020, 3, 1), title: 'Prototype', content: [] },
        { date: new Date(2020, 4, 1), title: 'Business Validation', content: [] },
        { date: new Date(2020, 5, 1), title: 'Financial', content: [] },
    ]
    constructor(
        private deliverableService: DeliverableService

    ) { }
    ngOnInit() {
        this.getDeliverables();
    }

    getDeliverables(): void {
        this.deliverableService.getDeliverables()
            .subscribe(courses => {
                // this.courses = courses;
                for (let i = 0; i < courses.length; i++) {
                    for (let j = 0; j < this.courseFlow.length; j++) {
                        if (courses[i].title == this.courseFlow[j].title) {
                            this.courseFlow[j]['content'].push(courses[i]);
                        }
                    }
                }
                for (let j = 0; j < this.courseFlow.length; j++) {
                    if (!this.courseFlow[j].content.length) {
                        this.courseFlow[j]['content'].push(this.newContent());
                    }
                }
            });
    }

    newContent(): Deliverable {
        var deliverable = new Deliverable;
        deliverable.id = null;
        deliverable.template = null;
        deliverable['title'] = '';
        deliverable['description'] = '';
        deliverable['pipeline'] = '';
        deliverable['icon'] = '';
        deliverable['release_date'] = '';
        deliverable['deadline'] = 0;
        return deliverable;
    }

}