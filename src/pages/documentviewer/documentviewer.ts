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

    userViewDocData: any;

    userSystemData = {"id":"","password":"","sysuserid":"","currentproject":"","apiKey":""}; 

    ionViewWillEnter() {

    }

    constructor(public platform: Platform, 
                public params: NavParams, 
                public http: Http, 
                private sanitizer: DomSanitizer, 
                public modalCtrl: ModalController, 
                public viewCtrl: ViewController
              ) {


        this.userSystemData.id             = localStorage.getItem('login_id');
        this.userSystemData.password       = localStorage.getItem('login_password');
        this.userSystemData.currentproject = localStorage.getItem('CurrentProjectID');

        var userData = JSON.parse(localStorage.getItem('userSystemData'));
        this.userSystemData.sysuserid  = userData[0].SystemUserID;
        this.userSystemData.apiKey    = userData[0].apiKey;


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

        //console.log(url);



    this.http.get(url).map(res => res.json()).subscribe(data => {
          this.sanitizer.bypassSecurityTrustStyle(data);
          this.viewdoc = data;          
          console.log("ViewerURL="+this.viewdoc);
        },
        err => {
            console.log("File not available.");
        }
    );


    this.http.get(Constants.apiUrl+'api/writeaudit/'+this.userSystemData.apiKey+'/'+this.userSystemData.sysuserid+'/'+this.userSystemData.currentproject+'/'+this.docid+'/'+'91'+'/'+'Mobile+-+Viewed+Drawing').map(res => res.json()).subscribe(data => {
          this.userViewDocData = data;
          console.log(this.userViewDocData);
      },
      err => {
          //console.log("Oops!");
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