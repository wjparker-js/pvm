import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Http } from '@angular/http';
import * as Constants from '../../providers/constants';
import { DomSanitizer } from '@angular/platform-browser';

//@IonicPage()

@Component({
  selector: 'page-subtypes',
  templateUrl: 'subtypes.html'
})

export class SubtypesPage {

  selectedsubtypes:string;
  callback: any;

  subtypesApiKey : any;
  subtypesSystemProjectID:any;
  subtypesUserID:any;
  subtypes:any;

constructor(public navCtrl: NavController, private _sanitizer: DomSanitizer, public viewCtrl: ViewController, public navParams: NavParams, public http: Http) {
  }

	ionViewWillEnter() {

		this.callback = this.navParams.get("callback")

		var subtypesData = JSON.parse(localStorage.getItem('userSystemData'));

		this.subtypesSystemProjectID = localStorage.getItem('CurrentProjectID');
		this.subtypesApiKey          = subtypesData[0].apiKey;

		var url = Constants.apiUrl+"api/defectssubtypes/"+this.subtypesApiKey+"/"+this.subtypesSystemProjectID;

		    this.http.get(url).map(res => res.json()).subscribe(data => {
		        this._sanitizer.bypassSecurityTrustStyle(data);
		      this.subtypes = data;  
		      console.log(this.subtypes);    
		    },
		    err => {
		        console.log("Data Oops!");
		    }
		); 
	}

	dismiss() {
		this.viewCtrl.dismiss();
	} 

	ionViewWillLeave() {
		this.callback(this.selectedsubtypes).then(()=>{});
	}

	sendBack(item){
		this.selectedsubtypes = item;
		this.viewCtrl.dismiss();
	}

}