import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Http } from '@angular/http';
import * as Constants from '../../providers/constants';
import { DomSanitizer } from '@angular/platform-browser';
import { InspectionitemsPage } from '../inspectionitems/inspectionitems';

@IonicPage()

@Component({
  selector: 'page-inspect',
  templateUrl: 'inspect.html',
})

export class InspectPage {

  inspectionrequestSystemProjectID:any;
  inspectionrequestApiKey:any;
  inspectionrequestUserID:any;
  selectedinspectionrequest:string;
  callback: any;
  inspectionrequests:any;
  inspectionrequestsdata:any;
  showform:any;
  templateid:any;
  pa5038:any;

	constructor(public navCtrl: NavController, private _sanitizer: DomSanitizer, public viewCtrl: ViewController, public navParams: NavParams, public http: Http) {
  }

	ionViewWillEnter() {

		//this.selectedinspectionrequest = this.navParams.get('selecteddefect');
		//this.callback                  = this.navParams.get("callback");

		var inspectionrequestData             = JSON.parse(localStorage.getItem('userSystemData'));

		this.inspectionrequestSystemProjectID = localStorage.getItem('CurrentProjectID');		
		this.pa5038                           = localStorage.getItem('Role-PA5038');
		this.inspectionrequestApiKey          = inspectionrequestData[0].apiKey;
		this.inspectionrequestUserID          = inspectionrequestData[0].SystemUserID;
		this.inspectionrequestUserID          = this.inspectionrequestUserID.trim();

		this.showform = 0;

		var url = Constants.apiUrl+"api/inspectiontemplates/"+this.inspectionrequestApiKey+"/"+this.inspectionrequestSystemProjectID+"/"+this.inspectionrequestUserID+"/xxx/"+this.pa5038;

		    this.http.get(url).map(res => res.json()).subscribe(data => {
		      this._sanitizer.bypassSecurityTrustStyle(data);
			  this.inspectionrequests = data;  			  
			  //this.templateid = this.inspectionrequests[0].ParentTemplateFormID;
			  console.log("Templateid: ", this.inspectionrequests);
		    },
		    err => {
		        console.log("Oops!");
		    }
		); 
	}

	getRequestDetails(request){
		console.log(request);
		var url = Constants.apiUrl+"api/inspectiontemplates/"+this.inspectionrequestApiKey+"/"+this.inspectionrequestSystemProjectID+"/"+this.inspectionrequestUserID+"/"+request+"/"+this.pa5038;

		    this.http.get(url).map(res => res.json()).subscribe(data => {
		      this._sanitizer.bypassSecurityTrustStyle(data);
			  this.inspectionrequestsdata = data;  ; 
		    },
		    err => {
		        console.log("Oops!");
		    }
		); 
	}

	showtheform(requestid) { 
		this.navCtrl.push(InspectionitemsPage,{requestid});
	  }
                                                                                                                                                                                                                       
	dismiss() {
		this.viewCtrl.dismiss();
	} 

}
