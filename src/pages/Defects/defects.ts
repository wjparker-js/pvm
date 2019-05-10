import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import * as Constants from '../../providers/constants';
import { DomSanitizer } from '@angular/platform-browser';
import { SnaggingPage } from '../snagging/snagging';

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
	
	showSnags(){
			this.navCtrl.push(SnaggingPage,{});
	}

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

