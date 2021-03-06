import { Component, OnInit } from '@angular/core';

import {HttpClient, HttpEventType} from "@angular/common/http";
import {AdUnit} from "../index/AdUnit";
import {AppComponent} from "../../app.component";
import {ActivatedRoute, Router} from "@angular/router";
import {AdunitService} from "../../adunit.service";



@Component({
  selector: 'app-upload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['../../../assets/css/style.css']
})
export class FileUploadComponent implements OnInit {

  adunits: AdUnit[];
  message:string;
  title = 'ng8fileuploadexample';
  uploadedFilePath: string = null;
  previewUrl:any = null;
  fileData: File = null;
  url = 'http://192.168.0.4:5000/fu/upload';

  fileUploadProgress: any;
  id:number;
  constructor(
    private app: AppComponent,
    private route: ActivatedRoute,
    private data: AdunitService,
    private router: Router,
    private adunitservice: AdunitService,
  private http: HttpClient
  ) {

  }


  fileProgress(fileInput: any) {
    this.fileUploadProgress='0%';
    this.fileData = <File>fileInput.target.files[0];
    this.preview();
  }

  onSubmit() {

   const formData = new FormData();
    formData.append('dosya', this.fileData);

    this.fileUploadProgress = '0%';

    this.http.post('http://192.168.0.4:5000/fu/upload', formData, {
      reportProgress: true,
      observe: 'events'
    })
      .subscribe(events => {
        if(events.type === HttpEventType.UploadProgress) {
          this.fileUploadProgress = Math.round(events.loaded / events.total * 100) + '%';
          console.log(this.fileUploadProgress);
        } else if(events.type === HttpEventType.Response) {
          //this.fileUploadProgress = '';
          console.log(events.body);
        //  alert('SUCCESS !!');
        }

      })
  }
  preview() {
    // Show preview

    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return this.fileUploadProgress='except of image file is not valid';
    } else {
      console.log('done!')
    }

    var reader = new FileReader();

    reader.readAsDataURL(this.fileData);

    reader.onload = (_event) => {
      this.previewUrl = reader.result;
    }
  }
  ngOnInit() {
    this.adunitservice.isLogin(this.app);
    //let response=this.adunitservice.apiChippers('sinek','VyRghZo5CmTU4uIocL4G');
    //console.log(response);
    this.adunitservice
      .indexAdUnits()
      .subscribe((data: AdUnit[]) => {
        console.log('index function çalışacak servise gidiyor');
        this.adunits = data;
      });
    this.data.currentMessage.subscribe(message => this.message = message)
  }

}
