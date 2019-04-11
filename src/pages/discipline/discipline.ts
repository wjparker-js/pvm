import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Http } from '@angular/http';
import * as Constants from '../../providers/constants';
import { DomSanitizer } from '@angular/platform-browser';

@IonicPage()

@Component({
  selector: 'page-discipline',
  templateUrl: 'discipline.html'
})

export class DisciplinePage {

  selectedDiscipline:string;
  callback: any;

  disciplineApiKey : any;
  disciplineSystemProjectID:any;
  disciplineUserID:any;
  disciplines:any;

constructor(public navCtrl: NavController, private _sanitizer: DomSanitizer, public viewCtrl: ViewController, public navParams: NavParams, public http: Http) {
  }

	ionViewWillEnter() {

		this.callback = this.navParams.get("callback")

		var disciplineData = JSON.parse(localStorage.getItem('userSystemData'));

		this.disciplineSystemProjectID = localStorage.getItem('CurrentProjectID');
		this.disciplineApiKey          = disciplineData[0].apiKey;
		this.disciplineUserID          = disciplineData[0].SystemUserID;

		var url = Constants.apiUrl+"api/discipline/"+this.disciplineApiKey+"/"+this.disciplineSystemProjectID+"/"+this.disciplineUserID;

		    this.http.get(url).map(res => res.json()).subscribe(data => {
		        this._sanitizer.bypassSecurityTrustStyle(data);
		      this.disciplines = data;  
		      console.log(this.disciplines);    
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
		this.callback(this.selectedDiscipline).then(()=>{});
	}

	sendBack(item){
		this.selectedDiscipline = item;
		this.viewCtrl.dismiss();
	}

}