import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { CallNumber } from '@ionic-native/call-number';
import * as Constants from '../../providers/constants';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})

export class ContactPage {

  userContacts: any;
  userApiKey : any;
  avatardata: any;
  phonelist: any;

  userContactData = {
    "SystemProjectID":"",
    "SystemProjectName":"",
    "SystemUserID": "",
    "ContactFName":"",
    "ContactLName":"",
    "ContactRole":"",
    "ContactCompany":"",
    "ContactDepartment":"",
    "ContactPhone":"",
    "ContactMobile":"",
    "apiKey":"",
    "ContactPicture":"",
    "ProjectName":""
  };

  constructor(public navCtrl: NavController, private _sanitizer: DomSanitizer, public http: Http, private callNumber: CallNumber) {

    const contactData = JSON.parse(localStorage.getItem('userSystemData'));

    this.userContactData.SystemProjectID   = localStorage.getItem('CurrentProjectID');
    this.userContactData.apiKey            = contactData[0].apiKey;   
    this.avatardata                        = localStorage.getItem('avatar');
    this.phonelist                         = "users";
  }



  ionViewWillEnter() {

    var contactData = JSON.parse(localStorage.getItem('userSystemData'));

    this.userContactData.SystemProjectID   = localStorage.getItem('CurrentProjectID');
    this.userContactData.apiKey            = contactData[0].apiKey; 
    this.userName                          = localStorage.getItem('login_id');
    this.userContactData.ProjectName       = localStorage.getItem('CurrentProjectName'); 
    this.avatardata                        = localStorage.getItem('avatar');

    var url = Constants.apiUrl+"api/contacts/"+this.userContactData.apiKey+"/"+this.userContactData.SystemProjectID+"/"+this.userName+"/1";

    this.http.get(url).map(res => res.json()).subscribe(data => {
          this._sanitizer.bypassSecurityTrustStyle(data);
          this.userContacts = data;          
          console.log(this.userContacts);
      },
      err => {
          console.log("Oops!");
      }
    ); 
  }


  segmentChanged(segment){
    console.log(segment);
    
    if(segment == "users"){

      var url = Constants.apiUrl+"api/contacts/"+this.userContactData.apiKey+"/"+this.userContactData.SystemProjectID+"/"+this.userName+"/1";

      this.http.get(url).map(res => res.json()).subscribe(data => {
            this._sanitizer.bypassSecurityTrustStyle(data);
            this.userContacts = data;          
            console.log(this.userContacts);
        },
        err => {
            console.log("Oops!");
        }
      ); 

    }

    if(segment == "contacts"){

      var url = Constants.apiUrl+"api/contacts/"+this.userContactData.apiKey+"/"+this.userContactData.SystemProjectID+"/"+this.userName+"/2";

      this.http.get(url).map(res => res.json()).subscribe(data => {
            this._sanitizer.bypassSecurityTrustStyle(data);
            this.userContacts = data;          
            console.log(this.userContacts);
        },
        err => {
            console.log("Oops!");
        }
      ); 

    } 
     

  }

  callJoint(telephoneNumber) {
      this.callNumber.callNumber(telephoneNumber, true);
  }

}

