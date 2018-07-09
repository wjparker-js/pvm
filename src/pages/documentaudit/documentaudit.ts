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

  constructor(public platform: Platform, public params: NavParams, public http: Http, private _sanitizer: DomSanitizer, public modalCtrl: ModalController, public viewCtrl: ViewController) {

    var docimg="";
    this.docimg = this.params.get('docimg');
    console.log("Img: %s",this.docimg);

    var docid="";
    this.docid = this.params.get('docid');
    console.log("DId: %s",this.docid);

    var docno1="";
    this.docno1 = this.params.get('docno1');
    console.log("DNo: %s",this.docno1);

    const documentData = JSON.parse(localStorage.getItem('userSystemData'));

    this.userdocumentInfoData.SystemClientID  = documentData[0].SystemClientID;
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
    var documentSystemClientID  = this.userdocumentInfoData.SystemClientID;    
    var documentThumbnail       = this.userdocumentInfoData.Thumbnail;
    var documentDocumentNumber  = this.userdocumentInfoData.DocumentNumber;

    var url = Constants.apiUrl+"api/documentaudit/"+this.userdocumentInfoData.SystemUserID+"/"+this.userdocumentInfoData.SystemProjectID+"/"+this.docid+"/"+this.userdocumentInfoData.SystemClientID;
    
    console.log("URL: %s",url);

        this.http.get(url).map(res => res.json()).subscribe(data => {
              this._sanitizer.bypassSecurityTrustStyle(data);
              this.userdocumentaudit = data;          
              console.log(this.userdocumentaudit);
          },
          err => {
              console.log("Oops!");
          }
        ); 

  }


  dismiss() {
    this.viewCtrl.dismiss();
  }  

}
                                                  