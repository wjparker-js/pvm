import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController, Platform, NavParams, ViewController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as Constants from '../../providers/constants';

@Component({selector: 'page-documentviewer', templateUrl: 'documentviewer.html'})

export class DocumentViewer {

    id;
    docno;
    pdfUrl;
    clientid;
    projectid;
    docid;
    ext;
    pdfLink:any;
    viewdoc;
    fileUrl;

    constructor(public platform: Platform, 
                public params: NavParams, 
                public http: Http, 
                private sanitizer: DomSanitizer, 
                public modalCtrl: ModalController, 
                public viewCtrl: ViewController
              ) {

        var clientid="";
        this.clientid = this.params.get('clientid');
        var projectid="";
        this.projectid = this.params.get('projectid');
        var docid="";
        this.docid = this.params.get('docid');
        var ext="";
        this.ext = this.params.get('ext');

        var url = Constants.apiUrl+"api/documentview/"+this.clientid+"/"+this.projectid+"/"+this.docid+"/"+this.ext;
        var url = url.toLowerCase();

        console.log(url);

        this.http.get(url).map(res => res.json()).subscribe(data => {
              this.sanitizer.bypassSecurityTrustStyle(data);
              this.viewdoc = data;          
              console.log("ViewerURL="+this.viewdoc);
        },
        err => {
            console.log("File not available.");
        }
    );
    
    this.sleep(2000);
  
    this.fileUrl = Constants.fileUrl+this.docid+this.ext;

    console.log(this.fileUrl);
    
    this.pdfLink = this.sanitizer.bypassSecurityTrustResourceUrl(this.fileUrl);     

  }


  sleep(miliseconds) {
    var currentTime = new Date().getTime();
 
    while (currentTime + miliseconds >= new Date().getTime()) {
    }
  }  

  dismiss() {
    this.viewCtrl.dismiss();
  }
}