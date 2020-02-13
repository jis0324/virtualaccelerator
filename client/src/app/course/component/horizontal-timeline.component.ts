import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  QueryList,
  ViewChild,
  ViewChildren,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { TimelineElement } from './timeline-element';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { User } from '../../user';
import { Deliverable } from '../../deliverable'
import { from } from 'rxjs';
import { DeliverableService } from '../../deliverable.service';
import { HelpLink } from 'src/app/helpLink';
import { TeamDeliverable } from 'src/app/teamdeliverable';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TeamdeliverableService } from '../../teamdeliverable.service';
import { TeamService } from '../../team.service';
import { Team } from 'src/app/team';
import { Coach } from 'src/app/coach';

@Component({
  selector: 'horizontal-timeline',
  templateUrl: 'horizontal-timeline.component.html',
  styleUrls: ['horizontal-timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('contentState', [
      state('active', style({
        position: 'relative', 'z-index': 2, opacity: 1,
      })),
      transition('right => active', [
        style({
          transform: 'translateX(100%)'
        }),
        animate('400ms ease-in-out', keyframes([
          style({ opacity: 0, transform: 'translateX(100%)', offset: 0 }),
          style({ opacity: 1, transform: 'translateX(0%)', offset: 1.0 })
        ]))
      ]),
      transition('active => right', [
        style({
          transform: 'translateX(-100%)'
        }),
        animate('400ms ease-in-out', keyframes([
          style({ opacity: 1, transform: 'translateX(0%)', offset: 0 }),
          style({ opacity: 0, transform: 'translateX(100%)', offset: 1.0 })
        ]))
      ]),
      transition('active => left', [
        style({
          transform: 'translateX(-100%)'
        }),
        animate('400ms ease-in-out', keyframes([
          style({ opacity: 1, transform: 'translateX(0%)', offset: 0 }),
          style({ opacity: 0, transform: 'translateX(-100%)', offset: 1.0 })
        ]))
      ]),
      transition('left => active', [
        style({
          transform: 'translateX(100%)'
        }),
        animate('400ms ease-in-out', keyframes([
          style({ opacity: 0, transform: 'translateX(-100%)', offset: 0 }),
          style({ opacity: 1, transform: 'translateX(0%)', offset: 1.0 })
        ]))
      ]),
    ])
  ]
})

export class HorizontalTimelineComponent implements OnInit, AfterViewInit {
  
  @ViewChild('eventsWrapper') eventsWrapper: ElementRef;
  @ViewChild('fillingLine') fillingLine: ElementRef;
  @ViewChildren('timelineEvents') timelineEvents: QueryList<ElementRef>;
  eventsWrapperWidth: number = 0;
  private _viewInitialized = false;

  constructor(
    private _cdr: ChangeDetectorRef,
    private datePipe: DatePipe,
    private deliverableService: DeliverableService,
    private route: ActivatedRoute,
    private teamdeliverableService: TeamdeliverableService,
    private teamService: TeamService,
  ) { }

  private _timelineWrapperWidth = 720;

  @Input()
  set timelineWrapperWidth(value: number) {
    this._timelineWrapperWidth = value;
    this._cdr.detectChanges();
  }

  private _eventsMinDistance: number = 180;

  @Input()
  set eventsMinDistance(value: number) {
    this._eventsMinDistance = value;
    // this.initView();
  }

  private _timelineElements: TimelineElement[];

  get timelineElements(): TimelineElement[] {
    return this._timelineElements;
  }

  @Input()
  set timelineElements(value: TimelineElement[]) {
    this._timelineElements = value;
    // this.initView();
  }

  private _dateFormat: string = 'dd.MM.yyyy';
  private _dateFormatTop: string = 'dd MMM';

  get dateFormat(): string {
    return this._dateFormat;
  }

  get dateFormatTop(): string {
    return this._dateFormatTop;
  }

  @Input()
  set dateFormat(value: string) {
    this._dateFormat = value;
    // this.initView();
  }

  @Input()
  set dateFormatTop(value: string) {
    this._dateFormatTop = value;
    // this.initView();
  }

  private _showContent: boolean = false;

  get showContent(): boolean {
    return this._showContent;
  }

  @Input()
  set showContent(value: boolean) {
    this._showContent = value;
    // this._cdr.detectChanges();
  }

  private static pxToNumber(val: string): number {
    return Number(val.replace('px', ''));
  }

  private static getElementWidth(element: Element): number {
    const computedStyle = window.getComputedStyle(element);
    if (!computedStyle.width) {
      return 0;
    }
    return HorizontalTimelineComponent.pxToNumber(computedStyle.width);
  }

  private static parentElement(element: any, tagName: string) {
    if (!element || !element.parentNode) {
      return null;
    }

    let parent = element.parentNode;
    while (true) {
      if (parent.tagName.toLowerCase() == tagName) {
        return parent;
      }
      parent = parent.parentNode;
      if (!parent) {
        return null;
      }
    }
  }

  private static getTranslateValue(timeline: Element) {
    let timelineStyle = window.getComputedStyle(timeline);
    let timelineTranslate = timelineStyle.getPropertyValue('-webkit-transform') ||
      timelineStyle.getPropertyValue('-moz-transform') ||
      timelineStyle.getPropertyValue('-ms-transform') ||
      timelineStyle.getPropertyValue('-o-transform') ||
      timelineStyle.getPropertyValue('transform');

    let translateValue = 0;
    if (timelineTranslate.indexOf('(') >= 0) {
      let timelineTranslateStr = timelineTranslate
        .split('(')[1]
        .split(')')[0]
        .split(',')[4];
      translateValue = Number(timelineTranslateStr);
    }

    return translateValue;
  }

  private static setTransformValue(element: any, property: any, value: any) {
    element.style['-webkit-transform'] = property + '(' + value + ')';
    element.style['-moz-transform'] = property + '(' + value + ')';
    element.style['-ms-transform'] = property + '(' + value + ')';
    element.style['-o-transform'] = property + '(' + value + ')';
    element.style['transform'] = property + '(' + value + ')';
  }

  private static dayDiff(first: Date, second: Date): number {
    return Math.round(second.getTime() - first.getTime());
  }

  private static minLapse(elements: TimelineElement[]): number {
    if (elements && elements.length && elements.length === 1) {
      return 0;
    }

    let result: number = 0;
    for (let i = 1; i < elements.length; i++) {
      let distance = HorizontalTimelineComponent.dayDiff(elements[i - 1].date, elements[i].date);
      result = result ? Math.min(result, distance) : distance;
    }
    return result;
  }

  user = new User();
  is_superuser: boolean;
  is_coach: boolean;
  is_team_member: boolean;
  course: Deliverable = this.newCourse();
  courses: Deliverable[];
  current_page: number = 0;
  teamdeliverable: TeamDeliverable;
  teamDeliverables: TeamDeliverable[];
  link: HelpLink;
  allLinks: HelpLink[];
  newLinks: HelpLink[] = [];
  oldLinks: HelpLink[] = [];
  editedLink: HelpLink[] = [];
  deletedLink: HelpLink[] = [];
  editMaterialFlag: boolean = false;
  templates: any[];
  template: any = '';
  isStart: boolean = true;
  duration: number = 0;
  date: Date;
  today: number = Date.now();
  updatedTemplate: boolean = false;
  templatePath: string = '';
  templateName: string = '';
  lastSelectedItem: number;
  files: any[];
  file: any;
  teams: Team[];
  teamDeliverablesForCoach: any[] = [];
  prevLinkInactive: boolean = true;
  nextLinkInactive: boolean = false;
  loaded: boolean = false;
  selectedIndex: number = 0;

  ngOnInit() {
    console.log(this.timelineElements);
    this.user = JSON.parse(localStorage.getItem('user'));
    console.log(this.user);
    this.is_superuser = this.user.is_superuser;
    if (this.is_superuser) {
      this.is_team_member = false;
      this.is_coach = false;
    } else {
      this.is_team_member = this.user.profile.is_team_member;
      this.is_coach = this.user.profile.is_coach;
    }
    this.course = this.newCourse();
    console.log(this.course)
    this.link = this.initLink();
    this.getLinks();
    this.getTeams();
    this.getTeamDeliverables();
  }

  getTeamDeliverables() {
    this.teamdeliverableService.getAllTeamDeliverables()
      .subscribe(teamDeliverables => {
        this.teamDeliverables = teamDeliverables;
      });
  }

  getTeams() {
    this.teamService.getTeams()
      .subscribe(teams => this.teams = teams);
  }

  initLink(): HelpLink {
    var newLink = new HelpLink();
    newLink.id = null;
    newLink.link = '';
    newLink.course_id = null;
    return newLink;
  }

  newCourse(): Deliverable {
    var deliverable = new Deliverable();
    deliverable.title = '';
    deliverable.description = '';
    deliverable.pipeline = '';
    deliverable.icon = '';
    deliverable.template = '';
    deliverable.release_date = '';
    deliverable.deadline = 0;
    return deliverable;
  }

  onSubmit() {
    this.course.title = this.timelineElements[this.selectedIndex].title;
    if (this.updatedTemplate) {
      this.course.template = this.template;
    } else {
      delete this.course.template;
    }
    if (!this.course.release_date) {
      this.course.release_date = this.datePipe.transform(new Date(this.today), 'yyyy-MM-dd'); 
    }
    if (!this.course.deadline) {
      alert("Input deadline!")
    } else {
      if (this.course.id) {
        this.deliverableService.editDeliverable(this.course)
          .subscribe(course => {
            if (course) {
              this.timelineElements[this.selectedIndex].content[0] = course;
              if (course.template) {
                this.timelineElements[this.selectedIndex].content[0].template = course.template;
              }
              this.getTemplatePahtAndName();
              for (let i = 0; i < this.newLinks.length; i++) {
                this.deliverableService.addDeliverableLink(this.newLinks[i])
                  .subscribe();
              }
              for (let i = 0; i < this.editedLink.length; i++) {
                this.deliverableService.updateDeliverableLink(this.editedLink[i])
                  .subscribe();
              }
              for (let i = 0; i < this.deletedLink.length; i++) {
                this.deliverableService.deleteDeliverableLink(this.deletedLink[i])
                  .subscribe();
              }
              for (let i = 0; i < this.teamDeliverables.length; i++) {
                for (let j = 0; j < this.teams.length; j++) {
                  if (this.teamDeliverables[i].team.id == this.teams[j].id && this.teamDeliverables[i].deliverable.id == course.id && this.teams[j].login_date_1st) {
                    let teamDeliverableDeadline = this.getTeamDeliverableDeadline(course.deadline, this.teams[j].login_date_1st);
                    let updateTeamDeliverable = new TeamDeliverable();
                    updateTeamDeliverable.id = this.teamDeliverables[i].id;
                    updateTeamDeliverable.deadline = teamDeliverableDeadline;
                    updateTeamDeliverable.team = this.teamDeliverables[i].team.id;
                    updateTeamDeliverable.deliverable = this.teamDeliverables[i].deliverable.id;
                    this.teamdeliverableService.updateTeamDeliverableWithoutFile(updateTeamDeliverable)
                      .subscribe();
                  }
                }
              }
              alert('The data saved correctly!')
              this.editedLink = [];
              this.newLinks = [];
              this.deletedLink = [];
            }
          });
      } else {
        if (this.course.deadline) {
          this.deliverableService.addDeliverable(this.course)
            .subscribe(course => {
              this.timelineElements[this.selectedIndex].content[0] = course;
              if (course.template) {
                this.timelineElements[this.selectedIndex].content[0].template = course.template;
              }
              this.getTemplatePahtAndName();
              if (course) {
                for (let i = 0; i < this.newLinks.length; i++) {
                  this.newLinks[i].course_id = course.id;
                  this.deliverableService.addDeliverableLink(this.newLinks[i])
                    .subscribe();
                }
                for (let i = 0; i < this.editedLink.length; i++) {
                  this.editedLink[i].course_id = course.id;
                  this.deliverableService.updateDeliverableLink(this.editedLink[i])
                    .subscribe();
                }
                for (let i = 0; i < this.deletedLink.length; i++) {
                  this.editedLink[i].course_id = course.id;
                  this.deliverableService.deleteDeliverableLink(this.deletedLink[i])
                    .subscribe();
                }
                alert('The data saved correctly!');
                this.editedLink = [];
                this.newLinks = [];
                this.deletedLink = [];
              }
            });
        } else {
          alert('Set the Deadline for this course!')
        }
      }
    }
    
    
    document.getElementById('step_btn_' + this.selectedIndex).click();
    this.updatedTemplate = false;
  }

  cancel_material() {
    this.editMaterialFlag = false;
    this.link = this.initLink();
    (<HTMLInputElement>document.getElementById('newLink' + this.selectedIndex)).value = '';
  }

  new_material(courseId) {
    // insert newLink to course.links
    if (this.link.link && !this.editMaterialFlag) { //new
      this.link.course_id = courseId;
      let existNewLink = false;
      for (let i = 0; i < this.allLinks.length; i++ ) {
        if (this.allLinks[i].link == this.link.link && this.allLinks[i].course_id == this.link.course_id ) {
          existNewLink = true;
        }
      }
      if (!existNewLink) {
        this.newLinks.push(this.link);  
        this.oldLinks.push(this.link);
        this.allLinks.push(this.link);
      }
    } else {  //eidt
      if (this.link.id) {
        this.editedLink.push(this.link);
      }
    }
    document.getElementById('step_btn_' + this.selectedIndex).click();
    this.cancel_material();
  }

  edit_material(link: HelpLink) {
    this.editMaterialFlag = true;
    this.link = link;
    if (link.id) { // oldLink

    } else {  // newLink

    }
    document.getElementById('step_btn_' + this.selectedIndex).click();
  }

  del_material(link: HelpLink) {
    if (link.id) { // oldLink
      this.removeObjectFromArray(this.allLinks, link);
      this.deletedLink.push(link);
    } else { // newLink
      this.removeObjectFromArray(this.newLinks, link);
      this.removeObjectFromArray(this.allLinks, link);
    }
    document.getElementById('step_btn_' + this.selectedIndex).click();
  }

  handleInputChange(e) {
    this.templates = e.target.templates;
    var template = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var reader = new FileReader();
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(template);
  }

  _handleReaderLoaded(e) {
    let reader = e.target;
    this.template = reader.result;
    this.updatedTemplate = true;
  }

  teamDeliverableHandleInputChange(e) {
    this.files = e.target.files;
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var reader = new FileReader();
    reader.onload = this._teamDeliverablehandleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _teamDeliverablehandleReaderLoaded(e) {
    let reader = e.target;
    this.file = reader.result;
    console.log(this.file)
  }


  save(): void {
    let validFile = true;
    let delivId = this.teamdeliverable.deliverable.id;
    this.teamdeliverable.deliverable = delivId;
    this.teamdeliverable.file = this.file
    console.log(this.file);
    this.teamdeliverable.status = true;
    this.teamdeliverableService.updateTeamDeliverable(this.teamdeliverable)
      .subscribe(teamdel => {
        if (teamdel) {
          this.teamdeliverable = teamdel;
        } else {
          validFile = false;
        }
      });
    if (!validFile) {
      this.teamdeliverable.file = null
      this.teamdeliverable.status = false;
    }
    this.clear();
  }

  clear() {
    this.files = [];
    this.ngOnInit();
  }

  getLinks() {
    this.deliverableService.getDeliverableLinks()
      .subscribe(links => {
        this.allLinks = links;
      });
  }

  getCourseLinks(course_id) {
      let temp = [];
      for (let i = 0; i < this.allLinks.length; i++) {
        if (this.allLinks[i].course_id == course_id) {
          temp.push(this.allLinks[i]);
        }
      }
      this.oldLinks = temp;
      if (this.isStart) {
        document.getElementById('step_btn_' + this.selectedIndex).click();
        this.isStart = false;
      }
  }

  removeObjectFromArray(myArray, myObject) {
    for (var n = 0; n < myArray.length; n++) {
      if (myArray[n].link == myObject.link) {
        var removedObject = myArray.splice(n, 1);
        removedObject = null;
        break;
      }
    }
  }

  ngAfterViewInit() {
    this._cdr.detach();
    this._viewInitialized = true;
    setTimeout(() => {
      this.initView();
    }, 1000);

  }

  onEventClick(event: Event, selectedItem: TimelineElement) {
    // document.getElementById('course-save').removeAttribute("disabled")
    event.preventDefault();
    let element = event.target;
    // detect click on the a single event - show new event content
    let visibleItem = this._timelineElements[0];
    this._timelineElements.forEach(function (item: TimelineElement) {
      if (item.selected && item != selectedItem) {
        visibleItem = item;
        item.selected = false;
      }
    });
    this.selectedIndex = this._timelineElements.indexOf(selectedItem);
    this.course = this.timelineElements[this.selectedIndex]['content'][0];
    this.getTemplatePahtAndName();
    this.getCourseLinks(this.course.id);
    selectedItem.selected = true;
    this.updateFilling(element);
    this._cdr.detectChanges();
  }

  initTimeline(timeLines: TimelineElement[]) {
    let eventsMinLapse = HorizontalTimelineComponent.minLapse(timeLines);
    // assign a left position to the single events along the timeline
    this.setDatePosition(timeLines, this._eventsMinDistance, eventsMinLapse);
    // assign a width to the timeline
    this.setTimelineWidth(timeLines, this._eventsMinDistance, eventsMinLapse);
    // the timeline has been initialize - show it
    this.loaded = true;
  }

  updateTimelinePosition(element: Element) {
    let eventStyle = window.getComputedStyle(element);
    let eventLeft = HorizontalTimelineComponent.pxToNumber(eventStyle.getPropertyValue('left'));
    let translateValue = HorizontalTimelineComponent.getTranslateValue(this.eventsWrapper.nativeElement);

    if (eventLeft > this._timelineWrapperWidth - translateValue) {
      this.translateTimeline(-eventLeft + this._timelineWrapperWidth / 2, this._timelineWrapperWidth - this.eventsWrapperWidth);
    }
  }

  translateTimeline(value: number, totWidth: number | null) {
    // only negative translate value
    value = (value > 0) ? 0 : value;
    // do not translate more than timeline width
    value = (!(totWidth === null) && value < totWidth) ? totWidth : value;
    HorizontalTimelineComponent.setTransformValue(this.eventsWrapper.nativeElement, 'translateX', value + 'px');
    // update navigation arrows visibility
    // this.prevLinkInactive = value === 0;
    // this.nextLinkInactive = value === totWidth;
  }

  setTimelineWidth(elements: TimelineElement[], width: number, eventsMinLapse: number) {
    let timeSpan = 100;
    if (elements.length > 1) {
      timeSpan = HorizontalTimelineComponent.dayDiff(elements[0].date, elements[elements.length - 1].date);
    }
    let timeSpanNorm = timeSpan / eventsMinLapse;
    timeSpanNorm = Math.round(timeSpanNorm) + 4;
    this.eventsWrapperWidth = timeSpanNorm * width;
    let aHref = this.eventsWrapper.nativeElement.querySelectorAll('a.selected')[0];
    this.updateFilling(aHref);
    this.updateTimelinePosition(aHref);
    return this.eventsWrapperWidth;

  }

  private updateFilling(element: any) {
    // change .filling-line length according to the selected event
    let eventStyle = window.getComputedStyle(element);
    let eventLeft = eventStyle.getPropertyValue('left');
    let eventWidth = eventStyle.getPropertyValue('width');
    let eventLeftNum = HorizontalTimelineComponent.pxToNumber(eventLeft) + HorizontalTimelineComponent.pxToNumber(eventWidth) / 2;
    let scaleValue = eventLeftNum / this.eventsWrapperWidth;
    HorizontalTimelineComponent.setTransformValue(this.fillingLine.nativeElement, 'scaleX', scaleValue);
  }

  private initView(): void {
    if (!this._viewInitialized) {
      return;
    }

    if (this._timelineElements && this._timelineElements.length) {
      for (let i = 0; i < this._timelineElements.length; i++) {
        if (this._timelineElements[i].selected) {
          this.selectedIndex = i;
          console.log(this.timelineElements[i]);
          this.course = this.timelineElements[i]['content'][0];
          console.log(this.course);
          this.getTemplatePahtAndName();
          this.getCourseLinks(this.course.id);
          break;
        }
        break;
      }
      this.initTimeline(this._timelineElements);
    }

    this._cdr.detectChanges();
  }

  private setDatePosition(elements: TimelineElement[], min: number, eventsMinLapse: number) {
    let timelineEventsArray = this.timelineEvents.toArray();
    let i: number = 0;
    for (let component of elements) {
      let distance = HorizontalTimelineComponent.dayDiff(elements[0].date, component.date);
      let distanceNorm = Math.round(distance / eventsMinLapse);
      timelineEventsArray[i].nativeElement.style.left = distanceNorm * min + 'px';
      // span
      let span: HTMLSpanElement = <HTMLSpanElement>timelineEventsArray[i].nativeElement.parentElement.children[1];
      let spanWidth = HorizontalTimelineComponent.getElementWidth(span);
      span.style.left = distanceNorm * min + spanWidth / 2 + 'px';
      i++;
    }
  }
  
  // getTimeDifferenceFromDate(arg1: any, arg2: any) {
  //   var realese = new Date(this.datePipe.transform(arg2, 'yyyy-MM-dd'));
  //   var deadline = new Date(this.datePipe.transform(arg1, 'yyyy-MM-dd'))
  //   var difference_In_Time = realese.getTime() - deadline.getTime();
  //   var difference_In_Days = difference_In_Time / (1000 * 3600 * 24);
  //   return Math.abs(difference_In_Days);
  // }

  getTeamDeliverableDeadline(arg1: any, arg2: any) {
    var deliverableDeadline = new Date(this.datePipe.transform(arg2, 'yyyy-MM-dd'));
    var difference_In_Days = arg1 * 1000 * 3600 * 24;
    var difference_In_Time = new Date(deliverableDeadline.getTime() + difference_In_Days);
    var teamDeliverableDeadline = this.datePipe.transform(difference_In_Time, 'yyyy-MM-dd');

    return teamDeliverableDeadline;
  }

  getTemplatePahtAndName() {
    if (this.course.template) {
      this.templatePath = this.course.template;
      this.templateName = this.course.template.split('/deliverables/')[1];
    } else {
      this.templatePath = '';
      this.templateName = '';
    }

  };
}
