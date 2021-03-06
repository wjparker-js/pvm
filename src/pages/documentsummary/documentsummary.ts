import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController, Platform, NavController, NavParams, ViewController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as Constants from '../../providers/constants';
import { DocumentViewer } from '../documentviewer/documentviewer';

@Component({selector: 'page-documentsummary', templateUrl: 'documentsummary.html'})

export class DocumentSummary {

  docdays: any;
  userdocumentssummary: any;
  avatardata: any;

  userdocumentInfoData = {
    "SystemUserID": "",
    "SystemClientID": "",
    "apiKey":"",
    "SystemProjectID":"",
    "Thumbnail":"",
    "DocumentNumber":""
  };

  constructor(public navCtrl: NavController,public platform: Platform, public params: NavParams, public http: Http, private _sanitizer: DomSanitizer, public modalCtrl: ModalController, public viewCtrl: ViewController) {

    this.docdays = this.params.get('days');

    const documentData = JSON.parse(localStorage.getItem('userSystemData'));

    this.userdocumentInfoData.SystemUserID    = documentData[0].SystemUserID;  
    this.userdocumentInfoData.SystemUserID    = this.userdocumentInfoData.SystemUserID.trim();  
    this.userdocumentInfoData.SystemClientID  = documentData[0].SystemClientID;
    this.userdocumentInfoData.apiKey          = documentData[0].apiKey;
    this.userdocumentInfoData.SystemProjectID = localStorage.getItem('CurrentProjectID');    
    this.userdocumentInfoData.Thumbnail       = documentData[0].PhotoTiny;
    this.userdocumentInfoData.DocumentNumber  = documentData[0].DocumentNumber;
    this.avatardata                           = localStorage.getItem('avatar');

    var url = Constants.apiUrl+"api/documentsummary/"+this.userdocumentInfoData.apiKey+"/"+this.userdocumentInfoData.SystemUserID+"/"+this.userdocumentInfoData.SystemProjectID+"/"+this.docdays;
    
        this.http.get(url).map(res => res.json()).subscribe(data => {
              this._sanitizer.bypassSecurityTrustStyle(data);
              this.userdocumentssummary = data;         
          },
          err => {
              console.log("Document info not found.");
          }
        ); 

  }

  keys(obj){
    return Object.keys(obj);
  }  

  openDocuments(clientid,projectid,docid,ext){
    this.navCtrl.push(DocumentViewer,{clientid,projectid,docid,ext});
  }


  dismiss() {
    this.viewCtrl.dismiss();
  }  

}
                                                  