import { Component } from '@angular/core';
import { NavController, ModalController, NavParams, ViewController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as Constants from '../../providers/constants';
import { DomSanitizer } from '@angular/platform-browser';

@Component({selector: 'page-about', templateUrl: 'about.html'})

export class AboutPage {

  avatardata: any;
  userdata: any;
  mailsubject: any;
  userContacts: any;

  docSystemData = {"docid":"","message":"","to":"","subject":"","from":"","img":"","uid":"","pid":"","scid":"","apiKey":""};

  constructor(public navCtrl: NavController, private _sanitizer: DomSanitizer, public params: NavParams, public http: Http, public modalCtrl: ModalController, public viewCtrl: ViewController) {

    this.avatardata     = localStorage.getItem('avatar');
    console.log("Documents Avatar = "+this.avatardata);

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

    this.docSystemData.pid     = localStorage.getItem('CurrentProjectID');
    this.docSystemData.scid    = documentData[0].SystemClientID;
    this.docSystemData.uid     = documentData[0].SystemUserID;
    this.docSystemData.apiKey  = documentData[0].apiKey;    
 
	this.docSystemData.from    =  localStorage.getItem('login_id');
	this.docSystemData.subject = "Document: "+this.docno1;
	this.docSystemData.img     = this.docimg;
	this.docSystemData.docid   = this.docid;

    var contacturl = Constants.apiUrl+"api/contacts/"+this.docSystemData.apiKey+"/"+this.docSystemData.pid;

    this.http.get(contacturl).map(res => res.json()).subscribe(data => {
          this._sanitizer.bypassSecurityTrustStyle(data);
          this.userContacts = data;          
          console.log(this.userContacts);
      },
      err => {
          console.log("Oops!");
      }
    ); 


  }


  sendEmail(){
  	console.log(this.docSystemData.from);
  	console.log(this.docSystemData.to);
  	console.log(this.docSystemData.subject);
  	console.log(this.docSystemData.message);
  	console.log(this.docSystemData.img);
  	console.log(this.docSystemData.docno);

    var url = Constants.apiUrl+"api/documentview/"+this.clientid+"/"+this.projectid+"/"+this.docid+"/"+this.ext;
    var url = url.toLowerCase();

    this.http.get(url).map(res => res.json()).subscribe(data => {
          this.sanitizer.bypassSecurityTrustStyle(data);
          this.viewdoc = data;          
          console.log("ViewerURL="+this.viewdoc);
        },
        err => {
            console.log("File not available.");
        }
    );



    this.http.post(Constants.apiUrl+'api/sendemail/'+this.docSystemData.apiKey+'/'+this.docSystemData.uid+'/'+this.docSystemData.pid+'/'+this.docSystemData.from+'/'+this.docSystemData.to+'/'+this.docSystemData.subject+'/'+this.docSystemData.message+'/'+this.docSystemData.docid+'/'+this.docno1).map(res => res.json()).subscribe(data => {
          this.userEmailData = data;
          console.log(this.userEmailData);
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
