import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { Http } from '@angular/http';
import * as Constants from '../../providers/constants';
import { DomSanitizer } from '@angular/platform-browser';
import { pipeFromArray } from 'rxjs/util/pipe';
import { AnonymousSubject } from 'rxjs';


@IonicPage()
@Component({
  selector: 'page-inspectionitems',
  templateUrl: 'inspectionitems.html',
})

export class InspectionitemsPage {

  inspectionitemsid:any;
  inspectionitemsSystemProjectID:any;
  inspectionitemsApiKey:any;
  inspectionitemsUserID:any;
  selectedinspectionitems:string;
  clienttID:any;
  callback: any;
  inspectionitemss:any;
  inspectionitemssdata:any;
  showform:any;
  templateid:any;
  formData:any;
  updata:any;

  buttonDisabled:boolean;
  allChecked:boolean= false;
  checkeditems:any;
  
  delitems:any;
  totalItems:any;
  itemid:any;
  template:any;
  usercompanyname:any;
  username:any;

  addcheck:any;
  delcheck:boolean = false;
  inspectinform:any;
  notes:any;
  
  pa5038:any;
  //checkAllTicked:any;
  
  locationMaps:any;
  selectedlocation:string="";
  arrselectedlocation:any;

	constructor(public navCtrl: NavController, private toastCtrl:ToastController, private _sanitizer: DomSanitizer, public viewCtrl: ViewController, public navParams: NavParams, public http: Http) {
  }

	ionViewWillEnter(): void {

    this.inspectionitemsid = this.navParams.get('requestid');		
    this.pa5038            = localStorage.getItem('Role-PA5038');
    this.arrselectedlocation = [];
    this.selectedlocation = "";
    this.notes = "No notes...";

		var inspectionitemstData            = JSON.parse(localStorage.getItem('userSystemData'));

    this.inspectionitemsSystemProjectID = localStorage.getItem('CurrentProjectID');
    this.clienttID                      = localStorage.getItem('CurrentProjectClientID');
    
		this.inspectionitemsApiKey          = inspectionitemstData[0].apiKey;
		this.inspectionitemsUserID          = inspectionitemstData[0].SystemUserID;
    this.inspectionitemsUserID          = this.inspectionitemsUserID.trim();
		this.usercompanyname                = inspectionitemstData[0].Company;
    this.usercompanyname                = this.usercompanyname.trim();
		this.username                       = inspectionitemstData[0].Name;
    this.username                       = this.username.trim();
    

    this.showform = 0;    

    this.buttonDisabled = true;
    this.allChecked = false;
    this.checkeditems = [];
    this.delitems = [];
    this.totalItems = [];
    this.addcheck = false;
    this.delcheck = false;
    this.formData = [];

    
		var url = Constants.apiUrl+"api/inspectiontemplates/"+this.inspectionitemsApiKey+"/"+this.inspectionitemsSystemProjectID+"/"+this.inspectionitemsUserID+"/"+this.inspectionitemsid+"/"+this.pa5038 ;

		    this.http.get(url).map(res => res.json()).subscribe(data => {
		    this._sanitizer.bypassSecurityTrustStyle(data);
        this.inspectionitemssdata = data; 

        this.template = this.inspectionitemssdata[0].TemplateID;

        var myStringArray = this.inspectionitemssdata;
        var arrayLength   = myStringArray.length;
        for (var i = 0; i < arrayLength; i++) {
          this.itemid = this.inspectionitemssdata[i].ItemID;
          this.totalItems.push(this.itemid);
          console.log("Added: ",this.itemid);
        }
        var  allitemsadded = JSON.stringify(this.totalItems);
        console.log(allitemsadded);               
        console.log("Total Items: ",this.totalItems.length);
		    },
		    err => {
		        console.log("Oops!");
		    }
    ); 
    

        var locationurl = Constants.apiUrl+"api/locationmap/"+this.inspectionitemsApiKey+"/"+this.inspectionitemsSystemProjectID+"/"+this.inspectionitemsUserID+"/"+this.pa5038;


      this.http.get(locationurl).map(res => res.json()).subscribe(data => {
      this._sanitizer.bypassSecurityTrustStyle(data);
      this.locationMaps = data;          
      console.log(this.locationMaps);
      },
      err => {
        console.log("Oops!");
      }
    );  
  

  } 

  locselected(loc){
    if(loc === "No Location Selected"){
      this.buttonDisabled = true; 
    } else {
    this.buttonDisabled = false;
    }
    this.selectedlocation = loc;
    this.allChecked = false;
    console.log("Location = ",this.selectedlocation);
  }


  passClick(template,item){

    console.log(this.checkeditems.length);

      var theItempass1 = item+"pass";
      var theItemfail1 = item+"fail";

      if(document.getElementById(theItempass1).style.color == "black"){

        document.getElementById(theItempass1).style.color = "MediumSeaGreen";
        document.getElementById(theItemfail1).style.color = "black";

        this.checkeditems.push(item);

        for( var i = 0; i < this.delitems.length; i++){     
          if ( this.delitems[i] === item) {     
              this.delitems.splice(i, 1); 
          }   
        } 

        console.log("Checked items P1: ",this.checkeditems);
        console.log("Failed items P1: ",this.delitems);

        this.addcheck = this.checkAllTicked(this.totalItems,this.checkeditems);
        console.log(this.addcheck);

        if (this.addcheck == true) {
          this.allChecked = true;
        } else {
          this.addcheck = false;
        } 
      } 
      else 
      {
        document.getElementById(theItempass1).style.color = "black";

        for( var i = 0; i < this.checkeditems.length; i++){     
          if ( this.checkeditems[i] === item) {     
              this.checkeditems.splice(i, 1); 
          }   
        }
 
  
        //var delarray1 = JSON.stringify(this.checkeditems);
        console.log("Checked items P2: ",this.checkeditems);
        console.log("Failed items P2: ",this.delitems);

        this.delcheck = this.checkAllTicked(this.totalItems,this.checkeditems);
        console.log(this.delcheck);

        if (this.addcheck == true) {
          this.allChecked = true;
        } else {
          this.addcheck = false;
        } 
      }

  // Update the projectformItems
}

failClick(template,item){

  console.log(this.checkeditems.length);

    var theItempass2 = item+"pass";
    var theItemfail2 = item+"fail";

    if(document.getElementById(theItemfail2).style.color == "black"){

      document.getElementById(theItemfail2).style.color = "red";
      document.getElementById(theItempass2).style.color = "black";
      
      this.delitems.push(item);

      for( var i = 0; i < this.checkeditems.length; i++){     
        if ( this.checkeditems[i] === item) {     
            this.checkeditems.splice(i, 1); 
        }   
      }
      //var printarray2 = JSON.stringify(this.delitems);
      console.log("Checked items F1: ",this.checkeditems);
      console.log("Failed items F1: ",this.delitems);     

      this.addcheck = this.checkAllTicked(this.totalItems,this.checkeditems);
      console.log(this.addcheck);

      if (this.addcheck == true) {
        this.allChecked = true;
      } else {
        this.addcheck = false;
      } 
    } 
    else 
    {

      document.getElementById(theItemfail2).style.color = "black";      



      for( var i = 0; i < this.delitems.length; i++){     
        if ( this.delitems[i] === item) {     
            this.delitems.splice(i, 1); 
        }   
      }      

      var delarray1 = JSON.stringify(this.delitems);
      console.log("Del array",delarray1);

      console.log("Checked items F2: ",this.checkeditems);
      console.log("Failed items F2: ",this.delitems);
      
      this.delcheck = this.checkAllTicked(this.totalItems,this.delitems);
      console.log("Del check",this.delcheck);

      if (this.delcheck == true) {
        this.allChecked = true;
      } else {
        this.delcheck = false;
      } 
    }

// Update the projectformItems
}


  sendReport(): void{

    var checkeditems = "";
    var faileditems  = "";

    if(this.checkeditems.length == 0){checkeditems = "ppp"} else {checkeditems = this.checkeditems}; //JSON.stringify(this.checkeditems)}
    if(this.delitems.length     == 0){faileditems  = "fff"} else {faileditems  = this.delitems}

    if(this.selectedlocation != "" && (this.allChecked || this.delcheck )) {

      var formurl = Constants.apiUrl+"api/inspectinform/"+this.inspectionitemsApiKey +"/"+this.clienttID+"/"+this.inspectionitemsSystemProjectID+"/"+this.inspectionitemsUserID+"/"+this.template+"/"+this.selectedlocation+"/"+checkeditems+"/"+faileditems+"/"+this.usercompanyname+"/"+this.username+"/"+this.notes;

      this.http.get(formurl).map(res => res.json()).subscribe(data => {
            this.inspectinform = data;
            console.log(this.inspectinform);
            this.presentToast("Request Complete.");
        },
        err => {
            console.log("Oops! Error sending form data");
            this.presentToast("Request Failled.");
        }
      ); 
      this.dismiss();

    } else {
      this.presentToast("Request Failled - Please complete form.");
    }
  }



  presentToast(msg) {
    const toast =  this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }


  checkAllTicked(a,b){
{
      if (this.totalItems.length !== this.checkeditems.length + this.delitems.length) {
        return false;
      } else {
        return true;
      }
    }

  }

  dismiss() {
      this.viewCtrl.dismiss();
    }
  
}
