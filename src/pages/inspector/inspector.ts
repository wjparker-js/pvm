import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Http } from '@angular/http';
import * as Constants from '../../providers/constants';
import { DomSanitizer } from '@angular/platform-browser';

@IonicPage()

@Component({
  selector: 'page-inspector',
  templateUrl: 'inspector.html',
})

export class InspectorPage {

  selectedinspector:string;  
  inspectorid:string;
  selectedProjectName: string;
  callback: any;

  inspectorApiKey : any;
  inspectorSystemProjectID:any;
  inspectorUserID:any;
  inspectors:any;

	constructor(public navCtrl: NavController, private _sanitizer: DomSanitizer, public viewCtrl: ViewController, public navParams: NavParams, public http: Http) {
  }

	ionViewWillEnter() {

		this.callback        = this.navParams.get("callback");

		var inspectorData   = JSON.parse(localStorage.getItem('userSystemData'));

		this.inspectorSystemProjectID = localStorage.getItem('CurrentProjectID');
		this.inspectorApiKey          = inspectorData[0].apiKey;

		var url = Constants.apiUrl+"api/inspector/"+this.inspectorApiKey+"/"+this.inspectorSystemProjectID;

		    this.http.get(url).map(res => res.json()).subscribe(data => {
		      this._sanitizer.bypassSecurityTrustStyle(data);
		      this.inspectors = data;  ; 
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
		this.callback(this.selectedinspector,this.inspectorid).then(()=>{});
	}

	sendBack(item,userid){
		this.selectedinspector = item;
		this.inspectorid = userid;
		this.dismiss();
	}

}

