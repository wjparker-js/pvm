import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Http } from '@angular/http';
import * as Constants from '../../providers/constants';
import { DomSanitizer } from '@angular/platform-browser';

//@IonicPage()

@Component({
  selector: 'page-discipline',
  templateUrl: 'discipline.html'
})

export class DisciplinePage {

  selectedDiscipline:string;
  selectedcommercialemail:string = "Undefined";
  selectedremediatoremail:string = "Undefined";
  selectedinspectoremail:string = "Undefined";  
  selectedcommercialid:string = "Undefined";
  selectedremediatorid:string = "Undefined";
  selectedinspectorid:string = "Undefined";

  selectedDefect:string;
  callback: any;

  disciplineApiKey : any;
  disciplineSystemProjectID:any;
  disciplineUserID:any;
  disciplines:any;

	constructor(public navCtrl: NavController, private _sanitizer: DomSanitizer, public viewCtrl: ViewController, public navParams: NavParams, public http: Http) {
  }

	ionViewWillEnter() {

		this.selectedDefect = this.navParams.get('selecteddefect');
		this.callback       = this.navParams.get("callback");

		var disciplineData = JSON.parse(localStorage.getItem('userSystemData'));

		this.disciplineSystemProjectID = localStorage.getItem('CurrentProjectID');
		this.disciplineApiKey          = disciplineData[0].apiKey;
		this.disciplineUserID          = disciplineData[0].SystemUserID;
		this.disciplineUserID          = this.disciplineUserID.trim();

		var url = Constants.apiUrl+"api/discipline/"+this.disciplineApiKey+"/"+this.disciplineSystemProjectID+"/"+this.selectedDefect;

		    this.http.get(url).map(res => res.json()).subscribe(data => {
		        this._sanitizer.bypassSecurityTrustStyle(data);
		      this.disciplines = data;  
			  console.log(this.disciplines);   
			  console.log(this.disciplines.GroupName); 
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
		this.callback(this.selectedDiscipline,this.selectedinspectoremail,this.selectedremediatoremail,this.selectedcommercialemail,this.selectedinspectorid,this.selectedremediatorid,this.selectedcommercialid).then(()=>{});
	}

	sendBack(item,inspector,remediator,commercial,inspectorid,remediatorid,commercialid){
		this.selectedDiscipline = item;
		this.selectedinspectoremail = inspector;
		this.selectedremediatoremail = remediator;
		this.selectedcommercialemail = commercial;
		this.selectedinspectorid = inspectorid;
		this.selectedremediatorid = remediatorid;
		this.selectedcommercialid = commercialid;
		this.viewCtrl.dismiss();
	}

}