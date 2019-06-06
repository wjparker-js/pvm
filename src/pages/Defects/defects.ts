import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import * as Constants from '../../providers/constants';
import { DomSanitizer } from '@angular/platform-browser';
import { SnaggingPage } from '../snagging/snagging';
import { Snagging51Page } from '../snagging51/snagging51';
import { Snagging52Page } from '../snagging52/snagging52';

import 'rxjs/add/operator/map';

@Component({
  selector: 'page-defects',
  templateUrl: 'defects.html'
})

export class DefectsPage {

  defects: any;
	userApiKey : any;
	SystemProjectID: any;
	selectedProjectName:any;
	apiKey: any;

	constructor(public navCtrl: NavController, private _sanitizer: DomSanitizer, public http: Http) {}
	


  ionViewWillEnter() {

    var defectData           = JSON.parse(localStorage.getItem('userSystemData'));
		this.SystemProjectID     = localStorage.getItem('CurrentProjectID');
		this.selectedProjectName = localStorage.getItem('CurrentProjectName');
    this.apiKey              = defectData[0].apiKey; 

    var url = Constants.apiUrl+"api/defects/"+this.apiKey+"/"+this.SystemProjectID+"/1";

    this.http.get(url).map(res => res.json()).subscribe(data => {
          this._sanitizer.bypassSecurityTrustStyle(data);
          this.defects = data;          
					console.log(this.defects);
      },
      err => {
          console.log("Oops!");
      }
    ); 
  }

	newSnag(snagid){
		console.log(snagid);
		this.navCtrl.push(SnaggingPage,{snagid});
	}

	openSnag(snagid,orderstatus){
		console.log(snagid);
		console.log(orderstatus);
		if(orderstatus == 50){this.navCtrl.push(Snagging51Page,{snagid,orderstatus});}
		if(orderstatus == 51){this.navCtrl.push(Snagging51Page,{snagid,orderstatus});}
		if(orderstatus == 52){this.navCtrl.push(Snagging52Page,{snagid,orderstatus});}
		if(orderstatus == 53){this.navCtrl.push(Snagging52Page,{snagid,orderstatus});}
		if(orderstatus == 54){this.navCtrl.push(Snagging52Page,{snagid,orderstatus});}
		if(orderstatus == 55){this.navCtrl.push(Snagging52Page,{snagid,orderstatus});}
		if(orderstatus == 56){this.navCtrl.push(Snagging52Page,{snagid,orderstatus});}
	}

  segmentChanged(segment){

    if(segment == "all"){

			var url = Constants.apiUrl+"api/defects/"+this.apiKey+"/"+this.SystemProjectID+"/1";

			    this.http.get(url).map(res => res.json()).subscribe(data => {
				        this._sanitizer.bypassSecurityTrustStyle(data);
								this.defects = data;          
								console.log(this.defects);
				    },
				    err => {
				        console.log("Oops!");
				    }
					); 

    }

    if(segment == "new"){

			var url = Constants.apiUrl+"api/defects/"+this.apiKey+"/"+this.SystemProjectID+"/2";

			    this.http.get(url).map(res => res.json()).subscribe(data => {
				        this._sanitizer.bypassSecurityTrustStyle(data);
								this.defects = data;          
								console.log(this.defects);
				    },
				    err => {
				        console.log("Oops!");
				    }
					); 

		} 
		
    if(segment == "open"){

			var url = Constants.apiUrl+"api/defects/"+this.apiKey+"/"+this.SystemProjectID+"/3";

			    this.http.get(url).map(res => res.json()).subscribe(data => {
				        this._sanitizer.bypassSecurityTrustStyle(data);
								this.defects = data;          
								console.log(this.defects);
				    },
				    err => {
				        console.log("Oops!");
				    }
					); 

    }
     

  }

}

