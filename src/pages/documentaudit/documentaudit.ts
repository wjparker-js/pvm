import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController, Platform, NavParams, ViewController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as Constants from '../../providers/constants';

@Component({selector: 'page-documentaudit', templateUrl: 'documentaudit.html'})

export class DocumentAudit {

  docimg: any;
  docid: any;
  docno1: any;
  auditdocs: any;
  callback: any;
  userdocumentaudit: any;
  userApiKey : any;
  avatardata: any;
  
  userdocumentInfoData = {
    "SystemClientID":"",
    "SystemUserID": "",
    "apiKey":"",
    "SystemProjectID":"",
    "Thumbnail":"",
    "DocumentNumber":""
  };

  constructor(
    public platform: Platform, 
    public params: NavParams, 
    public http: Http, 
    private _sanitizer: DomSanitizer, 
    public modalCtrl: ModalController, 
    public viewCtrl: ViewController) {
      
    const documentData = JSON.parse(localStorage.getItem('userSystemData'));

    this.auditdocs                            = true;
    this.docimg                               = this.params.get('docimg');
    this.docid                                = this.params.get('docid');
    this.docno1                               = this.params.get('docno1');
    this.userdocumentInfoData.SystemClientID  = documentData[0].SystemClientID;
    this.userdocumentInfoData.SystemUserID    = documentData[0].SystemUserID;
    this.userdocumentInfoData.SystemUserID    = this.userdocumentInfoData.SystemUserID.trim();
    this.userdocumentInfoData.apiKey          = documentData[0].apiKey;
    this.userdocumentInfoData.SystemProjectID = localStorage.getItem('CurrentProjectID');    
    this.userdocumentInfoData.Thumbnail       = documentData[0].PhotoTiny;
    this.userdocumentInfoData.DocumentNumber  = documentData[0].DocumentNumber;
    this.avatardata                           = localStorage.getItem('avatar');

    var url = Constants.apiUrl+"api/documentaudit/"+this.userdocumentInfoData.SystemUserID+"/"+this.userdocumentInfoData.SystemProjectID+"/"+this.docid+"/"+this.userdocumentInfoData.SystemClientID;
    
    this.http.get(url).map(res => res.json()).subscribe(data => {
          this._sanitizer.bypassSecurityTrustStyle(data);
          this.userdocumentaudit = data;          
          console.log(this.userdocumentaudit);
      },
      err => {console.log("Oops!");
      }
    ); 
  }

  dismiss() {
    this.viewCtrl.dismiss();
  } 

}
                                                  