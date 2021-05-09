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
  inspectionusers:any;
  showform:any;
  templateid:any;
  pa5038:any;
  today:any;
  suborinspector:any;
  
  defectslist:any;
  subdefectslist:any;

  usercompanyname:any;
  username:any;

  isinspector:any;

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

    this.usercompanyname                = inspectionrequestData[0].Company;
    this.usercompanyname                = this.usercompanyname.trim();
    this.username                       = inspectionrequestData[0].Name;
    this.username                       = this.username.trim(); 

    this.subdefectslist = "submit";
    this.defectslist = "inspect";

    this.today =new Date();
    console.log("this.today  ",this.today);


		var url1 = Constants.apiUrl+"api/inspectinusers/"+this.inspectionrequestApiKey+"/"+this.inspectionrequestSystemProjectID+"/"+this.inspectionrequestUserID;
    this.http.get(url1).map(res => res.json()).subscribe(data => {
      this._sanitizer.bypassSecurityTrustStyle(data);
      this.inspectionusers = data;  			  
      this.isinspector = this.inspectionusers[0].isinspector;

        if(this.isinspector == 0){
          console.log("is subby");
          var url11 = Constants.apiUrl+"api/inspectiontemplates/"+this.inspectionrequestApiKey+"/"+this.inspectionrequestSystemProjectID+"/"+this.inspectionrequestUserID+"/"+this.username+"/"+this.usercompanyname+"/submit/sub";
          this.http.get(url11).map(res => res.json()).subscribe(data => {
            this._sanitizer.bypassSecurityTrustStyle(data);
            this.inspectionrequests = data;
            },
            err => {
                console.log("Oops!");
            }
          ); 
        } 
      
        if(this.isinspector != 0){
          console.log("in ins");
          var url22 = Constants.apiUrl+"api/inspectiontemplates/"+this.inspectionrequestApiKey+"/"+this.inspectionrequestSystemProjectID+"/"+this.inspectionrequestUserID+"/"+this.username+"/"+this.usercompanyname+"/inspect/ins";
          this.http.get(url22).map(res => res.json()).subscribe(data => {
            this._sanitizer.bypassSecurityTrustStyle(data);
            this.inspectionrequests = data;
            },
            err => {
                console.log("Oops!");
            }
          );       
        }

      },
      err => {
          console.log("Oops! no inspectionusers");
      }
    );
  }




	segmentChanged(segment){ 

		if(segment == "inspect"){
      var inspecturl = Constants.apiUrl+"api/inspectiontemplates/"+this.inspectionrequestApiKey+"/"+this.inspectionrequestSystemProjectID+"/"+this.inspectionrequestUserID+"/"+this.username+"/"+this.usercompanyname+"/inspect/ins";
	    this.http.get(inspecturl).map(res => res.json()).subscribe(data => {
        this._sanitizer.bypassSecurityTrustStyle(data);
        this.inspectionrequests = data; 	
        this.suborinspector = "ins";		  			  
		    },
		    err => {
		       console.log("Oops!");
		    }
		  ); 
		}

    if(segment == "approved"){
      var approvedurl = Constants.apiUrl+"api/inspectiontemplates/"+this.inspectionrequestApiKey+"/"+this.inspectionrequestSystemProjectID+"/"+this.inspectionrequestUserID+"/"+this.username+"/"+this.usercompanyname+"/approved/ins";
      this.http.get(approvedurl).map(res => res.json()).subscribe(data => {
        this._sanitizer.bypassSecurityTrustStyle(data);
        this.inspectionrequests = data;  	
        this.suborinspector = "ins";		 
        },
        err => {
           console.log("Oops!");
        }
      ); 
    }	    
    
		if(segment == "failed"){
      var failedurl = Constants.apiUrl+"api/inspectiontemplates/"+this.inspectionrequestApiKey+"/"+this.inspectionrequestSystemProjectID+"/"+this.inspectionrequestUserID+"/"+this.username+"/"+this.usercompanyname+"/failed/ins";
      this.http.get(failedurl).map(res => res.json()).subscribe(data => {
        this._sanitizer.bypassSecurityTrustStyle(data);
        this.inspectionrequests = data;  	
        this.suborinspector = "ins";		  
        },
        err => {
           console.log("Oops!");
        }
      ); 
    }

  }

	segmentChangedsub(segment){     

		if(segment == "submit"){
      var submiturl = Constants.apiUrl+"api/inspectiontemplates/"+this.inspectionrequestApiKey+"/"+this.inspectionrequestSystemProjectID+"/"+this.inspectionrequestUserID+"/"+this.username+"/"+this.usercompanyname+"/submit/sub";
      this.http.get(submiturl).map(res => res.json()).subscribe(data => {
        this._sanitizer.bypassSecurityTrustStyle(data);
        this.inspectionrequests = data;
        this.suborinspector = "sub";
        },
        err => {
            console.log("Oops!");
        }
      ); 
    }		

		if(segment == "fix"){
      var fixurl = Constants.apiUrl+"api/inspectiontemplates/"+this.inspectionrequestApiKey+"/"+this.inspectionrequestSystemProjectID+"/"+this.inspectionrequestUserID+"/"+this.username+"/"+this.usercompanyname+"/fix/subi";
	    this.http.get(fixurl).map(res => res.json()).subscribe(data => {
        this._sanitizer.bypassSecurityTrustStyle(data);
        this.inspectionrequests = data;  	
        this.suborinspector = "subi";	
		    },
		    err => {
		       console.log("Oops!");
		    }
		  ); 
		}

		if(segment == "passed"){
      var passedurl = Constants.apiUrl+"api/inspectiontemplates/"+this.inspectionrequestApiKey+"/"+this.inspectionrequestSystemProjectID+"/"+this.inspectionrequestUserID+"/"+this.username+"/"+this.usercompanyname+"/passed/subi";
      this.http.get(passedurl).map(res => res.json()).subscribe(data => {
        this._sanitizer.bypassSecurityTrustStyle(data);
        this.inspectionrequests = data;  		
        this.suborinspector = "subi";	  
        },
        err => {
           console.log("Oops!");
        }
      ); 
    }	

  }

	showtheform(ParentFormID,requestid,lid1,lid2,lid3,lid4,template,who) { 
		this.navCtrl.push(InspectionitemsPage,{ParentFormID,requestid,lid1,lid2,lid3,lid4,template,who});
	}
                                                                                                                                                                                                                       
	dismiss() {
		this.viewCtrl.dismiss();
	} 

	getRequestDetails(request){
		console.log(request);
		var url = Constants.apiUrl+"api/inspectiontemplates/"+this.inspectionrequestApiKey+"/"+this.inspectionrequestSystemProjectID+"/"+this.inspectionrequestUserID+this.username+"/"+this.usercompanyname+"/"+request+"/"+this.pa5038;

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
