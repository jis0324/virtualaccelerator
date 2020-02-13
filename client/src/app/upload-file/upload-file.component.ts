import { Component, OnInit } from '@angular/core';

import { UploadFileService }  from '../upload-file.service';
import { ActivatedRoute } from '@angular/router';

import { File } from '../file';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {

  files: any[];
  file: string = '';

  constructor(
    private route: ActivatedRoute,
    private uploadFileService: UploadFileService,
  ) { }

  ngOnInit() {
  }


  handleInputChange(e) {
    this.files = e.target.files;
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var reader = new FileReader();
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e) {
    let reader = e.target;
    this.file = reader.result;
    console.log(this.file)
  }

    save(): void {
      let f = new File();
      f.file = this.file
      this.uploadFileService.addFile(f)
        .subscribe( file => this.file = file);
      this.clear();
    }

    clear() {
      this.files = [];
      this.ngOnInit();
    }

}
