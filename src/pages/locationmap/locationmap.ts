import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Http } from '@angular/http';
import * as Constants from '../../providers/constants';
import { DomSanitizer } from '@angular/platform-browser';

//@IonicPage()

@Component({
  selector: 'page-locationmap',
  templateUrl: 'locationmap.html'
})

export class LocationmapPage {

  selectedCode:string;
  callback: any;

  locationmapApiKey : any;
  locationmapSystemProjectID:any;
  locationmapUserID:any;
  locationMaps:any;
  pa5038:any;

  LocationmapData = {
    "SystemProjectID":"",
    "SystemProjectName":"",
    "SystemUserID": "",
    "LocationID":"",
    "LocationOwnerID":"",
    "LocationImage":"",
    "L1Name":"",
    "L1ID":"",
    "L2Name":"",
    "L2ID":"",
    "L3Name":"",
    "L3ID":"",
    "L4Name":"",
    "L4ID":"",
    "Lat":"",
    "Long":"",
    "Alt":""
  };

constructor(public navCtrl: NavController, private _sanitizer: DomSanitizer, public viewCtrl: ViewController, public navParams: NavParams, public http: Http) {
  }

	ionViewWillEnter() {

		this.callback = this.navParams.get("callback")

		var locationmapData = JSON.parse(localStorage.getItem('userSystemData'));

    this.locationmapSystemProjectID = localStorage.getItem('CurrentProjectID');
    this.pa5038                     = localStorage.getItem('Role-PA5038');    
		this.locationmapApiKey          = locationmapData[0].apiKey;
    this.locationmapUserID          = locationmapData[0].SystemUserID;
    this.locationmapUserID          = this.locationmapUserID.trim();

		var url = Constants.apiUrl+"api/locationmap/"+this.locationmapApiKey+"/"+this.locationmapSystemProjectID+"/"+this.locationmapUserID+"/"+this.pa5038;

		    this.http.get(url).map(res => res.json()).subscribe(data => {
		      this._sanitizer.bypassSecurityTrustStyle(data);
		      this.locationMaps = data;          
		      console.log(this.locationMaps);
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
		this.callback(this.selectedCode).then(()=>{});
	}

	sendBack(item){
    this.selectedCode = item;
    localStorage.setItem('location', this.selectedCode); 
		this.viewCtrl.dismiss();
	}

}

