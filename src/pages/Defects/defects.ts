import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import * as Constants from '../../providers/constants';
import { DomSanitizer } from '@angular/platform-browser';
import { SnaggingPage } from '../snagging/snagging';
import { Snagging51Page } from '../snagging51/snagging51';
import { Snagging52Page } from '../snagging52/snagging52';
import { QrcodePage } from '../qrcode/qrcode';

import 'rxjs/add/operator/map';

@Component({
  selector: 'page-defects',
  templateUrl: 'defects.html'
})

export class DefectsPage {

	defects: any;
	defectslist: any;
	userApiKey : any;
	SystemProjectID: any;
	selectedProjectName:any;
  eventInstance : any;
  dsearch : any;
	apiKey: any;
	location: string = "";
	public ImgUrl:any;
	public thumbbase:any;

	constructor(public navCtrl: NavController, private _sanitizer: DomSanitizer, public http: Http) {}

  ionViewWillEnter() {

		console.log("ionViewWillEnter");

    var defectData           = JSON.parse(localStorage.getItem('userSystemData'));
		this.SystemProjectID     = localStorage.getItem('CurrentProjectID');
		this.selectedProjectName = localStorage.getItem('CurrentProjectName');
		this.apiKey              = defectData[0].apiKey; 

		this.defectslist         = "all";
		
		var url = "";

		if(this.location === ""){
			url = Constants.apiUrl+"api/defects/"+this.apiKey+"/"+this.SystemProjectID+"/nosearch/1";
		} else {
			url = Constants.apiUrl+"api/defectsqr/"+this.apiKey+"/"+this.SystemProjectID+"/"+this.location;
		}

		console.log(url);

    this.http.get(url).map(res => res.json()).subscribe(data => {
          this._sanitizer.bypassSecurityTrustStyle(data);
          this.defects = data;          
		  console.log(this.defects);
		  
		  if ( this.defects.length > 0 ) {  

		  if(this.defects[0].thumbbase64 !== null || this.defects[0].thumbbase64 !== ""){
			this.ImgUrl = this._sanitizer.bypassSecurityTrustUrl("data:Image/*;base64,"+this.defects[0].thumbbase64);
			} else {
			this.ImgUrl = null;
			}
		  }

      },
      err => {
          console.log("Oops!");
      }
    ); 
  }

	searchDefectsByKeyword($event){
	
    var defectData           = JSON.parse(localStorage.getItem('userSystemData'));
	this.SystemProjectID     = localStorage.getItem('CurrentProjectID');
	this.selectedProjectName = localStorage.getItem('CurrentProjectName');
	this.apiKey              = defectData[0].apiKey; 

    var searchTerm           = $event.srcElement.value;
    this.eventInstance       = $event;
	this.dsearch             = $event.srcElement.value;
	this.defectslist         = "";

	var url = Constants.apiUrl+"api/defects/"+this.apiKey+"/"+this.SystemProjectID+"/"+searchTerm+"/xxx";
	console.log(url);

    this.http.get(url).map(res => res.json()).subscribe(data => {
          this._sanitizer.bypassSecurityTrustStyle(data);
          this.defects = data;          
		  console.log(this.defects);

          if ( this.defects.length > 0 ) {          
			if(this.defects[0].thumbbase64 !== null || this.defects[0].thumbbase64 !== ""){
			this.ImgUrl = this._sanitizer.bypassSecurityTrustUrl("data:Image/*;base64,"+this.defects[0].thumbbase64);
			} else {
			this.ImgUrl = null;
			}
		  }

		  //
      },
      err => {
          console.log("Oops!");
      }
    ); 
	}

	newSnag(snagid){
		this.navCtrl.push(SnaggingPage,{snagid});
		console.log(snagid);
	}

	openLocationQRCode(){
		this.navCtrl.push(QrcodePage, {callback:this.myCallbackFunction1,"parentPage": this});
	}

	myCallbackFunction1 = (_params) => {		
		return new Promise((resolve, reject) => {
			this.location = _params;
			resolve();
			console.log("myCallbackFunction1",this.location);
			console.log(_params);
		});
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

		var htmlElement = document.getElementsByClassName("searchbar-input");
		if(htmlElement.length == 1){var searchTerm = htmlElement["0"].value;}
		if(htmlElement.length == 2){var searchTerm = htmlElement["1"].value;}
		

		console.log(htmlElement);
		console.log(searchTerm);

		if(searchTerm == ""){searchTerm = "nosearch";}

    if(segment == "all"){

			var urls1 = Constants.apiUrl+"api/defects/"+this.apiKey+"/"+this.SystemProjectID+"/"+searchTerm+"/1";
			console.log(urls1);

			    this.http.get(urls1).map(res => res.json()).subscribe(data => {
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

			var urls2 = Constants.apiUrl+"api/defects/"+this.apiKey+"/"+this.SystemProjectID+"/"+searchTerm+"/2";
			console.log(urls2);

			    this.http.get(urls2).map(res => res.json()).subscribe(data => {
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

			var urls3 = Constants.apiUrl+"api/defects/"+this.apiKey+"/"+this.SystemProjectID+"/"+searchTerm+"/3";
			console.log(urls3);

			    this.http.get(urls3).map(res => res.json()).subscribe(data => {
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

