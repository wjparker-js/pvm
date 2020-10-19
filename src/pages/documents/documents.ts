import { Component} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ViewChild, ElementRef, Renderer } from '@angular/core';
import { IonicPage,  ActionSheetController, ModalController, NavController, NavParams,  ViewController , Searchbar} from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { DocumentViewer } from '../documentviewer/documentviewer';
import { DocumentInfo } from '../documentinfo/documentinfo';
import { DocumentIdInfo } from '../documentidinfo/documentidinfo';
import { DocumentAudit } from '../documentaudit/documentaudit';
import { AboutPage } from '../about/about';
import * as Constants from '../../providers/constants';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@IonicPage()

@Component({selector: 'page-documents',templateUrl: 'documents.html',})

export class DocumentsPage {  


  @ViewChild('mySearchbar', { read: ElementRef }) myInput: ElementRef;
  //@ViewChild('mySearchbar') searchbar: Searchbar;

 
  userdocuments: any;
  
  documentID: any;
  documentNumber: any;
  photoTiny: any;
  projectID: any;
  systemclientID: any;
  fromProcess: string = "N";


  documentQRData:any;
  apiKey:any;
	options: any;
	defectslist: any;
  scannedCode: any;
  location:any;
  customfieldnames: any;
  fieldnames: any;
  userApiKey : any;
  selectedProjectName: any;
  eventInstance : any;
  dsearch : any;
  hasdocs : any;
  cpid : any;
  scid : any;
  mySearchTerm:any;
  searchDoc:any;
  searchbar: Searchbar;
  inprocess:any;
  selecteddocument:any;
  selecteddocid:any;
  selecteddocno:any;

  callback: any;
  adddoc: any;
  adddocids:any;
  api: any;

  addDocuments = [];
  
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

  constructor(
		          public actionSheetCtrl: ActionSheetController,
              public navCtrl: NavController, 
              public navParams: NavParams, 
              public viewCtrl: ViewController,
              public http: Http,
              private _sanitizer: DomSanitizer, 
              private renderer:Renderer,
              private barcodeScanner:BarcodeScanner,
              public modalCtrl: ModalController) {}

 
  ionViewDidEnter() {

    this.inprocess = this.navParams.get('inprocess');
    this.callback = this.navParams.get("callback")
    this.selecteddocument = "";

    const documentData = JSON.parse(localStorage.getItem('userSystemData'));

    this.userdocumentData.SystemProjectID   = localStorage.getItem('CurrentProjectID');
    this.userdocumentData.SystemProjectName = localStorage.getItem('CurrentProjectName'); 
    this.userdocumentData.SystemClientID    = documentData[0].SystemClientID;
    this.userdocumentData.SystemUserID      = documentData[0].SystemUserID;
    this.userdocumentData.apiKey            = documentData[0].apiKey;    
    this.userdocumentData.Thumbnail         = documentData[0].PhotoTiny;
    this.userdocumentData.DocumentNumber    = documentData[0].DocumentNumber; 
    this.userdocumentData.FileExtension     = documentData[0].FileExtension; 
		this.apiKey                             = documentData[0].apiKey; 
    
    var documentSystemProjectID = this.userdocumentData.SystemProjectID;  
    var documentSystemClientID  = this.userdocumentData.SystemClientID;

    var currentProjectName      = localStorage.getItem('CurrentProjectName');
    console.log("Current Proj = ", currentProjectName);

    var oldProjectName          = localStorage.getItem('OldProjectName');
    console.log("Old Proj = ", oldProjectName);

    this.cpid = localStorage.getItem('CurrentProjectID');
    this.scid = localStorage.getItem('CurrentProjectClientID');

    setTimeout(() => {
      console.log("setTimeout");
      this.myInput.nativeElement.focus();
      this.myInput.nativeElement.blur();
      this.myInput.nativeElement.focus();
    },150);

    if(currentProjectName != oldProjectName ){
      
      console.log("Current Proj 1 = ", currentProjectName);
      console.log("Old Proj 1 = ", oldProjectName);


      document.getElementsByClassName("searchbar-input")["0"].value = "";
      //document.getElementById("main").style.display = "none";

      var oldurl = Constants.apiUrl+"api/documents/"+this.userdocumentData.apiKey+"/"+this.userdocumentData.SystemUserID+"/"+localStorage.getItem('CurrentProjectID')+"/xxxxxxxxxxxxxxxxxxx/xxx";
      this.http.get(oldurl).map(res => res.json()).subscribe(data => {
            this._sanitizer.bypassSecurityTrustStyle(data);
            this.userdocuments = data;
            console.log(this.userdocuments);
            localStorage.setItem('OldProjectName', this.userdocumentData.SystemProjectName);
            console.log("Old Proj 2 = ", oldProjectName);

            document.getElementById("main").style.display="block";
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
  }



  keys(obj){
      return Object.keys(obj);
  }

	public presentQRDocSearchActionSheet() {
		let actionSheet = this.actionSheetCtrl.create({
			title: 'Scan a QR Code',
			buttons: [
				{
					text: 'Scan',
					handler: () => {						
						this.scanDocQRCode()
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


	scanDocQRCode(){
			
		this.options = {prompt : "Scan your barcode"}

		this.barcodeScanner.scan(this.options).then(barcodedata => {

			this.scannedCode = barcodedata.text;			
      console.log("QR Scanned Code: ", this.scannedCode);     

			if(this.scannedCode.indexOf("=") > 0){
				var index = this.scannedCode.split( "=" );
        this.scannedCode = index[1];
        index = this.scannedCode.split( "-" );
        var auditCode = index[0];
        var projNum   = index[1];
				var documentQRDatasurl = Constants.apiUrl+"api/documentQRData/"+this.apiKey+"/"+auditCode+"/"+projNum+"/"+this.userdocumentData.SystemUserID;
				this.http.get(documentQRDatasurl).map(res => res.json()).subscribe(data => {
			      this._sanitizer.bypassSecurityTrustStyle(data);
            this.documentQRData = data; 

            console.log("Doc QR Data",this.documentQRData);

            this.documentID     = this.documentQRData["0"].DocumentID;
            this.documentNumber = this.documentQRData["0"].DocumentNumber;
            this.projectID      = this.documentQRData["0"].ProjectID;
            this.systemclientID = this.documentQRData["0"].SystemClientID;
          
            this.openDocumentIdInfo(this.systemclientID,this.documentID,this.projectID,this.userdocumentData.SystemUserID); 
					
					},err => {
					  console.log("Get defects from sticker code failed.");
				  });
      } 
      
		});
	}



  checkBlur($event){
    console.log("Got Blur");
    console.log("Value ",$event._value);
    console.log("Value ",$event._value);
  }

checkFocus($event){
  console.log("Got Focus");
  console.log("Value ",$event._value);
}

  searchByKeyword($event){

    this.selectedProjectName     = localStorage.getItem('CurrentProjectName');    
    var documentSystemUserID1    = this.userdocumentData.SystemUserID;
    var documentSystemProjectID1 = localStorage.getItem('CurrentProjectID');    
    var searchTerm               = $event.srcElement.value;
    var localDocumentData        = JSON.parse(localStorage.getItem('userSystemData'));
    var localApiKey              = localDocumentData[0].apiKey;
    this.eventInstance           = $event;
    this.dsearch                 = $event.srcElement.value;

    if(typeof searchTerm  !== "undefined"){
      if(searchTerm.length > 1 ){
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
            this.renderer.invokeElementMethod($event.target, 'blur');
        },
        err => {
            console.log("Oops!");
        }
      ); 
    }
    
  } else {
      var oldurl1 = Constants.apiUrl+"api/documents/"+this.userdocumentData.apiKey+"/"+this.userdocumentData.SystemUserID+"/"+localStorage.getItem('CurrentProjectID')+"/xxxxxxxxxxxxxxxxxxx/xxx";
      this.http.get(oldurl1).map(res => res.json()).subscribe(data => {
            this._sanitizer.bypassSecurityTrustStyle(data);
            this.userdocuments = data;
            document.getElementById("maindiv").style.display="block";
            console.log(this.userdocuments);
        },
        err => {
            console.log("Oops!");
        }
      );      
    }
    
  }
  

  openDocument(clientid,projectid,docid,ext){
    this.navCtrl.push(DocumentViewer,{clientid,projectid,docid,ext});
  }
  

  openRasterDocument(clientid,projectid,docid,ext){
    this.navCtrl.push(DocumentViewer,{clientid,projectid,docid,ext});
   }

  fixImage(image){

    if(image.indexOf("<span") != -1){
      var pt1 = "<span class='hilite'>";
      var pt2 = "</span>";
      var rep = "";
      var image = image.replace(pt1,rep);
      image = image.replace(pt2,rep);
    }

    console.log("Fixed Image: ",image);
    return image;    
  }

  openDocumentInfo(docimg, docid, docno1,search){ 

    var pt1 = "<span class='hilite'>";
    var pt2 = "</span>";
    var rep = "";
    var docno1 = docno1.replace(pt1,rep);
    docno1 = docno1.replace(pt2,rep);

    this.navCtrl.push(DocumentInfo,{docimg, docid, docno1, search});
  }

  
  openDocumentIdInfo(iscid,idid,ipid,iuid){ 
    this.navCtrl.push(DocumentIdInfo,{iscid,idid,ipid,iuid});
  }


  openDocumentAudit(docimg, docid, docno1){ 
    this.navCtrl.push(DocumentAudit,{docimg, docid, docno1});
  }

  openDocumentSend(docimg, docid, docno1){ 
    this.navCtrl.push(AboutPage,{docimg, docid, docno1});
  }


  documentAdd(docid,docnumber){

    document.getElementById(docid).style.visibility = "visible";

    this.selecteddocument = docid;
    console.log("Sending back: ",this.selecteddocument);
		//this.viewCtrl.dismiss();

    var checkselecteddocids = localStorage.getItem('selecteddocids')
			
    if(checkselecteddocids == ""){
      localStorage.setItem('selecteddocids',this.selecteddocument);
    }
    if(checkselecteddocids != ""){
      var updateselecteddocids = checkselecteddocids+","+this.selecteddocument;
      localStorage.setItem('selecteddocids',updateselecteddocids);
    }

  }

	removedoc(docid){

    document.getElementById(docid).style.visibility = "hidden";

		var selecteddocids = localStorage.getItem('selecteddocids');
		this.adddocids = selecteddocids.split(',');		
		if(this.adddocids.indexOf(docid) > -1){

			var docindex = this.adddocids.indexOf(docid);		
			this.adddocids.splice(docindex,1);
			localStorage.setItem('selecteddocids',this.adddocids.join(","));
		}

	}

	ionViewWillLeave() {
    if(this.selecteddocument !== ""){
      this.callback(this.selecteddocument).then(()=>{});
    }
  }
  
	dismiss() {
    if(this.selecteddocument !== ""){
      this.viewCtrl.dismiss();
    }
	}  

}
                                                  