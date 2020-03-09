import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Http } from '@angular/http';
import * as Constants from '../../providers/constants';
import { DomSanitizer } from '@angular/platform-browser';

@IonicPage()

@Component({
  selector: 'page-reasons',
  templateUrl: 'reasons.html'
})

export class ReasonsPage {

  selectedreasons:string;
  callback: any;

  reasonsApiKey : any;
  reasonsSystemProjectID:any;
  reasonsUserID:any;
  reasons:any;

constructor(public navCtrl: NavController, private _sanitizer: DomSanitizer, public viewCtrl: ViewController, public navParams: NavParams, public http: Http) {
  }

	ionViewWillEnter() {

		this.callback = this.navParams.get("callback")

		var reasonsData = JSON.parse(localStorage.getItem('userSystemData'));

		this.reasonsSystemProjectID = localStorage.getItem('CurrentProjectID');
		this.reasonsApiKey          = reasonsData[0].apiKey;
		this.reasonsUserID          = reasonsData[0].SystemUserID;
		this.reasonsUserID          = this.reasonsUserID.trim();

		var url = Constants.apiUrl+"api/defectsreasons/"+this.reasonsApiKey+"/"+this.reasonsSystemProjectID;

		    this.http.get(url).map(res => res.json()).subscribe(data => {
		        this._sanitizer.bypassSecurityTrustStyle(data);
		      this.reasons = data;  
		      console.log(this.reasons);    
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
		this.callback(this.selectedreasons).then(()=>{});
	}

	sendBack(item){
		this.selectedreasons = item;
		this.viewCtrl.dismiss();
	}

}