import { Component } from '@angular/core';
import { ModalController, Platform, NavParams, ViewController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({templateUrl: 'documentinfoall.html'})


export class DocumentInfoAll {

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

  constructor(public platform: Platform, public params: NavParams, public http: Http,  public modalCtrl: ModalController, public viewCtrl: ViewController) {

  }



}
                                                  