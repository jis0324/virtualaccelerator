import { Component, OnInit } from '@angular/core';
import { Deliverable } from '../deliverable';
import {DeliverableService} from '../deliverable.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-deliverable',
  templateUrl: './deliverable.component.html',
  styleUrls: ['./deliverable.component.css']
})
export class DeliverableComponent implements OnInit {
  deliverables : Deliverable[];
  closeResult: string;
  url: string;
  deliverable : Deliverable;
  templates: any[];
  template: any;
  message: string;

  constructor(private deliverableService: DeliverableService, private modalService: NgbModal,) { }

   ngOnInit() {
     this.getDeliverables();
     this.deliverable = this.newDeliverable();
   }

   getDeliverables(): void {
     this.deliverableService.getDeliverables()
      .subscribe(deliverables => this.deliverables = deliverables);
   }

   newDeliverable() : Deliverable {
     var deliverable = new Deliverable();
     deliverable.title = '';
     deliverable.description = '';
     deliverable.pipeline = '';
     deliverable.icon = '';
     deliverable.release_date = '';
     deliverable.deadline = 0;
     return deliverable;
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
     console.log(this.template)
   }

   onSubmit() : void {
     this.deliverable.template = this.template;
     this.deliverableService.addDeliverable(this.deliverable)
       .subscribe(deliverable => {
         if (deliverable) {
           this.deliverables.unshift(deliverable);
           this.deliverable = this.newDeliverable();
         }
       });
   }

     delete(deliverable: Deliverable): void {
       this.deliverables = this.deliverables.filter(h => h !== deliverable);
       this.deliverableService.deleteDeliverable(deliverable).subscribe();
     }


   // Modal method
     open(content) {
       this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
         this.closeResult = `Closed with: ${result}`;
       }, (reason) => {
         this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
       });
     }

   // Modal method
     private getDismissReason(reason: any): string {
       if (reason === ModalDismissReasons.ESC) {
         return 'by pressing ESC';
       } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
         return 'by clicking on a backdrop';
       } else {
         return  `with: ${reason}`;
       }
     }



}
