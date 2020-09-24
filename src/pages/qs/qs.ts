import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Http } from '@angular/http';
import * as Constants from '../../providers/constants';
import { DomSanitizer } from '@angular/platform-browser';

@IonicPage()

@Component({
  selector: 'page-qs',
  templateUrl: 'qs.html',
})

export class QsPage {

  selectedQs:string;
  commercialid:string;
  selectedProjectName: string;
  callback: any;

  qsApiKey : any;
  qsSystemProjectID:any;
  qsUserID:any;
  qss:any;

	constructor(public navCtrl: NavController, private _sanitizer: DomSanitizer, public viewCtrl: ViewController, public navParams: NavParams, public http: Http) {
  }

	ionViewWillEnter() {

		this.callback        = this.navParams.get("callback");

		var qsData = JSON.parse(localStorage.getItem('userSystemData'));

		this.qsSystemProjectID = localStorage.getItem('CurrentProjectID');
		this.qsApiKey          = qsData[0].apiKey;

		var url = Constants.apiUrl+"api/qs/"+this.qsApiKey+"/"+this.qsSystemProjectID;

		    this.http.get(url).map(res => res.json()).subscribe(data => {
		      this._sanitizer.bypassSecurityTrustStyle(data);
		      this.qss = data;  ; 
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
		this.callback(this.selectedQs,this.commercialid).then(()=>{});
	}

	sendBack(item,userid){
		this.selectedQs = item;
		this.commercialid = userid;
		this.dismiss();
	}

}
