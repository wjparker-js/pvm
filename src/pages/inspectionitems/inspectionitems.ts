import { Component, ɵConsole } from '@angular/core';
import { IonicPage,  ModalController, NavController, NavParams, ActionSheetController,ToastController, ViewController } from 'ionic-angular';
import { Http } from '@angular/http';
import * as Constants from '../../providers/constants';
import { DomSanitizer } from '@angular/platform-browser';
import { pipeFromArray } from 'rxjs/util/pipe';
import { AnonymousSubject } from 'rxjs';
import { InspectionModalPage } from '../inspection-modal/inspection-modal';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';

import { ImgEditPage } from '../imgedit/imgedit';
import { NgStyle } from '@angular/common';
import { e } from '@angular/core/src/render3';


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

  inspectionoverallnotes:any;
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
  showlocationlookup:any;  
  pa5038:any;

  lid1:any;
  lid2:any;
  lid3:any;
  lid4:any;

  urllocationlocnames:any;
  FormPlotFlatName:any;
  FormFloorLevelName:any;
  FormFlatTypeName:any;
  FormComponentName:any;

  locationtext:any;
  locationtextdata:any;
  ass:boolean = true;  
  locationMaps:any;
  selectedlocation:string="";

  arrselectedlocation:any;  
  frmData = {notes: ""};
  currentImage: string = null;
  locationimage:any;
  ParentFormID:any;  

  itemnotes: string = "";
  formid:any;
  imageroot:string = "https://projectvaultuk.com/PublicPics/inspectionimages/";
  overallphoto:string = "";
  reportImage:any;

  divOpen:boolean = false;
  isOpened:boolean = false;
  requestid:any;
  passOrfail:string = "";  

  overallimg1:string = "";
  overallimg2:string = "";
  overallimg3:string = "";
  openedDiv:any;

  location1:any;
  location2:any;
  location3:any;
  location4:any;

  locnamepart1:  string = "";
  locnamepart2:  string = "";
  locnamepart3:  string = "";
  locnamepart4:  string = "";

  locationpart1: string = "null";
  locationpart2: string = "null";
  locationpart3: string = "null";
  locationpart4: string = "null";

  updataO1:any;
  updataO2:any;
  updataO3:any;

  buttonIcon: string = "Arrow-Down";
  valuation: any;  
	image: string = null;
  divLock: boolean = true;
  reportimagea:any;

  who:any;
  hasFailedItem:boolean = false;

  notes1:any;
  notes2:any;
  notes3:any;
  notes4:any;
  notes5:any;
  notes6:any;
  notes7:any;
  notes8:any;
  notes9:any;
  notes10:any;
  notes11:any;
  notes12:any;
  notes13:any;
  notes14:any;
  notes15:any;
  notes16:any;
  notes17:any;
  notes18:any;
  notes19:any;
  notes20:any;

  temp:any;

  // Initalial values.
  newItem: string = "";
  newStr: string = "";
  toggleNew: boolean = true;
  todos: any [];
  todosnotes: any [];
  notescount:any;
  reportOverallImage :any;


  frmData1 = {notes:"", onotes1:"", onotes2:"", onotes3:"", notes1:"", notes2:"", notes3:"", notes4:"", notes5:"", notes6:"",  notes7:"", notes8:"", notes9:"",  notes10:"", notes11:"", notes12:"",  notes13:"", notes14:"", notes15:"",  notes16:"", notes17:"", note18:"",  notes19:"", notes20:"", notes21:"",  notes22:"", notes23:"", notes24:"",  notes25:"", notes26:"", notes27:"",  notes28:"", notes29:"", notes30:"",   details: ""};

	constructor(
    public navCtrl: NavController, 
    private toastCtrl:ToastController, 
    private _sanitizer: DomSanitizer, 
    public viewCtrl: ViewController, 
    public modalController: ModalController,    
		public actionSheetCtrl: ActionSheetController, 
    public navParams: NavParams, 
		public camera: Camera,
		public file: File,
		public filePath: FilePath,
    public http: Http) {
  }

  ionViewWillEnter(): void {           
    
    this.todos =[];
    this.todosnotes =[];
    this.notescount = 0;
      
    var inspectionitemstData = JSON.parse(localStorage.getItem('userSystemData')); 
 
    this.ParentFormID        = this.navParams.get('ParentFormID');    
    this.requestid           = this.navParams.get('requestid');
    this.inspectionitemsid   = this.navParams.get('requestid');	
    this.lid1                = this.navParams.get('lid1');	 
    this.lid2                = this.navParams.get('lid2');	 
    this.lid3                = this.navParams.get('lid3');	 
    this.lid4                = this.navParams.get('lid4');
    this.temp                = this.navParams.get('template');	 
    this.who                 = this.navParams.get('who');	 

    if(this.temp == 0 && this.who == "sub"){this.temp = "sub";} 
    if(this.temp == 1 && this.who == "subi"){this.temp = "subi";} 
    if(this.temp == 1 && this.who >= "ins"){this.temp = "ins";}

    console.log("this.temp  ",this.temp);

    if(this.lid1 == undefined){this.lid1 = "NULL"}
    if(this.lid2 == undefined){this.lid2 = "NULL"}
    if(this.lid3 == undefined){this.lid3 = "NULL"}
    if(this.lid4 == undefined){this.lid4 = "NULL"}

    localStorage.setItem('overallimg1', '');
    localStorage.setItem('overallimg2', '');
    localStorage.setItem('overallimg3', '');
    localStorage.setItem('reportImage', '');

    this.pa5038                         = localStorage.getItem('Role-PA5038');
    this.inspectionitemsSystemProjectID = localStorage.getItem('CurrentProjectID');
    this.clienttID                      = localStorage.getItem('CurrentProjectClientID'); 

    this.inspectionitemsApiKey          = inspectionitemstData[0].apiKey;
    this.inspectionitemsUserID          = inspectionitemstData[0].SystemUserID;
    this.inspectionitemsUserID          = this.inspectionitemsUserID.trim();
    this.usercompanyname                = inspectionitemstData[0].Company;
    this.usercompanyname                = encodeURI(this.usercompanyname.trim());
    this.username                       = inspectionitemstData[0].Name;
    this.username                       = encodeURI(this.username.trim()); 

    this.arrselectedlocation            = [];
    this.selectedlocation               = "";
    this.notes                          = "";
    this.buttonDisabled                 = true;
    this.allChecked                     = false;
    this.checkeditems                   = [];
    this.delitems                       = [];
    this.totalItems                     = [];
    this.addcheck                       = false;
    this.delcheck                       = false;
    this.formData                       = [];

    if(this.temp == "sub"){
      var url = Constants.apiUrl+"api/inspectiontemplates/"+this.inspectionitemsApiKey+"/"+this.inspectionitemsSystemProjectID+"/"+this.inspectionitemsUserID+"/"+this.username+"/"+this.usercompanyname+"/"+this.requestid+"/"+this.temp;
    } else {
      var url = Constants.apiUrl+"api/inspectiontemplates/"+this.inspectionitemsApiKey+"/"+this.inspectionitemsSystemProjectID+"/"+this.inspectionitemsUserID+"/"+this.username+"/"+this.usercompanyname+"/"+this.inspectionitemsid+"/"+this.temp;
    } 
    this.http.get(url).map(res => res.json()).subscribe(data => {
      this._sanitizer.bypassSecurityTrustStyle(data);
      this.inspectionitemssdata = data;
      if (data.length > 0) {
        console.log("this.inspectionitemssdata: ",this.inspectionitemssdata);
      if(this.inspectionitemssdata[0].Template != null){
        this.template = this.inspectionitemssdata[0].Template;
        this.locationtext = this.inspectionitemssdata[0].LocationText;
      } else {this.template = ""}
        this.formid             = this.inspectionitemssdata[0].FormID;      
        this.showlocationlookup = this.inspectionitemssdata[0].Template;
        this.getOnotes(this.formid);
      }          

/*
      var locationurl = Constants.apiUrl+"api/locationmap/"+this.inspectionitemsApiKey+"/"+this.inspectionitemsSystemProjectID+"/"+this.inspectionitemsUserID+"/"+this.pa5038;
      this.http.get(locationurl).map(res => res.json()).subscribe(data => {
        this._sanitizer.bypassSecurityTrustStyle(data);
        this.locationMaps = data;  
        if (data.length > 0) {
          //this.locationtext = this.locationMaps[0].LocationText;
          //this.selectedlocation = this.locationMaps[0].LocationText;
          console.log("this.locationtext xxx  ",this.locationtext);
          } else {
            this.locationtext = "No Data ";
            this.selectedlocation = "No Data ";
          } 
        console.log("locationMaps  ",this.locationMaps);      
        },
        err => {
          console.log("Oops!");
        }
      ); 
*/

      //if(this.showlocationlookup == 1){
      var urlloctext = Constants.apiUrl+"api/locationtext/"+this.inspectionitemsApiKey+"/"+this.inspectionitemsSystemProjectID+"/"+this.lid1+"/"+this.lid2+"/"+this.lid3+"/"+this.lid4;    
      this.http.get(urlloctext).map(res => res.json()).subscribe(data => {
      this._sanitizer.bypassSecurityTrustStyle(data);
      this.locationtextdata = data;
      if (data.length > 0) {
      //this.locationtext = this.locationtextdata[0].name;
      this.selectedlocation = this.locationtextdata[0].name;
      console.log("this.locationtext   ",this.locationtext);
      } else {
        //this.locationtext = "No Data Available";
        this.selectedlocation = "No Data Available";
      }      
      }, err => {console.log("Oops! Error getting location data");}
      ); 


      // Location custom names
      var urllocationlocname = Constants.apiUrl+"api/locationlocnames/"+this.inspectionitemsApiKey+"/"+this.inspectionitemsSystemProjectID;    
      this.http.get(urllocationlocname).map(res => res.json()).subscribe(data => {
        this._sanitizer.bypassSecurityTrustStyle(data);
        this.urllocationlocnames = data;
        if (data.length > 0) {
          this.FormPlotFlatName   = this.urllocationlocnames[0].FormPlotFlatName;
          this.FormFloorLevelName = this.urllocationlocnames[0].FormFloorLevelName;
          this.FormFlatTypeName   = this.urllocationlocnames[0].FormFlatTypeName;
          this.FormComponentName  = this.urllocationlocnames[0].FormComponentName;
        }     
      }, err => {console.log("Oops! Error getting location data");}
      ); 


      // Locations lookups
      var urlloctext1 = Constants.apiUrl+"api/locationparts/"+this.inspectionitemsApiKey+"/"+this.inspectionitemsSystemProjectID+"/location1";    
      this.http.get(urlloctext1).map(res => res.json()).subscribe(data => {
      this._sanitizer.bypassSecurityTrustStyle(data);
      this.location1 = data;
      }, err => {console.log("Oops! Error getting location data");}); 
      
      var urlloctext2 = Constants.apiUrl+"api/locationparts/"+this.inspectionitemsApiKey+"/"+this.inspectionitemsSystemProjectID+"/location2";    
      this.http.get(urlloctext2).map(res => res.json()).subscribe(data => {
      this._sanitizer.bypassSecurityTrustStyle(data);
      this.location2 = data;
      }, err => {console.log("Oops! Error getting location data");}); 

      var urlloctext3 = Constants.apiUrl+"api/locationparts/"+this.inspectionitemsApiKey+"/"+this.inspectionitemsSystemProjectID+"/location3";    
      this.http.get(urlloctext3).map(res => res.json()).subscribe(data => {
      this._sanitizer.bypassSecurityTrustStyle(data);
      this.location3 = data;
      }, err => {console.log("Oops! Error getting location data");}); 

      var urlloctext4 = Constants.apiUrl+"api/locationparts/"+this.inspectionitemsApiKey+"/"+this.inspectionitemsSystemProjectID+"/location4";    
      this.http.get(urlloctext4).map(res => res.json()).subscribe(data => {
      this._sanitizer.bypassSecurityTrustStyle(data);
      this.location4 = data;
      }, err => {console.log("Oops! Error getting location data");}); 


      // passed and failed
      var myStringArray = this.inspectionitemssdata;
      var arrayLength   = myStringArray.length;

      for (var i = 0; i < arrayLength; i++) {

        this.itemid = this.inspectionitemssdata[i].ItemID;

        this.totalItems.push(this.itemid);

        if(this.inspectionitemssdata[i].Check2 == 1){
          this.checkeditems.push(this.itemid);
        }
        if(this.inspectionitemssdata[i].Check2 == 0){          
          this.delitems.push(this.itemid);
        }        
      }

      var  allitemsadded = JSON.stringify(this.totalItems);

    }, err => {console.log("Oops! Error reading template data");}
    ); 

    
  } 


// Saving function
saveNew( newItem: string, newStr: string ): void {
  this.todos.push(newItem);
  this.todosnotes.push(newStr);
  this.toggleNew = false;
  this.newItem = "";
  this.newStr = "";
}


right(str, chr) {
  return str.slice(str.length-chr,str.length);
}
 
left(str, chr) {
  return str.slice(0, chr - str.length);
}


sendOverallPhotoData(){

  this.notescount++;

  var upurl           = "https://pvmobile.online/iuploadoverallphotdata.php";
  var OverallImageurl = "https://projectvaultuk.com/publicpics/inspectionimages/";

  var urlstr = this.left(this.requestid,33);
  var itemcount = this.right("000"+this.notescount,3);
  var imgviewurl = OverallImageurl+urlstr+itemcount+".jpg";

  //var imgviewurl1 = urlstr+itemcount;
  //var newurl = localStorage.getItem('reportOverallImage');
  //localStorage.setItem(imgviewurl1,newurl);


  const formData = new FormData();	

  formData.append('count', this.notescount);
  formData.append('photo', this.reportOverallImage);
  formData.append('notes', this.frmData1.onotes1);
  formData.append('templateid', this.requestid);    
  formData.append('uid', this.inspectionitemsUserID);

  this.http.post(upurl,formData).map(res => res.json()).subscribe(data => {
        this.updata = data;
        console.log(data);
    },err => {console.log("Error Uploading sendPhotoData error.")}); 


  this.todos.push(imgviewurl);
  if(this.frmData1.onotes1 == ''){this.frmData1.onotes1 = 'No Notes.'}
  this.todosnotes.push(this.frmData1.onotes1);

  console.log("todos: ",this.todos);

  this.toggleNew = false;
  this.newItem = "";
  this.newStr = "";
  this.frmData1.onotes1 = "";
  localStorage.setItem('reportOverallImage','');

  this.presentToast("Image and data uploaded.")
}


takeOverallPhoto() {
 
  var OverallImageurl = "https://projectbaultuk.com/publicpics/handover/overallimages";

  let options = {
    quality: 50,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
    targetWidth: 400,
    targetHeight: 400,
    cameraDirection   : 0,
    correctOrientation: true,
    saveToPhotoAlbum: false
  };                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               

  this.camera.getPicture(options).then(imageData => {
    var base = 'data:image/jpg;base64,' + imageData;
    localStorage.setItem('reportOverallImage', base);
    this.reportOverallImage = localStorage.getItem('reportOverallImage');    
  },
  err => {
    console.log(err);
  }
);
}




  getOnotes(theformid){

    var inspectionoverallnotesurl = Constants.apiUrl+"api/inspectionoverallnotes/"+this.inspectionitemsApiKey+"/"+theformid;
    this.http.get(inspectionoverallnotesurl).map(res => res.json()).subscribe(data => {
      this._sanitizer.bypassSecurityTrustStyle(data);
      this.inspectionoverallnotes = data;  
      
      //this.overallimg1 = Constants.publicUploadPath+"inspectionimages"+"/"+this.formid+"/"+this.formid+"1.jpg";
      //console.log("overallimg1:  ",this.overallimg1);
      //var onotes = [this.frmData1.onotes1,this.frmData1.onotes2,this.frmData1.onotes3];
      //var oimages= [this.overallimg1,this.overallimg2,this.overallimg3];

      if (data.length > 0) {
      var overallimg1 = Constants.publicUploadPath+"inspectionimages/"+this.formid+"/"+this.formid+"1.jpg";
      this.imageResolves1(overallimg1);
      this.frmData1.onotes1 = this.inspectionoverallnotes[0].note;
      }
      
      /*if (data.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          onotes[i]  = this.inspectionoverallnotes[i].Note;
          //oimages[i] = this.inspectionoverallnotes[i].Image;
        }
      }*/
     
      },
      err => {
        console.log("Oops!");
      }
    );  


  }

  takePhoto(itemid,template,click,noteno) {

    console.log("itemid  ",itemid);
    console.log("template  ",template);
    console.log("click  ",click);
    console.log("noteno  ",noteno);
    console.log("coming here");

    let options = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 400,
      targetHeight: 400,
      cameraDirection   : 0,
      correctOrientation: true,
      saveToPhotoAlbum: false
    };

    this.camera.getPicture(options).then(
    imageData => {

      var base = 'data:image/jpg;base64,' + imageData;

      if(click == "clickitem"){
        console.log("clickitem = ", click);
        localStorage.setItem('reportImage', base);
        this.reportImage = localStorage.getItem('reportImage');
      }
      if(click == "overall1"){
        console.log("overall1 = ", click);
        localStorage.setItem("overallimg1", base);
        this.overallimg1 = localStorage.getItem('overallimg1');
      }
      if(click == "overall2"){
        console.log("overall2 = ", click);
        localStorage.setItem("overallimg2", base);
        this.overallimg2 = localStorage.getItem('overallimg2');
      }
      if(click == "overall3"){
        console.log("overall3 = ", click);
        localStorage.setItem("overallimg3", base);
        this.overallimg3 = localStorage.getItem('overallimg3');
      }      
    },
    err => {
      console.log(err);
    }
  );
  }


  sendPhotoData(itemid,template,number,click,noteno){

    console.log(itemid);
    console.log(template);
    console.log(number);
    console.log("sendPhotoData");

    var itemOpen = itemid+"open";

    var upurl = "https://pvmobile.online/iuploadphotodata.php";

    const formData = new FormData();	

    if(click == "clickitem"){
      formData.append('type', 'clickitem');
      formData.append('photo', this.reportImage);
      formData.append('notes', this.frmData1.notes);  //this.frmData1.notes
    }

    if(click == "overall1"){
      formData.append('type', 'overall1');
      formData.append('photo', this.overallimg1);
      formData.append('notes', this.frmData1.onotes1);
    }

    if(click == "overall2"){
      formData.append('type', 'overall2');
      formData.append('photo', this.overallimg2);
      formData.append('notes', this.frmData1.onotes2);
    }

    if(click == "overall3"){
      formData.append('type', 'overall3');
      formData.append('photo', this.overallimg3);
      formData.append('notes', this.frmData1.onotes3);
    }

    if(noteno == "x"){
      formData.append('item', 'NA');
    } else {
      formData.append('item', noteno);
    }

    formData.append('itemid', itemid);
    formData.append('templateid', template);    
    formData.append('passorfail', this.passOrfail);      
    formData.append('uid', this.inspectionitemsUserID);
    formData.append('valuation', this.valuation);  

    this.http.post(upurl,formData).map(res => res.json()).subscribe(data => {
          this.updata = data;
          console.log(data);
      },err => {console.log("Error Uploading sendPhotoData error.")}); 


    if(click == "clickitem"){
      document.getElementById("div"+itemid).style.display="none";
      this.frmData1.notes = "";
      document.getElementById(itemOpen).style.color = "Blue";
      this.reportImage = null;
      localStorage.setItem('reportImage','');
      this.passOrfail  = "";
      this.isOpened    = false;
      this.openedDiv   = "";
    }

    if(click == "overall1"){
      document.getElementById("thumbs1").style.color = "Blue";
    }
    
    if(click == "overall2"){
      document.getElementById("thumbs2").style.color = "Blue";
    }
    
    if(click == "overall3"){
      document.getElementById("thumbs3").style.color = "Blue";
    }

    this.presentToast("Image and data uploaded.")
  }


  setStars(item,position){
    //console.log("position: ",position);
    var star="";
    var newposition = position+1;
    this.valuation  = position;

    for (let i = 1; i < 6; i++) {
      star = item+i;
      document.getElementById(star).style.color = "#c8c8c8";
      //console.log("Clear: ",star);
    }

    for (let i = 1; i <= position; i++) {
      star = item+i;
      document.getElementById(star).style.color = "orange";
      //console.log("Orange ",star);
    }
  }

  openUp(item,value,notes){
    var thisdiv1 = "div"+item;
    if(document.getElementById(thisdiv1).style.display == "block"){
      document.getElementById(thisdiv1).style.display   = "none"; 
    } else {
      document.getElementById(thisdiv1).style.display   = "block"; 
      this.frmData1.notes = notes;
      this.setStars(item,value);   
      var reportUrl1 = Constants.publicUploadPath+"inspectionimages"+"/"+this.formid+"/"+item+".jpg";
      this.imageResolves(reportUrl1); 
    }
  }

  passClick1(item){
    
    var theItempass1 = item+"pass";
    var thisdiv1     = "div"+item;

      if(document.getElementById(theItempass1).style.color == "black"){
        document.getElementById(theItempass1).style.color = "MediumSeaGreen";
        this.checkeditems.push(item);
        for( var i = 0; i < this.delitems.length; i++){     
          if ( this.delitems[i] === item) {     
              this.delitems.splice(i, 1); 
          }   
        }
        this.addcheck = this.checkAllTicked(this.totalItems,this.checkeditems); 
        if (this.addcheck == true) {
          this.allChecked = true;
        } else {
          this.allChecked = false;
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
        this.delcheck = this.checkAllTicked(this.totalItems,this.checkeditems); 
        if (this.addcheck == true) {
          this.allChecked = true;
        } else {
          this.allChecked = false;
      } 
    }
  }

  passClick(item,value,notes){

    var theItempass1 = item+"pass";
    var theItemfail1 = item+"fail";
    var thisdiv1     = "div"+item;

    if(this.isOpened == false){

      this.isOpened    = true;
      this.openedDiv   = thisdiv1;
      this.passOrfail  = "pass";
      
      if(document.getElementById(theItempass1).style.color == "black" || document.getElementById(theItempass1).style.color == "mediumseagreen"){
        
        document.getElementById(theItempass1).style.color = "mediumseagreen";
        document.getElementById(theItemfail1).style.color = "black";
        document.getElementById(thisdiv1).style.display   = "block"; 

        this.frmData1.notes = notes;
        this.setStars(item,value);  
        this.checkeditems.push(item);

        var reportUrl1 = Constants.publicUploadPath+"inspectionimages"+"/"+this.formid+"/"+item+".jpg";
        this.imageResolves(reportUrl1);
        
        for( var i = 0; i < this.delitems.length; i++){     
          if ( this.delitems[i] === item) {     
              this.delitems.splice(i, 1); 
          }   
        }

        this.addcheck = this.checkAllTicked(this.totalItems,this.checkeditems); 
        if (this.addcheck == true) {
          this.allChecked = true;
        } else {
          this.allChecked = false;
        } 
                         
        //var reportUrl = Constants.publicUploadPath+"inspectionimages"+"/"+this.formid+"/"+item+".jpg";
        //this.imageResolves(reportUrl);
        
        //this.reportImage = Constants.publicUploadPath+"inspectionimages/noimage.jpg";
        //console.log("repimg:  ",this.reportImage);

      } 
      /*(else if(document.getElementById(theItempass1).style.color == "mediumseagreen"){
          this.frmData1.notes = notes;
          this.setStars(item,value);
          var reportUrl1 = Constants.publicUploadPath+"inspectionimages"+"/"+this.formid+"/"+item+".jpg";
          this.imageResolves(reportUrl1);
          document.getElementById(thisdiv1).style.display   = "block";
      }*/
    }
    else 
    {
      if(this.isOpened == true && this.openedDiv == thisdiv1){

        this.passOrfail  = "pass";
        this.isOpened    = false;
        this.openedDiv   = "";

        if(document.getElementById(theItempass1).style.color == "mediumseagreen"){
          document.getElementById(thisdiv1).style.display   = "none";          
          document.getElementById(theItemfail1).style.color = "black";
        
          /*for( var i = 0; i < this.checkeditems.length; i++){     
            if ( this.checkeditems[i] === item) {     
                this.checkeditems.splice(i, 1); 
            }   
          }*/
          this.addcheck = this.checkAllTicked(this.totalItems,this.checkeditems); 
          if (this.addcheck == true) {
            this.allChecked = true;
          } else {
            this.allChecked = false;
          } 
        }        
      } 
    }   
  }

  failClick(item,value,notes){

      var theItempass2 = item+"pass";
      var theItemfail2 = item+"fail";
      var thisdiv2     = "div"+item;  
    
      this.hasFailedItem = true;

      if(this.isOpened == false){

        this.isOpened    = true;
        this.openedDiv   = thisdiv2;
        this.passOrfail  = "fail";

        if(document.getElementById(theItemfail2).style.color == "black" || document.getElementById(theItemfail2).style.color == "red"){
          
          document.getElementById(theItemfail2).style.color = "red";
          document.getElementById(theItempass2).style.color = "black";  
          document.getElementById(thisdiv2).style.display   = "block"; 

          this.frmData1.notes = notes;
          this.setStars(item,value);  
          this.delitems.push(item);     

          var reportUrl2 = Constants.publicUploadPath+"inspectionimages"+"/"+this.formid+"/"+item+".jpg";
          this.imageResolves(reportUrl2);     

          for( var i = 0; i < this.checkeditems.length; i++){     
            if ( this.checkeditems[i] === item) {     
                this.checkeditems.splice(i, 1); 
            }   
          }

          this.addcheck = this.checkAllTicked(this.totalItems,this.checkeditems); 
          if (this.addcheck == true) {
            this.allChecked = true;
           } else {
            this.allChecked = false;
          }  
  
          //var reportUrlf = Constants.publicUploadPath+"inspectionimages"+"/"+this.formid+"/"+item+".jpg";
          //this.imageResolves(reportUrlf);
  
        } 
        /*else if (document.getElementById(theItemfail2).style.color == "red"){
          this.frmData1.notes = notes;
          this.setStars(item,value);
          var reportUrlf1 = Constants.publicUploadPath+"inspectionimages"+"/"+this.formid+"/"+item+".jpg";
          this.imageResolves(reportUrlf1);
          document.getElementById(thisdiv2).style.display   = "block";
        }*/
      }
      else 
      {
        if(this.isOpened == true && this.openedDiv == thisdiv2){

          this.passOrfail  = "fail";
          this.isOpened    = false;
          this.openedDiv   = "";

          if(document.getElementById(theItemfail2).style.color == "red"){
            document.getElementById(thisdiv2).style.display   = "none";         
            document.getElementById(theItempass2).style.color = "black";
   
            /*for( var i = 0; i < this.delitems.length; i++){     
              if ( this.delitems[i] === item) {     
                  this.delitems.splice(i, 1); 
              }   
            }*/

            this.addcheck = this.checkAllTicked(this.totalItems,this.checkeditems); 
            if (this.addcheck == true) {
              this.allChecked = true;
            } else {
              this.allChecked = false;
            }
        }
      }
    }  
  }
      



  
  imageResolves(image_url){
    var request = new XMLHttpRequest();
    try {
      request.open('HEAD', image_url, false);
      request.send();
    } catch(error){
      this.reportImage = Constants.publicUploadPath+"inspectionimages/noimage.jpg";
      return false;
    }
      this.reportImage = image_url;
      return request.status === 200;
  }

  imageResolves1(image_url){
    var request = new XMLHttpRequest();
    try {
      request.open('HEAD', image_url, false);
      request.send();
    } catch(error){
      this.overallimg1 = Constants.publicUploadPath+"inspectionimages/noimage.jpg";
      return false;
    }
      console.log("image url:  ",image_url);
      this.overallimg1 = image_url;
      return request.status === 200;
  }

  sendReport(){

    var checked = "";
    var failed  = "";

    if(this.checkeditems.length == 0){checked = "ppp"} else {checked = this.checkeditems} //JSON.stringify(this.checkeditems)}
    if(this.delitems.length     == 0){failed  = "fff"} else {failed  = this.delitems}

    var builslocname = this.locnamepart1+"-"+this.locnamepart2+"-"+this.locnamepart3+"-"+this.locnamepart4+"!";
    var buildlocduid = this.locationpart1+"!"+this.locationpart2+"!"+this.locationpart3+"!"+this.locationpart4;
    this.selectedlocation = builslocname+buildlocduid;
    this.locationtext = builslocname;

      if(this.selectedlocation != "") {

        if(this.showlocationlookup == 0){  
          var formurl = Constants.apiUrl+"api/inspectinform/"+this.inspectionitemsApiKey +"/"+this.clienttID+"/"+this.inspectionitemsSystemProjectID+"/"+this.inspectionitemsUserID+"/"+this.requestid+"/"+this.selectedlocation+"/"+checked+"/"+failed+"/"+this.usercompanyname+"/"+this.username+"/"+this.showlocationlookup+"/Nonotes"; //+this.frmData1.details;
          console.log("Sending overall Data");
          this.http.get(formurl).map(res => res.json()).subscribe(data => {
            //this.inspectinform = data;
            //this.presentToast("Request Complete.");
          },
          err => {console.log("Error sending subby sendReport data");}
          );
        } 
        
        if(this.showlocationlookup == 1){ 
          console.log("sending inspector");
          var formurl1 = Constants.apiUrl+"api/inspectinform/"+this.inspectionitemsApiKey +"/"+this.clienttID+"/"+this.inspectionitemsSystemProjectID+"/"+this.inspectionitemsUserID+"/"+this.ParentFormID+"/"+this.selectedlocation+"/"+checked+"/"+failed+"/"+this.usercompanyname+"/"+this.username+"/"+this.showlocationlookup+"/Nonotes"; //+this.frmData1.details;
          console.log("Sending overall Data");
            this.http.get(formurl1).map(res => res.json()).subscribe(data => {
              //this.inspectinform = data;
              //this.presentToast("Request Complete.");
            },
            err => {console.log("Error sending inspector sendReport data");}    
          );  
        }       

        this.dismiss();

      } else {
        this.presentToast("Request Failled - Please complete form.");
      }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
  }

  cancelitem(number,template,item,value,notes){                                                                             
    this.failClick(                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              item,value,notes);
  }

  presentToast(msg) {
    const toast =  this.toastCtrl.create({
      message: msg,
      duration: 1000,
      position: 'bottom'
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

  locselected(location){
    if(location == "No Location Selected"){
      this.buttonDisabled = true; 
    } else {
      this.buttonDisabled = false;
    }
    this.selectedlocation = location;
    this.locationtext =  location;
    this.allChecked = false;
  }

  loc1selected(location){
    var locp1pos = location.indexOf("-");
    var locp1len = location.length;
    this.locnamepart1  = location.substring(0,locp1pos);
    this.locationpart1 = location.substring(locp1len - 36);     

    console.log("locp11  ",this.locnamepart1);
    console.log("locp12  ",this.locationpart1);

    //this.selectedlocation = location;
    //this.locationtext =  location;
    //this.allChecked = false;
  }

  loc2selected(location){
    var locp2pos = location.indexOf("-");
    var locp2len = location.length;
    this.locnamepart2 = location.substring(0,locp2pos);
    this.locationpart2 = location.substring(locp2len - 36);

    console.log("locp21  ",this.locnamepart2);
    console.log("locp22  ",this.locationpart2);

    //this.selectedlocation = location;
    //this.locationtext =  location;
    //this.allChecked = false;
  }

  loc3selected(location){
    var locp3pos = location.indexOf("-");
    var locp3len = location.length;
    this.locnamepart3 = location.substring(0,locp3pos);
    this.locationpart3 = location.substring(locp3len - 36);

    console.log("locp31  ",this.locnamepart3);
    console.log("locp32  ",this.locationpart3);

    //this.selectedlocation = location;
    //this.locationtext =  location;
    //this.allChecked = false;
  }

  loc4selected(location){
    var locp4pos = location.indexOf("-");
    var locp4len = location.length;
    this.locnamepart4 = location.substring(0,locp4pos);
    this.locationpart4 = location.substring(locp4len - 36);

    console.log("locp41  ",this.locnamepart4);
    console.log("locp42  ",this.locationpart4);

    //this.selectedlocation = location;
    //this.locationtext =  location;
    //this.allChecked = false;
  }

  closeDiv(itemid){
    document.getElementById("div"+itemid).style.display="none";
    this.isOpened = false;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  
}

/*

  openClick1(itemid){

    var thisdiv = "div"+itemid;

    if(thisdiv == this.openedDiv || this.isOpened == false){
      if(document.getElementById(thisdiv).style.display == "none"){
        document.getElementById(thisdiv).style.display = "block";
        this.openedDiv = thisdiv;
        this.isOpened = true;
      } else {      
        document.getElementById(thisdiv).style.display = "none";
        this.isOpened = false;
        this.openedDiv = "";
      }
    }
  }

  showDiv(id){
    console.log("Show Div", id);
    document.getElementById(id).style.display = "block";
  }

  openClick(itemid){

    var thisdiv = "div"+itemid;
    var divicon = itemid+"open";

    if(document.getElementById(thisdiv).style.display == "none"){
      document.getElementById(thisdiv).style.display = "block";
      this.isOpened = false;
    } else {      
      document.getElementById(thisdiv).style.display = "none";      
      this.isOpened = true;
    }
  }


  private addimage(add,itemid,template){
    if(add === "add"){
      this.presentActionSheet(itemid,template);
    } else {
      //this.navCtrl.push(ImgEditPagePre, {callback:this.myCallbackFunction8});
    }
  }
  public presentActionSheet(itemid,template) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            //this.takePhoto(itemid,template)
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            //this.takePhoto(itemid,template)
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }
	private takePicture(from_camera) {
		return new Promise((resolve, reject) => {
      let options = {
        quality           : 50,
        allowEdit         : true,
        saveToPhotoAlbum  : true,
        cameraDirection   : 0,
        correctOrientation: true,
        targetWidth       : 500,
        targetHeight      : 500,
        sourceType        : from_camera ? this.camera.PictureSourceType.CAMERA : this.camera.PictureSourceType.PHOTOLIBRARY,
        destinationType   : this.camera.DestinationType.DATA_URL,
        encodingType      : this.camera.EncodingType.JPEG
      };
      this.camera.getPicture(options).then(
        (image) => resolve( 'data:image/jpg;base64,' + image),
        () => reject()			
      );
		});		
	}
*/
