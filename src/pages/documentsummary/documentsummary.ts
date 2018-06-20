import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController, Platform, NavParams, ViewController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as Constants from '../../providers/constants';

@Component({templateUrl: 'documentsummary.html'})

export class DocumentSummary {

  docdays: any;
  userdocumentssummary: any;

  userdocumentInfoData = {
    "SystemUserID": "",
    "apiKey":"",
    "SystemProjectID":"",
    "Thumbnail":"",
    "DocumentNumber":""
  };

  constructor(public platform: Platform, public params: NavParams, public http: Http, private _sanitizer: DomSanitizer, public modalCtrl: ModalController, public viewCtrl: ViewController) {

    var docdays="";
    this.docdays = this.params.get('docdays');
    console.log(this.docdays);

    const documentData = JSON.parse(localStorage.getItem('userSystemData'));

    this.userdocumentInfoData.SystemUserID    = documentData[0].SystemUserID;
    this.userdocumentInfoData.apiKey          = documentData[0].apiKey;
    this.userdocumentInfoData.SystemProjectID = localStorage.getItem('CurrentProjectID');    
    this.userdocumentInfoData.Thumbnail       = documentData[0].PhotoTiny;
    this.userdocumentInfoData.DocumentNumber  = documentData[0].DocumentNumber;

    var documentApiKey          = this.userdocumentInfoData.apiKey;  
    var documentSystemUserID    = this.userdocumentInfoData.SystemUserID;
    var documentSystemProjectID = this.userdocumentInfoData.SystemProjectID; 
    var documentThumbnail       = this.userdocumentInfoData.Thumbnail;
    var documentDocumentNumber  = this.userdocumentInfoData.DocumentNumber;

    var url = Constants.apiUrl+"api/summary/"+documentApiKey+"/"+documentSystemUserID+"/"+documentSystemProjectID+"/"+this.docdays;
    
        this.http.get(url).map(res => res.json()).subscribe(data => {
              this._sanitizer.bypassSecurityTrustStyle(data);
              this.userdocumentssummary = data;          
              console.log(this.userdocumentssummary);
          },
          err => {
              console.log("Document info not found.");
          }
        ); 

  }


  dismiss() {
    this.viewCtrl.dismiss();
  }  

}
                                                  