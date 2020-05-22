import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IonicPage, ModalController, Platform, NavController, NavParams, ViewController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { DocumentViewer } from '../documentviewer/documentviewer';
import * as Constants from '../../providers/constants';

@IonicPage()

@Component({selector: 'page-documentidinfo', templateUrl: 'documentidinfo.html'})

export class DocumentIdInfo {

  uid: any;  
  pid: any;
  scid: any;
  docid: any;
  displaydocnum: any; 

  userdocumentsinfo: any;
  userApiKey : any;

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

      this.pid    = this.params.get('ipid');
      this.scid   = this.params.get('iscid');
      this.docid  = this.params.get('idid');
      this.uid    = this.params.get('iuid');

      var url = Constants.apiUrl+"api/documentidinfo/xxx/"+this.docid+"/"+this.scid+"/"+this.pid+"/"+this.uid;
      
      this.http.get(url).map(res => res.json()).subscribe(data => {
        this._sanitizer.bypassSecurityTrustStyle(data);
        this.userdocumentsinfo = data;          
        this.displaydocnum = this.userdocumentsinfo["0"].DocumentNumber
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

    dismiss() {
      this.viewCtrl.dismiss();
    }  

}