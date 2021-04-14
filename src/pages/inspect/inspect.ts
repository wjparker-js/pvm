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

  lid1:any;
  lid2:any;
  lid3:any;
  lid4:any;

	constructor(public navCtrl: NavController, private _sanitizer: DomSanitizer, public viewCtrl: ViewController, public navParams: NavParams, public http: Http) {}

	ionViewWillEnter() {

		var inspectionrequestData             = JSON.parse(localStorage.getItem('userSystemData'));

		this.inspectionrequestSystemProjectID = localStorage.getItem('CurrentProjectID');
		this.inspectionrequestApiKey          = inspectionrequestData[0].apiKey;
		this.inspectionrequestUserID          = inspectionrequestData[0].SystemUserID;
		this.inspectionrequestUserID          = this.inspectionrequestUserID.trim();

		var url = Constants.apiUrl+"api/inspectiontemplates/"+this.inspectionrequestApiKey+"/"+this.inspectionrequestSystemProjectID+"/"+this.inspectionrequestUserID+"/xxx";

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

	segmentChanged(segment){ 

		if(segment == "new"){
      console.log("new");

      var newurl = Constants.apiUrl+"api/inspectiontemplates/"+this.inspectionrequestApiKey+"/"+this.inspectionrequestSystemProjectID+"/"+this.inspectionrequestUserID+"/xxx";

	    this.http.get(newurl).map(res => res.json()).subscribe(data => {
        this._sanitizer.bypassSecurityTrustStyle(data);
        this.inspectionrequests = data;  			  
        console.log("Templateid: ", this.inspectionrequests);
		    },
		    err => {
		       console.log("Oops!");
		    }
		  ); 
		}

		if(segment == "fix"){
      console.log("fix");

      var fixurl = Constants.apiUrl+"api/inspectiontemplates/"+this.inspectionrequestApiKey+"/"+this.inspectionrequestSystemProjectID+"/"+this.inspectionrequestUserID+"/xxx";

      this.http.get(fixurl).map(res => res.json()).subscribe(data => {
        this._sanitizer.bypassSecurityTrustStyle(data);
        this.inspectionrequests = data;  			  
        console.log("Templateid: ", this.inspectionrequests);
        },
        err => {
           console.log("Oops!");
        }
      ); 
    }
		
		if(segment == "passed"){
      console.log("passed");

      var passedurl = Constants.apiUrl+"api/inspectiontemplates/"+this.inspectionrequestApiKey+"/"+this.inspectionrequestSystemProjectID+"/"+this.inspectionrequestUserID+"/xxx";

      this.http.get(passedurl).map(res => res.json()).subscribe(data => {
        this._sanitizer.bypassSecurityTrustStyle(data);
        this.inspectionrequests = data;  			  
        console.log("Templateid: ", this.inspectionrequests);
        },
        err => {
           console.log("Oops!");
        }
      ); 
    }	

  }

	showtheform(ParentFormID,requestid,lid1,lid2,lid3,lid4) { 
		this.navCtrl.push(InspectionitemsPage,{ParentFormID,requestid,lid1,lid2,lid3,lid4});
	}
                                                                                                                                                                                                                       
	dismiss() {
		this.viewCtrl.dismiss();
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

}
