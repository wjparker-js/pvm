import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController, Platform, NavParams, ViewController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


@Component({selector: 'page-documentissues',templateUrl: 'documentissues.html'})

export class DocumentIssues {

docimg: any;
docid: any;
docno1: any;

  userdocumentsinfo: any;
  userApiKey : any;

  userdocumentInfoData = {
    "SystemUserID": "",
    "apiKey":"",
    "SystemProjectID":"",
    "Thumbnail":"",
    "DocumentNumber":""
  };

  constructor(public platform: Platform, public params: NavParams, public http: Http, private _sanitizer: DomSanitizer, public modalCtrl: ModalController, public viewCtrl: ViewController) {

  }



}
                                                  