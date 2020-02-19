import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IonicPage, ModalController, Platform, NavController, NavParams, ViewController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { DocumentViewer } from '../documentviewer/documentviewer';
import * as Constants from '../../providers/constants';

@IonicPage()

@Component({selector: 'page-documentinfo', templateUrl: 'documentinfo.html'})

export class DocumentInfo {

  docimg: any;
  docid: any;
  docno1: any;
  search: any;

  userdocumentsinfo: any;
  userApiKey : any;
  avatardata: any;

  userdocumentInfoData = {
    "SystemUserID":"",
    "SystemClientID":"",
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
    ) {

    var docimg="";
    this.docimg = this.params.get('docimg');
    console.log("IMG: %s",this.docimg);

    var docid="";
    this.docid = this.params.get('docid');
    console.log("ID: %s",this.docid);

    var docno1="";
    this.docno1 = this.params.get('docno1');
    console.log("DOC: %s",this.docno1);

    var search="";
    this.search = this.params.get('search');
    console.log("Ser: %s",this.search);

    const documentData = JSON.parse(localStorage.getItem('userSystemData'));

    this.userdocumentInfoData.SystemUserID    = documentData[0].SystemUserID;
    this.userdocumentInfoData.SystemClientID  = documentData[0].SystemClientID;
    this.userdocumentInfoData.apiKey          = documentData[0].apiKey;
    this.userdocumentInfoData.SystemProjectID = localStorage.getItem('CurrentProjectID');    
    this.userdocumentInfoData.Thumbnail       = documentData[0].PhotoTiny;
    this.userdocumentInfoData.DocumentNumber  = documentData[0].DocumentNumber;

    this.avatardata             = localStorage.getItem('avatar');

    var documentApiKey          = this.userdocumentInfoData.apiKey;  
    var documentSystemUserID    = this.userdocumentInfoData.SystemUserID;
    var documentSystemProjectID = this.userdocumentInfoData.SystemProjectID; 
    var documentThumbnail       = this.userdocumentInfoData.Thumbnail;
    var documentDocumentNumber  = this.userdocumentInfoData.DocumentNumber;

    var url = Constants.apiUrl+"api/documentinfo/xxx/"+this.userdocumentInfoData.SystemUserID+"/"+this.userdocumentInfoData.SystemProjectID+"/docno"+this.docno1+"/"+this.search;
    
        this.http.get(url).map(res => res.json()).subscribe(data => {
              this._sanitizer.bypassSecurityTrustStyle(data);
              this.userdocumentsinfo = data;          
              console.log("userdocumentsinfo: ",this.userdocumentsinfo);
          },
          err => {
              console.log("Document info not found.");
          }
        ); 

  }

  keys(obj){
      return Object.keys(obj);
  }

  openDocument(clientid,projectid,docid,ext){
    this.navCtrl.push(DocumentViewer,{clientid,projectid,docid,ext});
  }

  //searchByKeyword($event){

    //var documentSystemUserID1    = this.userdocumentInfoData.SystemUserID;
    //var documentSystemProjectID1 = this.userdocumentInfoData.SystemProjectID;
    //var searchTerm               = this.docid;


 
  //}

  dismiss() {
    this.viewCtrl.dismiss();
  }  

}