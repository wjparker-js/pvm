import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Http } from '@angular/http';
import * as Constants from '../../providers/constants';
import { DomSanitizer } from '@angular/platform-browser';

@IonicPage()

@Component({
  selector: 'page-remediator',
  templateUrl: 'remediator.html',
})

export class RemediatorPage {

  selectedremediator:string;  
  selectedProjectName: string;
  callback: any;

  remediatorApiKey : any;
  remediatorSystemProjectID:any;
  remediatorUserID:any;
  remediators:any;

	constructor(public navCtrl: NavController, private _sanitizer: DomSanitizer, public viewCtrl: ViewController, public navParams: NavParams, public http: Http) {
  }

	ionViewWillEnter() {

		this.callback        = this.navParams.get("callback");

		var remediatorData   = JSON.parse(localStorage.getItem('userSystemData'));

		this.remediatorSystemProjectID = localStorage.getItem('CurrentProjectID');
		this.remediatorApiKey          = remediatorData[0].apiKey;

		var url = Constants.apiUrl+"api/remediator/"+this.remediatorApiKey+"/"+this.remediatorSystemProjectID;

		    this.http.get(url).map(res => res.json()).subscribe(data => {
		      this._sanitizer.bypassSecurityTrustStyle(data);
		      this.remediators = data;  ; 
		    },
		    err => {
		        console.log("Oops!");
		    }
		); 
	}

  dismiss() {
		this.viewCtrl.dismiss();
	} 

	ionViewWillLeave() {
		this.callback(this.selectedremediator).then(()=>{});
	}

	sendBack(item){
		this.selectedremediator = item;
		this.viewCtrl.dismiss();
	}

}

