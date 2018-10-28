import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IonicPage, ModalController,  NavController, Platform, NavParams, ViewController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as Constants from '../../providers/constants';


import { DocumentViewer } from '../documentviewer/documentviewer';
import { DocumentAudit } from '../documentaudit/documentaudit';
import { AboutPage } from '../about/about';

import * as Constants from '../../providers/constants';

//@IonicPage()

@Component({selector: 'page-documentinfo', templateUrl: 'documentinfo.html'})

export class DocumentInfo {

  docimg: any;
  docid: any;
  docno1: any;
  userdocumentsinfo: any;
  userApiKey : any;
  avatardata: any;


  userdocumentInfoData = {
    "SystemUserID": "",
    "apiKey":"",
    "SystemProjectID":"",
    "Thumbnail":"",
    "DocumentNumber":""
  };


  constructor(
              public navCtrl: NavController,
              public platform: Platform, 
              public params: NavParams, 
              public http: Http, 
              private _sanitizer: DomSanitizer, 
              public modalCtrl: ModalController, 
              public viewCtrl: ViewController
    ) 
  {

    var docimg="";
    this.docimg = this.params.get('docimg');
    console.log(this.docimg);

    var docid="";
    this.docid = this.params.get('docid');
    console.log(this.docid);

    var docno1="";
    this.docno1 = this.params.get('docno1');
    console.log(this.docno1);

    const documentData = JSON.parse(localStorage.getItem('userSystemData'));

    this.userdocumentInfoData.SystemUserID    = documentData[0].SystemUserID;
    this.userdocumentInfoData.apiKey          = documentData[0].apiKey;
    this.userdocumentInfoData.SystemProjectID = localStorage.getItem('CurrentProjectID');    
    this.userdocumentInfoData.Thumbnail       = documentData[0].PhotoTiny;
    this.userdocumentInfoData.DocumentNumber  = documentData[0].DocumentNumber;

    this.avatardata     = localStorage.getItem('avatar');
     console.log("Documents Avatar = "+this.avatardata);

    var documentApiKey          = this.userdocumentInfoData.apiKey;  
    var documentSystemUserID    = this.userdocumentInfoData.SystemUserID;
    var documentSystemProjectID = this.userdocumentInfoData.SystemProjectID; 
    var documentThumbnail       = this.userdocumentInfoData.Thumbnail;
    var documentDocumentNumber  = this.userdocumentInfoData.DocumentNumber;

    var url = Constants.apiUrl+"api/documents/xxx/"+this.userdocumentInfoData.SystemUserID+"/"+this.userdocumentInfoData.SystemProjectID+"/docno"+this.docno1;
    
        this.http.get(url).map(res => res.json()).subscribe(data => {
              this._sanitizer.bypassSecurityTrustStyle(data);
              this.userdocumentsinfo = data;          
              console.log(this.userdocumentsinfo);
          },
          err => {
              console.log("Document info not found.");
          }
        ); 
  }

  openDocument(clientid,projectid,docid,ext){ 
    this.navCtrl.push(DocumentViewer,{clientid,projectid,docid,ext});
  }


  openDocumentAudit(docimg, docid, docno1){ 
    this.navCtrl.push(DocumentAudit,{docimg, docid, docno1});
  }

  openDocumentSend(docimg, docid, docno1){ 
    this.navCtrl.push(AboutPage,{docimg, docid, docno1});
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }  

}
                                                  