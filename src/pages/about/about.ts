import { Component } from '@angular/core';
import { NavController, ModalController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { Http } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser'
import * as Constants from '../../providers/constants';;
import 'rxjs/add/operator/map';

@Component({selector: 'page-about', templateUrl: 'about.html'})

export class AboutPage {
  
  avatardata: any;
  userdata: any;
  mailsubject: any;
  userContacts: any;
  useremaildata: any;
  projectContacts: any;
  groupContacts: any;
  selectedGroup:any;
  public projectGroups: any;
  public selectedGroups: any[];

  docimg: any;
  docid: any;
  docno1: any;

  docSystemData = {"docid":"","docno1":"","message":"","to":"","subject":"","from":"","img":"","uid":"","pid":"","scid":"","apiKey":""};

  constructor(public navCtrl: NavController, private _sanitizer: DomSanitizer, public params: NavParams, public http: Http, public modalCtrl: ModalController, public viewCtrl: ViewController, private toastCtrl:ToastController) {

    this.avatardata            = localStorage.getItem('avatar');
    this.docimg                = this.params.get('docimg');
    this.docid                 = this.params.get('docid');
    this.docno1                = this.params.get('docno1');
    const documentData         = JSON.parse(localStorage.getItem('userSystemData'));   
    this.docSystemData.pid     = localStorage.getItem('CurrentProjectID');
    this.docSystemData.scid    = documentData[0].SystemClientID;
    this.docSystemData.uid     = documentData[0].SystemUserID;
    this.docSystemData.uid     = this.docSystemData.uid.trim();
    this.docSystemData.apiKey  = documentData[0].apiKey;     
    this.docSystemData.from    = localStorage.getItem('login_id');
    this.docSystemData.from    = localStorage.getItem('login_id').replace(" ","");
  	this.docSystemData.subject = "Document: "+this.docno1;
  	this.docSystemData.img     = this.docimg;
  	this.docSystemData.docid   = this.docid;
    this.docSystemData.docno1  = this.docno1;

    
    var groupurl = Constants.apiUrl+"api/groups/"+this.docSystemData.apiKey+"/"+this.docSystemData.pid+"/1";

    this.http.get(groupurl).map(res => res.json()).subscribe(data => {
          this._sanitizer.bypassSecurityTrustStyle(data);
          this.projectGroups = data;          
          console.log(this.projectGroups);
      },
      err => {
          console.log("Oops! Project Groups Error");
      }
    ); 

  }


  
  setUserType(sGroup) {

    if(sGroup == "Users" ){

      var contacturl = Constants.apiUrl+"api/contacts/"+this.docSystemData.apiKey+"/"+this.docSystemData.pid+"/"+this.docSystemData.from+"/1";

      this.http.get(contacturl).map(res => res.json()).subscribe(data => {
            this._sanitizer.bypassSecurityTrustStyle(data);
            this.groupContacts = data;          
            console.log(this.groupContacts);
        },
        err => {
            console.log("Oops! Group Contacs error");
        }
      ); 

    } else {

      var groupcontacturl = Constants.apiUrl+"api/groups/"+this.docSystemData.apiKey+"/"+this.docSystemData.pid+"/"+sGroup.GroupName;

      this.http.get(groupcontacturl).map(res => res.json()).subscribe(data => {
            this._sanitizer.bypassSecurityTrustStyle(data);
            this.groupContacts = data;          
            console.log(this.groupContacts);
        },
        err => {
              console.log("Oops! Group Contacs error");
        }
      ); 

    }

  }



  private delay(ms: number)
  {
    return new Promise(resolve => setTimeout(resolve, ms));
  }



  private async presentProjectToast(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'middle'
    });
    toast.present();
    await this.delay(3000);
    this.dismiss();
  }



  sendEmail(){

    this.http.get(Constants.apiUrl+'api/sendemail/'+this.docSystemData.apiKey+'/'+this.docSystemData.uid+'/'+this.docSystemData.pid+'/'+this.docSystemData.from+'/'+this.docSystemData.to+'/'+this.docSystemData.subject+'/'+this.docSystemData.message+'/'+this.docSystemData.docid+'/'+this.docno1).map(res => res.json()).subscribe(data => {
          this.useremaildata = data;
          console.log(this.useremaildata);
      },
      err => {
          console.log("Oops! User Email error");
      }
    ); 

    this.presentProjectToast("Email Sent");

  }



  dismiss() {
    this.viewCtrl.dismiss();
  }  

}
