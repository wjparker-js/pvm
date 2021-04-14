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

  updataO1:any;
  updataO2:any;
  updataO3:any;
  buttonIcon: string = "Arrow-Down";
  valuation: any;
  
	image: string = null;
  divLock: boolean = true;
  reportimagea:any;

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
      
    var inspectionitemstData = JSON.parse(localStorage.getItem('userSystemData')); 

    //this.frmData1.notes = "A test";
    
    this.ParentFormID        = this.navParams.get('ParentFormID');    
    this.requestid           = this.navParams.get('requestid');
    this.overallimg1         = "";
    this.overallimg2         = "";
    this.overallimg3         = "";
    this.valuation           = 3;
    this.inspectionitemsid   = this.navParams.get('requestid');	
    this.lid1                = this.navParams.get('lid1');	 
    this.lid2                = this.navParams.get('lid2');	 
    this.lid3                = this.navParams.get('lid3');	 
    this.lid4                = this.navParams.get('lid4');

    if(this.lid1 == undefined){this.lid1 = "NULL"}
    if(this.lid2 == undefined){this.lid2 = "NULL"}
    if(this.lid3 == undefined){this.lid3 = "NULL"}
    if(this.lid4 == undefined){this.lid4 = "NULL"}

    localStorage.setItem('overallimg1', '');
    localStorage.setItem('overallimg2', '');
    localStorage.setItem('overallimg3', '');
    localStorage.setItem('reportImage', '');

    this.pa5038                         = localStorage.getItem('Role-PA5038');
    this.arrselectedlocation            = [];
    this.selectedlocation               = "";
    this.notes                          = "No notes...";
    this.inspectionitemsSystemProjectID = localStorage.getItem('CurrentProjectID');
    this.clienttID                      = localStorage.getItem('CurrentProjectClientID');    
    this.inspectionitemsApiKey          = inspectionitemstData[0].apiKey;
    this.inspectionitemsUserID          = inspectionitemstData[0].SystemUserID;
    this.inspectionitemsUserID          = this.inspectionitemsUserID.trim();
    this.usercompanyname                = inspectionitemstData[0].Company;
    this.usercompanyname                = this.usercompanyname.trim();
    this.username                       = inspectionitemstData[0].Name;
    this.username                       = this.username.trim();    
    this.buttonDisabled                 = true;
    this.allChecked                     = false;
    this.checkeditems                   = [];
    this.delitems                       = [];
    this.totalItems                     = [];
    this.addcheck                       = false;
    this.delcheck                       = false;
    this.formData                       = [];
      
    var url = Constants.apiUrl+"api/inspectiontemplates/"+this.inspectionitemsApiKey+"/"+this.inspectionitemsSystemProjectID+"/"+this.inspectionitemsUserID+"/"+this.inspectionitemsid;
    this.http.get(url).map(res => res.json()).subscribe(data => {
      this._sanitizer.bypassSecurityTrustStyle(data);
      this.inspectionitemssdata = data;
      if (data.length > 0) {
      if(this.inspectionitemssdata[0].Template != null){
        this.template = this.inspectionitemssdata[0].Template;
      } else {this.template = ""}
      this.formid   = this.inspectionitemssdata[0].FormID;      
      this.showlocationlookup = this.inspectionitemssdata[0].Template;
      }
      
      this.getOnotes(this.formid);      
      
      if(this.showlocationlookup == 1){
        var urlloctext = Constants.apiUrl+"api/locationtext/"+this.inspectionitemsApiKey+"/"+this.inspectionitemsSystemProjectID+"/"+this.lid1+"/"+this.lid2+"/"+this.lid3+"/"+this.lid4;    
        this.http.get(urlloctext).map(res => res.json()).subscribe(data => {
        this._sanitizer.bypassSecurityTrustStyle(data);
        this.locationtextdata = data;
        if (data.length > 0) {
        this.locationtext = this.locationtextdata[0].name;
        this.selectedlocation = this.locationtextdata[0].name;
        } else {
          this.locationtext = "No Data Available";
          this.selectedlocation = "No Data Available";
        }      
        },
        err => {
            console.log("Oops! Error getting location data");
        }); 
      }

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
        if(this.inspectionitemssdata[i].Check2 != 1 && this.inspectionitemssdata[i].Check2 != 0){}

        console.log("this.totalItems  ",this.totalItems);
        console.log("this.checkeditems  ",this.checkeditems);
        console.log("this.delitems  ",this.delitems);
      }

      var  allitemsadded = JSON.stringify(this.totalItems);

    },
      err => {
          console.log("Oops! Error reading template data");
    }); 

    var locationurl = Constants.apiUrl+"api/locationmap/"+this.inspectionitemsApiKey+"/"+this.inspectionitemsSystemProjectID+"/"+this.inspectionitemsUserID+"/"+this.pa5038;
    this.http.get(locationurl).map(res => res.json()).subscribe(data => {
      this._sanitizer.bypassSecurityTrustStyle(data);
      this.locationMaps = data;        
      },
      err => {
        console.log("Oops!");
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
      var overallimg1      = Constants.publicUploadPath+"inspectionimages/"+this.formid+"/"+this.formid+"1.jpg";
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

    var star="";
    var newposition = position+1;
    this.valuation  = position;

      for (let i = 1; i < 6; i++) {
        star = item+i;
        document.getElementById(star).style.color = "#c8c8c8";
      }

      for (let i = 1; i <= position; i++) {
        star = item+i;
        document.getElementById(star).style.color = "orange";
      }
  }


  passClick1(itemnumber,template,item,value,notes){
    
    var theItempass1 = item+"pass";
    var thisdiv1     = "div"+item;

      if(document.getElementById(theItempass1).style.color == "black"){
        document.getElementById(theItempass1).style.color = "MediumSeaGreen";
        this.frmData1.notes = notes;
        this.setStars(item,value);
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


  passClickold(itemnumber,template,item,value,notes){

    var theItempass1 = item+"pass";
    var theItemfail1 = item+"fail";
    var thisdiv1     = "div"+item;
        
    this.passOrfail  = "pass";
    this.openedDiv   = thisdiv1;

    if(this.isOpened == false){

      if(document.getElementById(theItempass1).style.color == "black"){
        
        console.log("1 this.isOpened",this.isOpened);

        document.getElementById(theItempass1).style.color = "mediumseagreen";
        document.getElementById(theItemfail1).style.color = "black";
        document.getElementById(thisdiv1).style.display   = "block"; 

        this.frmData1.notes = notes;
        this.setStars(item,value);            
        this.reportImage = Constants.publicUploadPath+"inspectionimages"+"/"+this.formid+"/"+item+".jpg";      
        this.isOpened    = true; 

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

      } else {

        console.log("2 this.isOpened",this.isOpened);
        document.getElementById(thisdiv1).style.display   = "none"; 
        this.frmData1.notes = notes;
        this.setStars(item,value);            
        this.reportImage = Constants.publicUploadPath+"inspectionimages"+"/"+this.formid+"/"+item+".jpg";      
        this.isOpened    = false  ;
      }

    } else {

      if(document.getElementById(theItempass1).style.color == "black"){          
        document.getElementById(thisdiv1).style.display   = "block";       
        console.log("3 this.isOpened",this.isOpened);
        console.log("document.getElementById(theItempass1).style.color",document.getElementById(theItempass1).style.color);
      } else if(document.getElementById(theItempass1).style.color == "mediumseagreen"){          
        document.getElementById(thisdiv1).style.display   = "block";       
        console.log("4 this.isOpened",this.isOpened);
        console.log("document.getElementById(theItempass1).style.color",document.getElementById(theItempass1).style.color);
      }
    }
  }

  passClick(itemnumber,template,item,value,notes){

    var theItempass1 = item+"pass";
    var theItemfail1 = item+"fail";
    var thisdiv1     = "div"+item;

    if(this.isOpened == false){
      this.isOpened    = true;
      this.openedDiv   = thisdiv1;
      this.passOrfail  = "pass";
      if(document.getElementById(theItempass1).style.color == "black"){
        document.getElementById(theItempass1).style.color = "mediumseagreen";
        document.getElementById(theItemfail1).style.color = "black";
        this.frmData1.notes = notes;
        this.setStars(item,value);
        document.getElementById(thisdiv1).style.display   = "block";   
        this.checkeditems.push(item);
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
                         
        var reportUrl = Constants.publicUploadPath+"inspectionimages"+"/"+this.formid+"/"+item+".jpg";
        this.imageResolves(reportUrl);
        
        //this.reportImage = Constants.publicUploadPath+"inspectionimages/noimage.jpg";
        console.log("repimg:  ",this.reportImage);

      } else if(document.getElementById(theItempass1).style.color == "mediumseagreen"){
          this.frmData1.notes = notes;
          this.setStars(item,value);
          var reportUrl1 = Constants.publicUploadPath+"inspectionimages"+"/"+this.formid+"/"+item+".jpg";
          this.imageResolves(reportUrl1);
          document.getElementById(thisdiv1).style.display   = "block";
      }
    }
    else 
    {
      if(this.isOpened == true && this.openedDiv == thisdiv1){
        this.passOrfail  = "";
        this.isOpened    = false;
        this.openedDiv   = "";
        if(document.getElementById(theItempass1).style.color == "red"){
          document.getElementById(thisdiv1).style.display   = "none";        
          document.getElementById(theItempass1).style.color = "red";
        } else {
          document.getElementById(thisdiv1).style.display   = "none";          
          document.getElementById(theItemfail1).style.color = "black";        
          document.getElementById(theItempass1).style.color = "black"; 
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
        }        
      } 
    }   
  }


  failClick(itemnumber,template,item,value,notes){

      var theItempass2 = item+"pass";
      var theItemfail2 = item+"fail";
      var thisdiv2     = "div"+item;    
      this.hasFailedItem = true;
      if(this.isOpened == false){
        this.isOpened    = true;
        this.openedDiv   = thisdiv2;
        this.passOrfail  = "fail";
        if(document.getElementById(theItemfail2).style.color == "black"){
          document.getElementById(theItemfail2).style.color = "red";
          document.getElementById(theItempass2).style.color = "black";
          this.frmData1.notes = notes;
          this.setStars(item,value);
          document.getElementById(thisdiv2).style.display   = "block";   
          this.delitems.push(item);
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
  
          var reportUrlf = Constants.publicUploadPath+"inspectionimages"+"/"+this.formid+"/"+item+".jpg";
          this.imageResolves(reportUrlf);
  
        } else if (document.getElementById(theItemfail2).style.color == "red"){
          this.frmData1.notes = notes;
          this.setStars(item,value);
          var reportUrlf1 = Constants.publicUploadPath+"inspectionimages"+"/"+this.formid+"/"+item+".jpg";
          this.imageResolves(reportUrlf1);
          document.getElementById(thisdiv2).style.display   = "block";
        }
      }
      else 
      {
        if(this.isOpened == true && this.openedDiv == thisdiv2){
          this.passOrfail  = "";
          this.isOpened    = false;
          this.openedDiv   = "";
          if(document.getElementById(theItemfail2).style.color == "mediumseagreen"){
            document.getElementById(thisdiv2).style.display   = "none";        
            document.getElementById(theItemfail2).style.color = "mediumseagreen";
          } else {
            document.getElementById(thisdiv2).style.display   = "none";          
            document.getElementById(theItemfail2).style.color = "black";        
            document.getElementById(theItempass2).style.color = "black"; 
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
        }
      }
    }  
  }
      












  /*
  passClick(itemnumber,template,item,value,notes){

    var theItempass1 = item+"pass";
    var theItemfail1 = item+"fail";
    var thisdiv1     = "div"+item;

    if(this.isOpened == false){
      this.isOpened    = true;
      this.openedDiv   = thisdiv1;
      this.passOrfail  = "pass";
      if(document.getElementById(theItempass1).style.color == "black"){
        document.getElementById(theItempass1).style.color = "mediumseagreen";
        document.getElementById(theItemfail1).style.color = "black";
        this.frmData1.notes = notes;
        this.setStars(item,value);
        document.getElementById(thisdiv1).style.display   = "block";   
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
                         
        var reportUrl = Constants.publicUploadPath+"inspectionimages"+"/"+this.formid+"/"+item+".jpg";
        this.imageResolves(reportUrl);

      } else if(document.getElementById(theItempass1).style.color == "mediumseagreen"){
          this.frmData1.notes = notes;
          this.setStars(item,value);
          var reportUrl1 = Constants.publicUploadPath+"inspectionimages"+"/"+this.formid+"/"+item+".jpg";
          this.imageResolves(reportUrl1);
          document.getElementById(thisdiv1).style.display   = "block";
      }
      
    }
    else 
    {
      if(this.isOpened == true && this.openedDiv == thisdiv1){
        this.passOrfail  = "";
        this.isOpened    = false;
        this.openedDiv   = "";

        if(document.getElementById(theItempass1).style.color == "red"){
          document.getElementById(thisdiv1).style.display   = "none";        
          document.getElementById(theItempass1).style.color = "red";
        } else {
          document.getElementById(thisdiv1).style.display   = "none";          
          document.getElementById(theItemfail1).style.color = "black";        
          document.getElementById(theItempass1).style.color = "black"; 
          for( var i = 0; i < this.checkeditems.length; i++){     
            if ( this.checkeditems[i] === item) {     
                this.checkeditems.splice(i, 1); 
            }   
          }
          this.addcheck = this.checkAllTicked(this.totalItems,this.checkeditems); 
          console.log(this.addcheck);
          if (this.addcheck == true) {
            this.allChecked = true;
          } else {
            this.allChecked = false;
          } 
        }        
      } 
    }   
  }

  failClick(itemnumber,template,item,value,notes){
    var theItempass2 = item+"pass";
    var theItemfail2 = item+"fail";
    var thisdiv2     = "div"+item;    

    this.hasFailedItem = true;

    if(this.isOpened == false){
      this.isOpened    = true;
      this.openedDiv   = thisdiv2;
      this.passOrfail  = "fail";
      if(document.getElementById(theItemfail2).style.color == "black"){
        document.getElementById(theItemfail2).style.color = "red";
        document.getElementById(theItempass2).style.color = "black";
        this.frmData1.notes = notes;
        this.setStars(item,value);
        document.getElementById(thisdiv2).style.display   = "block";   
        this.delitems.push(item);
        for( var i = 0; i < this.checkeditems.length; i++){     
          if ( this.checkeditems[i] === item) {     
              this.checkeditems.splice(i, 1); 
          }   
        }
        this.addcheck = this.checkAllTicked(this.totalItems,this.checkeditems); 
        if (this.addcheck == true) {
          this.allChecked = true;
         } else {
          this.allChecked = false;
        }  

        var reportUrlf = Constants.publicUploadPath+"inspectionimages"+"/"+this.formid+"/"+item+".jpg";
        this.imageResolves(reportUrlf);

      } else if (document.getElementById(theItemfail2).style.color == "red"){
        this.frmData1.notes = notes;
        this.setStars(item,value);
        var reportUrlf1 = Constants.publicUploadPath+"inspectionimages"+"/"+this.formid+"/"+item+".jpg";
        this.imageResolves(reportUrlf1);
        document.getElementById(thisdiv2).style.display   = "block";
      }
    }
    else 
    {
      if(this.isOpened == true && this.openedDiv == thisdiv2){
        this.passOrfail  = "";
        this.isOpened    = false;
        this.openedDiv   = "";
        if(document.getElementById(theItemfail2).style.color == "mediumseagreen"){
          document.getElementById(thisdiv2).style.display   = "none";        
          document.getElementById(theItemfail2).style.color = "mediumseagreen";
        } else {
          document.getElementById(thisdiv2).style.display   = "none";          
          document.getElementById(theItemfail2).style.color = "black";        
          document.getElementById(theItempass2).style.color = "black"; 
          for( var i = 0; i < this.checkeditems.length; i++){     
            if ( this.checkeditems[i] === item) {     
                this.checkeditems.splice(i, 1); 
            }   
          }
          this.addcheck = this.checkAllTicked(this.totalItems,this.checkeditems); 
          if (this.addcheck == true) {
            this.allChecked = true;
          } else {
            this.allChecked = false;
          }
      }
    }
  }    
*/

  
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

    console.log("Checked: ",this.checkeditems.length);
    console.log("Failed: ",this.delitems.length);

    if(this.checkeditems.length == 0){checked = "ppp"} else {checked = this.checkeditems} //JSON.stringify(this.checkeditems)}
    if(this.delitems.length     == 0){failed  = "fff"} else {failed  = this.delitems}

    console.log("Checked: ",checked);
    console.log("Failed: ",failed);

      if(this.selectedlocation != "") {

        if(this.showlocationlookup == 0){  
          var formurl = Constants.apiUrl+"api/inspectinform/"+this.inspectionitemsApiKey +"/"+this.clienttID+"/"+this.inspectionitemsSystemProjectID+"/"+this.inspectionitemsUserID+"/"+this.requestid+"/"+this.selectedlocation+"/"+checked+"/"+failed+"/"+this.usercompanyname+"/"+this.username+"/"+this.showlocationlookup+"/No notes"; //+this.frmData1.details;
          console.log("Sending overall Data");
          this.http.get(formurl).map(res => res.json()).subscribe(data => {
            this.inspectinform = data;
            this.presentToast("Request Complete.");
          },
          err => {console.log("Error sending sendReport data");}
          );
        } 
        
        if(this.showlocationlookup == 1){ 
          console.log("sending inspector");
          var formurl1 = Constants.apiUrl+"api/inspectinform/"+this.inspectionitemsApiKey +"/"+this.clienttID+"/"+this.inspectionitemsSystemProjectID+"/"+this.inspectionitemsUserID+"/"+this.ParentFormID+"/"+this.selectedlocation+"/"+checked+"/"+failed+"/"+this.usercompanyname+"/"+this.username+"/"+this.showlocationlookup+"/No notes"; //+this.frmData1.details;
          console.log("Sending overall Data");
            this.http.get(formurl1).map(res => res.json()).subscribe(data => {
              this.inspectinform = data;
              this.presentToast("Request Complete.");
            },
            err => {console.log("Error sending sendReport data");}    
          );  
        }       

        this.dismiss();

      } else {
        this.presentToast("Request Failled - Please complete form.");
      }
  }

  cancelitem(number,template,item,value,notes){                                                                             
    this.failClick(number,template,item,value,notes);
  }


  presentToast(msg) {
    const toast =  this.toastCtrl.create({
      message: msg,
      duration: 1000,
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
