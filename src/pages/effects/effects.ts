import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Http } from '@angular/http';
import * as Constants from '../../providers/constants';
import { DomSanitizer } from '@angular/platform-browser';

@IonicPage()

@Component({
  selector: 'page-effects',
  templateUrl: 'effects.html'
})

export class EffectsPage {

  selectedeffects:string;
  callback: any;

  effectsApiKey : any;
  effectsSystemProjectID:any;
  effectsUserID:any;
  effects:any;

constructor(public navCtrl: NavController, private _sanitizer: DomSanitizer, public viewCtrl: ViewController, public navParams: NavParams, public http: Http) {
  }

	ionViewWillEnter() {

		this.callback = this.navParams.get("callback")

		var effectsData = JSON.parse(localStorage.getItem('userSystemData'));

		this.effectsSystemProjectID = localStorage.getItem('CurrentProjectID');
		this.effectsApiKey          = effectsData[0].apiKey;
		this.effectsUserID          = effectsData[0].SystemUserID;

		var url = Constants.apiUrl+"api/defectseffects/"+this.effectsApiKey+"/"+this.effectsSystemProjectID;

		    this.http.get(url).map(res => res.json()).subscribe(data => {
		        this._sanitizer.bypassSecurityTrustStyle(data);
		      this.effects = data;  
		      console.log(this.effects);    
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
		this.callback(this.selectedeffects).then(()=>{});
	}

	sendBack(item){
		this.selectedeffects = item;
		this.viewCtrl.dismiss();
	}

}