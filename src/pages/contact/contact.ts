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
    "ContactPicture":""
  };

  constructor(public navCtrl: NavController, private _sanitizer: DomSanitizer, public http: Http, private callNumber: CallNumber) {

    const contactData = JSON.parse(localStorage.getItem('userSystemData'));

    this.userContactData.SystemProjectID   = localStorage.getItem('CurrentProjectID');
    this.userContactData.apiKey            = contactData[0].apiKey;   


  }

  ionViewWillEnter() {

    var contactData = JSON.parse(localStorage.getItem('userSystemData'));

    this.userContactData.SystemProjectID   = localStorage.getItem('CurrentProjectID');
    this.userContactData.apiKey            = contactData[0].apiKey; 

    var url = Constants.apiUrl+"api/contacts/"+this.userContactData.apiKey+"/"+this.userContactData.SystemProjectID;

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


  callJoint(telephoneNumber) {
      this.callNumber.callNumber(telephoneNumber, true);
  }

}

