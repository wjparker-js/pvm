import { Component} from '@angular/core';
import { IonicPage,  ModalController, NavController, NavParams, ActionSheetController,ToastController, ViewController } from 'ionic-angular';
import { Http } from '@angular/http';
import * as Constants from '../../providers/constants';
import { DomSanitizer } from '@angular/platform-browser';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';


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
  holdingImage:any;
  showFooter: boolean = false;

  who:any;
  hasFailedItem:boolean = false;
  base:any;
  luComplete:any;
  isluComplete:any;
  temp:any;

  // Initalial values.
  newItem: string = "";
  newStr: string = "";
  toggleNew: boolean = true;
  todos: any [];
  todosnotes: any [];
  notescount:any;
  reportOverallImage :any;
  url:any;

  frmData1 = {notes:"", inotes:"", onotes1:""};



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
    this.inspectionoverallnotes = "";

    this.ParentFormID        = this.navParams.get('ParentFormID');    
    this.requestid           = this.navParams.get('requestid');
    this.inspectionitemsid   = this.navParams.get('requestid');	
    this.lid1                = this.navParams.get('lid1');	 
    this.lid2                = this.navParams.get('lid2');	 
    this.lid3                = this.navParams.get('lid3');	 
    this.lid4                = this.navParams.get('lid4');
    this.temp                = this.navParams.get('template');	 
    this.who                 = this.navParams.get('who');	 

    if(this.temp == 0 && this.who == "sub"){this.temp  = "sub";} 
    if(this.who == "subi"){this.temp = "subi";} 
    if(this.temp == 1 && this.who == "ins"){this.temp  = "ins";}

    if(this.lid1 == undefined){this.lid1 = "NULL"}
    if(this.lid2 == undefined){this.lid2 = "NULL"}
    if(this.lid3 == undefined){this.lid3 = "NULL"}
    if(this.lid4 == undefined){this.lid4 = "NULL"}
    
    var inspectionitemstData = JSON.parse(localStorage.getItem('userSystemData')); 
 
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
    this.base                           = "";
    this.luComplete                     = 0;
    this.isluComplete                   = 0;
    this.holdingImage                   = "data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAeAB4AAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAYAB0DASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKKKACiiigAooooAKKKKAP/2Q==";
    
    localStorage.setItem('reportOverallImage',this.holdingImage);
    localStorage.setItem('reportImage',""); //this.holdingImage);
    
    this.reportOverallImage             = localStorage.getItem('reportOverallImage');
    this.reportImage                    = ""; //localStorage.getItem('reportImage');


    if(this.temp == "sub"){
      var url = Constants.apiUrl+"api/inspectiontemplates/"+this.inspectionitemsApiKey+"/"+this.inspectionitemsSystemProjectID+"/"+this.inspectionitemsUserID+"/"+this.username+"/"+this.usercompanyname+"/"+this.requestid+"/"+this.temp;
      console.log("url sub",url);
    } 
    if(this.temp == "subi"){
      this.url = Constants.apiUrl+"api/inspectiontemplates/"+this.inspectionitemsApiKey+"/"+this.inspectionitemsSystemProjectID+"/"+this.inspectionitemsUserID+"/"+this.username+"/"+this.usercompanyname+"/"+this.inspectionitemsid+"/"+this.temp;
      console.log("urlsubi",url);
    } 
    if(this.temp == "ins"){
      this.url = Constants.apiUrl+"api/inspectiontemplates/"+this.inspectionitemsApiKey+"/"+this.inspectionitemsSystemProjectID+"/"+this.inspectionitemsUserID+"/"+this.username+"/"+this.usercompanyname+"/"+this.inspectionitemsid+"/"+this.temp;
      console.log("urlins",url);
    }     

    this.http.get(this.url).map(res => res.json()).subscribe(data => {
      this._sanitizer.bypassSecurityTrustStyle(data);
      this.inspectionitemssdata = data;  

      console.log("this.inspectionitemssdata: ",this.inspectionitemssdata);

      if (data.length > 0) {

        if(this.temp == "sub"){
          this.template           = this.inspectionitemssdata[0].Template; 
          this.formid             = this.inspectionitemssdata[0].TemplateID;      
          this.showlocationlookup = this.inspectionitemssdata[0].Template;  
          this.locationtext       = this.inspectionitemssdata[0].LocationText;         
        } else {
          this.template           = this.inspectionitemssdata[0].Template;        
          this.formid             = this.inspectionitemssdata[0].FormID;       
          this.showlocationlookup = this.inspectionitemssdata[0].Template;  
          this.locationtext       = this.inspectionitemssdata[0].LocationText;
        } 
        console.log("this.inspectionitemssdata[0].Template    ",this.inspectionitemssdata[0].Template);
        console.log("formid  ",this.formid)

        this.getOnotes(this.formid);
                


        //if(this.showlocationlookup == 1){
        var urlloctext = Constants.apiUrl+"api/locationtext/"+this.inspectionitemsApiKey+"/"+this.inspectionitemsSystemProjectID+"/"+this.lid1+"/"+this.lid2+"/"+this.lid3+"/"+this.lid4;    
        this.http.get(urlloctext).map(res => res.json()).subscribe(data => {
        this._sanitizer.bypassSecurityTrustStyle(data);
        this.locationtextdata = data;

        console.log("this.locationtextdata: ",this.locationtextdata);

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
          console.log("urllocationlocnames   ",this.urllocationlocnames);
          if (data.length > 0) {
            this.FormPlotFlatName   = this.urllocationlocnames[0].FormPlotFlatName;
            if(this.FormPlotFlatName != null){ this.luComplete = this.luComplete+1}
            this.FormFloorLevelName = this.urllocationlocnames[0].FormFloorLevelName;
            if(this.FormFloorLevelName != null){ this.luComplete = this.luComplete+1}
            this.FormFlatTypeName   = this.urllocationlocnames[0].FormFlatTypeName;
            if(this.FormFlatTypeName != null){ this.luComplete = this.luComplete+1}
            this.FormComponentName  = this.urllocationlocnames[0].FormComponentName;
            if(this.FormComponentName != null){ this.luComplete = this.luComplete+1}
            console.log("lucomplete   ",this.luComplete);
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

        

        // passed and failed arrays
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

      }
      }, err => {console.log("Oops! Error reading template data");
    });     
  } 



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

  public presentActionSheet(itemid,template,click,noteno) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePhoto(itemid,template,click,noteno,false)
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePhoto(itemid,template,click,noteno,true)
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
  
  public presentActionSheetOverall() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takeOverallPhoto(false)
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takeOverallPhoto(true)
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

  takeOverallPhoto(from_camera) {
  
    //var OverallImageurl = "https://projectbaultuk.com/publicpics/handover/overallimages";

    let options = {
      quality: 50,
			sourceType: from_camera ? this.camera.PictureSourceType.CAMERA : this.camera.PictureSourceType.PHOTOLIBRARY,
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
      this.base = 'data:image/jpg;base64,' + imageData;
      //saveNew();
      localStorage.setItem('reportOverallImage', this.base);
      this.reportOverallImage = localStorage.getItem('reportOverallImage');    
    },
    err => {console.log(err);}
  );
  }

  takePhoto(itemid,template,click,noteno,from_camera) {

    var thistopimgdiv  = "topdiv"+itemid;
    var thisimgdiv  = "div"+itemid;
    var theImg = itemid+"img";
    document.getElementById(theImg).style.display = "block";     
    //document.getElementById(theImg).style.height= "800px"; 
    //document.getElementById(thistopimgdiv).style.height= "800px";   

    let options = {
      quality: 50,
			sourceType: from_camera ? this.camera.PictureSourceType.CAMERA : this.camera.PictureSourceType.PHOTOLIBRARY,
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
      this.base = 'data:image/jpg;base64,' + imageData;
      console.log("clickitem = ", click);
      localStorage.setItem('reportImage', this.base);
      this.reportImage = this.base; //localStorage.getItem('reportImage'); 
      console.log("this.reportImage   ",this.reportImage);   
      document.getElementById(thistopimgdiv).style.height= "800px";
      document.getElementById(thisimgdiv).style.height= "800px"   
     
    },
    err => {console.log(err);}
    );
;
  }

  getOnotes(theformid){
    console.log("getOnotes:  ",theformid);
    
    var inspectionoverallnotesurl = Constants.apiUrl+"api/inspectionoverallnotes/"+this.inspectionitemsApiKey+"/"+theformid;
    this.http.get(inspectionoverallnotesurl).map(res => res.json()).subscribe(data => {
      this._sanitizer.bypassSecurityTrustStyle(data);
      this.inspectionoverallnotes = data;  
      console.log("this.inspectionoverallnotes:  ",this.inspectionoverallnotes);
      //this.overallimg1 = Constants.publicUploadPath+"inspectionimages"+"/"+this.formid+"/"+this.formid+"1.jpg";
      //console.log("overallimg1:  ",this.overallimg1);
      //var onotes = [this.frmData1.onotes1,this.frmData1.onotes2,this.frmData1.onotes3];
      //var oimages= [this.overallimg1,this.overallimg2,this.overallimg3];
/*
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
      err => {console.log("Oops!");}
    );  

  }

  sendPhotoData(itemid,template,number,click,noteno){

    var itemOpen = itemid+"open";
    var upurl = "https://pvmobile.online/iuploadphotodata.php";
    const formData = new FormData();	

    var thisdiv1     = "div"+itemid;
    var thistopdiv1  = "topdiv"+itemid;

    if(click == "clickitem"){
      formData.append('type', 'clickitem');
      formData.append('photo', this.reportImage);
      formData.append('notes', this.frmData1.inotes);  //this.frmData1.notes
    }

    if(noteno == "x"){
      formData.append('item', '0');
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


    document.getElementById("div"+itemid).style.display="none"
    document.getElementById(thistopdiv1).style.height= "40px";   
    document.getElementById(thisdiv1).style.height= "40px";  
    document.getElementById(itemOpen).style.color = "Blue";

    this.frmData1.inotes = "";
    localStorage.setItem('reportImage',this.holdingImage);
    this.reportImage = localStorage.getItem('reportImage');
    this.passOrfail  = "";
    this.isOpened    = false;
    this.openedDiv   = "";

    this.presentToast("Image and data uploaded.")
  }

  sendOverallPhotoData(){

    this.notescount++;

    var upurl           = "https://pvmobile.online/iuploadoverallphotdata.php";

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


    this.todos.push(this.reportOverallImage);
    if(this.frmData1.onotes1 == ''){
      this.frmData1.onotes1 = 'No Notes.'
    }
    this.todosnotes.push(this.frmData1.onotes1);

    console.log("todos: ",this.todos);

    this.toggleNew = false;
    this.newItem = "";
    this.newStr = "";
    this.frmData1.onotes1 = "";
    localStorage.setItem('reportOverallImage',this.holdingImage);
    this.reportOverallImage = localStorage.getItem('reportOverallImage');
    this.presentToast("Image and data uploaded.")
  }

  setStars(item,position){
    console.log("setStars: ",position);

    var star="";
    this.valuation  = position;

    for (let i = 1; i < 6; i++) {
      star = item+i;
      document.getElementById(star).style.color = "#c8c8c8";
      console.log("Clear: ",star);
    }

    for (let i = 1; i <= position; i++) {
      star = item+i;
      document.getElementById(star).style.color = "orange";
      console.log("Orange ",star);
    }
  }

  openUp(item,value,notes){
    var thisdiv1 = "div"+item;
    var thistopdiv1 = "topdiv"+item;
    if(document.getElementById(thisdiv1).style.display == "block"){
      console.log("Closing");
      document.getElementById(thisdiv1).style.display   = "none";
      document.getElementById(thisdiv1).style.height= "40px";  
      document.getElementById(thistopdiv1).style.height= "40px"; 
    } else {
      console.log("Opening");  
      this.frmData1.notes = notes;
      this.setStars(item,value);   
      var reportUrl1 = Constants.publicUploadPath+"inspectionimages"+"/"+this.formid+"/"+item+".jpg";
      this.imageResolves(reportUrl1); 
        document.getElementById(thisdiv1).style.display   = "block"; 
        //document.getElementById(thisdiv1).style.height= "800px";  
        document.getElementById(thistopdiv1).style.height= "800px";
    }
  }

  passClick1(item){
    
    var theItempass1 = item+"pass";

      if(document.getElementById(theItempass1).style.color == "black"){
        document.getElementById(theItempass1).style.color = "MediumSeaGreen";
        this.checkeditems.push(item);
        for( var i = 0; i < this.delitems.length; i++){     
          if ( this.delitems[i] === item) {     
              this.delitems.splice(i, 1); 
          }   
        }
        this.addcheck = this.checkAllTicked(this.totalItems,this.checkeditems);
        console.log("this.addcheck ",this.addcheck); 
        if (this.addcheck == true) {
          this.allChecked = true;
        } else {
          this.allChecked = false;
        }         
      }
      else
      {  
        document.getElementById(theItempass1).style.color = "black";
        for( var k = 0; k < this.checkeditems.length; k++){     
          if ( this.checkeditems[k] === item) {     
              this.checkeditems.splice(k, 1); 
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
    var thistopdiv1  = "topdiv"+item;

    if(this.isOpened == false){

      this.isOpened    = true;
      this.openedDiv   = thisdiv1;
      this.passOrfail  = "pass";
     
      if(document.getElementById(theItempass1).style.color == "black" || document.getElementById(theItempass1).style.color == "mediumseagreen"){
        
        document.getElementById(theItempass1).style.color = "mediumseagreen";
        document.getElementById(theItemfail1).style.color = "black"; 

        document.getElementById(thisdiv1).style.display = "block"; 

        document.getElementById(thisdiv1).style.height  = "800px";  

        if(document.getElementById(theItempass1).style.color == "mediumseagreen"){
        document.getElementById(thistopdiv1).style.height= "800px";
        }

        if(document.getElementById(theItempass1).style.color == "black"){
        document.getElementById(thistopdiv1).style.height= "140px"; 
        }

        this.frmData1.inotes = notes;
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

      } 
    }
    else 
    {
      if(this.isOpened == true && this.openedDiv == thisdiv1){

        this.passOrfail  = "pass";
        this.isOpened    = false;
        this.openedDiv   = "";


        if(document.getElementById(theItempass1).style.color == "mediumseagreen"){
          document.getElementById(thisdiv1).style.display   = "none";   
          document.getElementById(thistopdiv1).style.height= "40px";        
          document.getElementById(theItemfail1).style.color = "black";
          document.getElementById(thisdiv1).style.height= "40px";  

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
      var thistopdiv2  = "topdiv"+item; 
    
      this.hasFailedItem = true;

      if(this.isOpened == false){

        this.isOpened    = true;
        this.openedDiv   = thisdiv2;
        this.passOrfail  = "fail";

        if(document.getElementById(theItemfail2).style.color == "black" || document.getElementById(theItemfail2).style.color == "red"){
          
          document.getElementById(theItemfail2).style.color = "red";
          document.getElementById(theItempass2).style.color = "black"; 
          document.getElementById(thisdiv2).style.display   = "block";   
          document.getElementById(thisdiv2).style.height= "150px";  

          if(document.getElementById(theItemfail2).style.color == "red"){
          document.getElementById(thistopdiv2).style.height= "800px"; 
          }
          if(document.getElementById(theItemfail2).style.color == "black"){
          document.getElementById(thistopdiv2).style.height= "140px"; 
          } 
          //document.getElementById(thisdiv2).style.height= "90px"; 

          this.frmData1.inotes = notes;
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
        } 
      }
      else 
      {
        if(this.isOpened == true && this.openedDiv == thisdiv2){

          this.passOrfail  = "fail";
          this.isOpened    = false;
          this.openedDiv   = "";

          if(document.getElementById(theItemfail2).style.color == "red"){
            document.getElementById(thisdiv2).style.display   = "none"; 
            document.getElementById(thistopdiv2).style.height= "40px";         
            document.getElementById(theItempass2).style.color = "black";

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
      //this.reportImage = Constants.publicUploadPath+"inspectionimages/noimage.jpg";
      this.reportImage = this.holdingImage; //"data:image/jpg;base64,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";
      
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
      this.overallimg1 = this.holdingImage; //Constants.publicUploadPath+"inspectionimages/noimage.jpg";
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
    //this.locationtext = builslocname;

    if(this.frmData1.notes == ''){this.frmData1.notes = "No notes";}

      if(this.selectedlocation != "") {

        if(this.showlocationlookup == 0){  
          var formurl = Constants.apiUrl+"api/inspectinform/"+this.inspectionitemsApiKey +"/"+this.clienttID+"/"+this.inspectionitemsSystemProjectID+"/"+this.inspectionitemsUserID+"/"+this.requestid+"/"+this.selectedlocation+"/"+checked+"/"+failed+"/"+this.usercompanyname+"/"+this.username+"/"+this.showlocationlookup+"/"+this.frmData1.notes;
          console.log("Sending overall Data  ",formurl);
          this.http.get(formurl).map(res => res.json()).subscribe(data => {
            //this.inspectinform = data;
            //this.presentToast("Request Complete.");
          },
          err => {console.log("Error sending subby sendReport data");}
          );
        } 
        
        if(this.showlocationlookup == 1){ 
          console.log("sending inspector");
          var formurl1 = Constants.apiUrl+"api/inspectinform/"+this.inspectionitemsApiKey+"/"+this.clienttID+"/"+this.inspectionitemsSystemProjectID+"/"+this.inspectionitemsUserID+"/"+this.formid+"/"+this.selectedlocation+"/"+checked+"/"+failed+"/"+this.usercompanyname+"/"+this.username+"/"+this.showlocationlookup+"/"+this.frmData1.notes;
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

    this.isluComplete = this.isluComplete + 1;

    if(this.isluComplete == this.luComplete){
      this.showFooter = true;
      console.log("this.showFooter  ",this.showFooter);
    }
    console.log("isluComplete1  ",this.isluComplete);
    console.log("locp11  ",this.locnamepart1);
    console.log("locp12  ",this.locationpart1);
  }

  loc2selected(location){
    var locp2pos = location.indexOf("-");
    var locp2len = location.length;
    this.locnamepart2 = location.substring(0,locp2pos);
    this.locationpart2 = location.substring(locp2len - 36);

    this.isluComplete = this.isluComplete + 1;

    if(this.isluComplete == this.luComplete){
      this.showFooter = true;
      console.log("this.showFooter  ",this.showFooter);
    }
    
    console.log("isluComplete2  ",this.isluComplete);
    console.log("locp21  ",this.locnamepart2);
    console.log("locp22  ",this.locationpart2);
  }

  loc3selected(location){
    var locp3pos = location.indexOf("-");
    var locp3len = location.length;
    this.locnamepart3 = location.substring(0,locp3pos);
    this.locationpart3 = location.substring(locp3len - 36);

    this.isluComplete = this.isluComplete + 1;
    if(this.isluComplete == this.luComplete){
      this.showFooter = true;
      console.log("this.showFooter  ",this.showFooter);
    }
    console.log("isluComplete3  ",this.isluComplete);
    console.log("locp31  ",this.locnamepart3);
    console.log("locp32  ",this.locationpart3);
  }

  loc4selected(location){
    var locp4pos = location.indexOf("-");
    var locp4len = location.length;
    this.locnamepart4 = location.substring(0,locp4pos);
    this.locationpart4 = location.substring(locp4len - 36);

    this.isluComplete = this.isluComplete + 1;
    if(this.isluComplete == this.luComplete){
      this.showFooter = true;
      console.log("this.showFooter  ",this.showFooter);
    }
    console.log("isluComplete4  ",this.isluComplete);
    console.log("locp41  ",this.locnamepart4);
    console.log("locp42  ",this.locationpart4);
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
