import { Component} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ViewChild } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, Searchbar} from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { DocumentViewer } from '../documentviewer/documentviewer';
import { DocumentInfo } from '../documentinfo/documentinfo';
import { DocumentAudit } from '../documentaudit/documentaudit';
import { AboutPage } from '../about/about';
import { SubtypesPage } from '../subtypes/subtypes';
import * as Constants from '../../providers/constants';

@IonicPage()

@Component({selector: 'page-documents',templateUrl: 'documents.html',})

export class DocumentsPage {  

  @ViewChild('mySearchbar') myInput;

  userdocuments: any;
  customfieldnames: any;
  fieldnames: any;
  userApiKey : any;
  selectedProjectName: any;
  eventInstance : any;
  dsearch : any;
  hasdocs : any;

  userdocumentData = {
    "SystemProjectID":"",
    "SystemProjectName":"",
    "SystemClientID":"",
    "SystemUserID": "",
    "apiKey":"",
    "Thumbnail":"",
    "DocumentNumber":"",
    "FileExtension":""
  };

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public http: Http,
              private _sanitizer: DomSanitizer, 
              public modalCtrl: ModalController) {}

  ionViewDidLeave(){
    //document.getElementsByClassName("searchbar-input")["0"].value = "";
    //console.log(searchvalue);
    //this.searchbar.clearInput(null);
    //this.searchbar.value = '';
    //this.navCtrl.pop();
  }
  
  ionViewDidEnter() {


    const documentData = JSON.parse(localStorage.getItem('userSystemData'));

    this.userdocumentData.SystemProjectID   = localStorage.getItem('CurrentProjectID');
    this.userdocumentData.SystemProjectName = localStorage.getItem('CurrentProjectName'); 

    this.userdocumentData.SystemClientID    = documentData[0].SystemClientID;
    this.userdocumentData.SystemUserID      = documentData[0].SystemUserID;
    this.userdocumentData.apiKey            = documentData[0].apiKey;    
    this.userdocumentData.Thumbnail         = documentData[0].PhotoTiny;
    this.userdocumentData.DocumentNumber    = documentData[0].DocumentNumber; 
    this.userdocumentData.FileExtension     = documentData[0].FileExtension; 
    
    var documentSystemProjectID = this.userdocumentData.SystemProjectID; 
    var selectedProjectName     = this.userdocumentData.SystemProjectName;    
    var documentSystemClientID  = this.userdocumentData.SystemClientID;
    var documentSystemUserID    = this.userdocumentData.SystemUserID;    
    var documentApiKey          = this.userdocumentData.apiKey;
    var documentThumbnail       = this.userdocumentData.Thumbnail;
    var documentDocumentNumber  = this.userdocumentData.DocumentNumber;
    var documentFileExtension   = this.userdocumentData.FileExtension;

    var currentProjectName      = localStorage.getItem('CurrentProjectName');
    var oldProjectName          = localStorage.getItem('OldProjectName');

    setTimeout(() => {
      this.myInput.setFocus();
      if(currentProjectName != oldProjectName ){
      this.myInput.value = "";}
    },150);
  

    //this.hasdocs = false;
    //this.searchbar.clearInput(null);
    if(currentProjectName != oldProjectName ){

      document.getElementsByClassName("searchbar-input")["0"].value = "";
      document.getElementById("maindiv").style.display="none";

      var oldurl = Constants.apiUrl+"api/documents/"+this.userdocumentData.apiKey+"/"+this.userdocumentData.SystemUserID+"/"+localStorage.getItem('CurrentProjectID')+"/xxxxxxxxxxxxxxxxxxx/xxx";
      this.http.get(oldurl).map(res => res.json()).subscribe(data => {
            this._sanitizer.bypassSecurityTrustStyle(data);
            this.userdocuments = data;
            localStorage.setItem('OldProjectName', this.userdocumentData.SystemProjectName);
            document.getElementById("maindiv").style.display="block";
            //document.getElementsByClassName("searchbar-input")["0"].value = "";
            console.log(this.userdocuments);
        },
        err => {
            console.log("Oops!");
        }
      );    
      
    }

    
    var furl  = Constants.apiUrl+"api/documentsfields/"+documentSystemProjectID;
    this.http.get(furl).map(res => res.json()).subscribe(data => {
          this._sanitizer.bypassSecurityTrustStyle(data);
          this.fieldnames = data; 
          console.log(this.fieldnames);
      },
      err => {
          console.log("Field Names Oops!");
      }
    ); 

    var cfurl = Constants.apiUrl+"api/documentscustomfields/"+documentSystemProjectID+"/"+documentSystemClientID;
    this.http.get(cfurl).map(res => res.json()).subscribe(data => {
          this._sanitizer.bypassSecurityTrustStyle(data);
          this.customfieldnames = data; 
          console.log(this.customfieldnames);
      },
      err => {
          console.log("Custom Field Names Oops!");
      }
    ); 


/*    var localDocumentData1       = JSON.parse(localStorage.getItem('userSystemData'));
    var localApiKey1            = localDocumentData1[0].apiKey;

    var url1 = Constants.apiUrl+"api/documents/"+localApiKey1+"/"+documentSystemUserID+"/"+documentSystemProjectID+"/|";

    this.http.get(url1).map(res => res.json()).subscribe(data => {
          this._sanitizer.bypassSecurityTrustStyle(data);
          this.userdocuments = data;          
          console.log(this.userdocuments);
      },
      err => {
          console.log("Oops!");
      }
    ); */

  }
  

  keys(obj){
      return Object.keys(obj);
  }

checkFocus(){
  console.log("Got Focus");
  //document.getElementsByClassName("searchbar-input")["0"].value = "";
}


  searchByKeyword($event){

    //var searchvalue = document.getElementsByClassName("searchbar-input")["0"].value;
    //console.log(searchvalue);


    this.selectedProjectName     = localStorage.getItem('CurrentProjectName');    
    var documentSystemUserID1    = this.userdocumentData.SystemUserID;
    var documentSystemProjectID1 = localStorage.getItem('CurrentProjectID');    
    var searchTerm               = $event.srcElement.value;
    var localDocumentData        = JSON.parse(localStorage.getItem('userSystemData'));
    var localApiKey              = localDocumentData[0].apiKey;
    this.eventInstance           = $event;
    this.dsearch                 = $event.srcElement.value;

    var url   = Constants.apiUrl+"api/documents/"+localApiKey+"/"+documentSystemUserID1+"/"+documentSystemProjectID1+"/"+searchTerm+"/xxx";
    this.http.get(url).map(res => res.json()).subscribe(data => {
          this._sanitizer.bypassSecurityTrustStyle(data);
          this.userdocuments = data;
          if ( this.userdocuments.length == 0 ) {
            this.hasdocs = false;
          } else {
            this.hasdocs = true;
          }
          console.log(this.userdocuments);
      },
      err => {
          console.log("Oops!");
      }
    ); 

  }
  

  openDocument(clientid,projectid,docid,ext){
    this.navCtrl.push(DocumentViewer,{clientid,projectid,docid,ext});
  }


  fixImage(image){

    console.log(image);
    var newstr = "";
    newstr = image.replace("<span class='hilite'>", ""); 
    newstr = newstr.replace("</span>", "");
    console.log(newstr);

    return newstr;
    
  }

  openDocumentInfo(docimg, docid, docno1,search){ 

    var pt1 = "<span class='hilite'>";
    var pt2 = "</span>";
    var rep = "";
    var docno1 = docno1.replace(pt1,rep);
    var docno1 = docno1.replace(pt2,rep);

    this.navCtrl.push(DocumentInfo,{docimg, docid, docno1, search});
  }

  openDocumentAudit(docimg, docid, docno1){ 
    this.navCtrl.push(DocumentAudit,{docimg, docid, docno1});
  }

  openDocumentSend(docimg, docid, docno1){ 
    this.navCtrl.push(AboutPage,{docimg, docid, docno1});
  }

  
/*
	openDTList(){		
		this.navCtrl.push(SubtypesPage, {callback:this.myCallbackFunction5});
	}


  myCallbackFunctiondAudit = (_params) => {
	 return new Promise((resolve, reject) => {
	     this.hasdocs = _params;
	     resolve();
	     console.log(this.name);
	 });
	}
*/
}
                                                  