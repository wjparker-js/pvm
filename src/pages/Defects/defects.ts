import { Component } from '@angular/core';
import { NavController, AlertController, Searchbar } from 'ionic-angular';
import { Http } from '@angular/http';
import { ViewChild, ElementRef, Renderer } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SnaggingPage } from '../snagging/snagging';
import { Snagging51Page } from '../snagging51/snagging51';
import { Snagging52Page } from '../snagging52/snagging52';
import { QrcodePage } from '../qrcode/qrcode';
import * as Constants from '../../providers/constants';
import { BarcodeScanner ,BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import 'rxjs/add/operator/map';
import { e } from '@angular/core/src/render3';

@Component({
  selector: 'page-defects',
  templateUrl: 'defects.html'
})

export class DefectsPage {

	
	@ViewChild('myDefectsSearchbar', { read: ElementRef }) myInput: ElementRef;

	defects: any;
	defectslist: any;
	scannedCode: any;
	associatedcode: any;
	options: any;
	details: any;
	createDefects: any;
	showdefects: any;
	manageDefects: any;
	defectRole: any;
	userApiKey : any;
	SystemCID: any;
	SystemProjectID: any;
	selectedProjectName:any;
	SystemUserID:any;
	eventInstance : any;
	dsearch : any;
	apiKey: any;
	image: any;
	location: string = "";

	
	myDefectsSearchTerm:any;
	defectssearchbar: Searchbar;

	public ImgUrl:any;
	public imageUrl: any;
	public thumbbase:any;
	public showDefects:any;

	constructor(public alertController: AlertController, public navCtrl: NavController, private barcodeScanner:BarcodeScanner, private _sanitizer: DomSanitizer, public http: Http) {}



	ionViewWillLeave(){

		this.defectslist  = "";

		var urls1 = Constants.apiUrl+"api/defects/"+this.apiKey+"/"+this.SystemProjectID+"/"+this.SystemUserID+"/1234567890/1/"+this.defectRole;

	    this.http.get(urls1).map(res => res.json()).subscribe(data => {
	        this._sanitizer.bypassSecurityTrustStyle(data);
				this.defects = data;        
		    },
		    err => {
		      console.log("Oops!");
		    }
		); 
	}


	
	ionViewWillEnter() {

		var defectData           = JSON.parse(localStorage.getItem('userSystemData'));
		this.SystemCID           = localStorage.getItem('CurrentProjectClientID');
		this.SystemProjectID     = localStorage.getItem('CurrentProjectID');
		this.selectedProjectName = localStorage.getItem('CurrentProjectName');
		this.SystemUserID        = defectData[0].SystemUserID;
		this.apiKey              = defectData[0].apiKey; 

		this.defectslist         = "";

		this.createDefects       = localStorage.getItem('Role-PA5038');
		this.showDefects         = localStorage.getItem('Role-PA5073');
		this.manageDefects       = localStorage.getItem('Role-PA5039');
		
		if(this.showDefects   != 0 && this.showDefects   != null){this.defectRole = "73"}
		if(this.createDefects != 0 && this.createDefects != null){this.defectRole = "38"}
		if(this.manageDefects != 0 && this.showDefects   != null){this.defectRole = "39"}


		var urls1 = Constants.apiUrl+"api/defects/"+this.apiKey+"/"+this.SystemProjectID+"/"+this.SystemUserID+"/1234567890/1/"+this.defectRole;

	    this.http.get(urls1).map(res => res.json()).subscribe(data => {
	        this._sanitizer.bypassSecurityTrustStyle(data);
				this.defects = data;        
		    },
		    err => {
		      console.log("Oops!");
		    }
		);

		var url = "";

		this.image = "https://projectvaultuk.com/PublicPics/"+this.SystemCID+"/"+this.SystemProjectID+"/LocationImages/";

		if(this.showDefects != 1){this.presentAlert();}

		this.imageUrl = Constants.publicUploadPath+this.SystemCID+'/'+this.SystemProjectID+'/LocationImages/';
	}



	async presentAlert() {
		const alert = await this.alertController.create({
		message: 'Snagging has not been implemented on this project or your user role cannot acces snags.',
		buttons: ['OK']
		});

		await alert.present();
	}

	async presentNoAccessAlert() {
		const alert1 = await this.alertController.create({
		message: 'Sorry, you cannot modify your defects once status is changed to Ready To Inspect or better.<br><br>   You can add a note by sliding the item to the left.',
		buttons: ['OK']
		});

		await alert1.present();
	}


	imageExists(url, callback) {
		var img = new Image();
		img.onload = function() { callback(true); };
		img.onerror = function() { callback(false); };
	}




	hexToBase64(str) {      
		switch(str) {
			case null: 
			case undefined: 
			case "": 	
				return this._sanitizer.bypassSecurityTrustUrl("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");
		  		//break;
			default:
				return btoa(String.fromCharCode.apply(null,
				str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
			)
		}
	}


	scanQRCode(){
			
		this.options = {prompt : "Scan your barcode"}

		this.defectslist  = "";

		this.barcodeScanner.scan(this.options).then(barcodedata => {

			this.scannedCode = barcodedata.text;			
			console.log("QR Code: ", this.scannedCode);

			if(this.scannedCode.indexOf("=") > 0){
				var index = this.scannedCode.split( "=" );
				this.location = index[1];
				// QR Code on Sticker - defects from BranchOrder
				var stickerdefectsurl = Constants.apiUrl+"api/defects/"+this.apiKey+"/"+this.SystemProjectID+"/"+this.SystemUserID+"/"+this.location+"/sticker/"+this.defectRole;
				this.http.get(stickerdefectsurl).map(res => res.json()).subscribe(data => {
			      this._sanitizer.bypassSecurityTrustStyle(data);
						this.defects = data; 
						this.defectslist = "";
						console.log(this.defects);
					},err => {
					  console.log("Get defects from sticker code failed.");
				  });
			} 
			
			if(this.scannedCode.indexOf("=") == -1) {
				var index1 = this.scannedCode.split( "-" );
				this.location = index1[1]+"-"+index1[2]+"-"+index1[3]+"-"+index1[4]+"-"+index1[5];
				// QR Code on Page - Return defects from BranchOrder
				var pagedefecturl = Constants.apiUrl+"api/defects/"+this.apiKey+"/"+this.SystemProjectID+"/"+this.SystemUserID+"/"+this.location+"/room/"+this.defectRole;	    
				this.http.get(pagedefecturl).map(res => res.json()).subscribe(data => {
					this._sanitizer.bypassSecurityTrustStyle(data);
					this.defects = data;       
					this.defectslist  = "";  
					console.log(this.defects);
				},err => {
				  console.log("Get defects from door code failed.");
				});		
			}

		});
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

		var url = Constants.apiUrl+"api/defects/"+this.apiKey+"/"+this.SystemProjectID+"/"+this.SystemUserID+"/"+searchTerm+"/xxx/"+this.defectRole;

	    this.http.get(url).map(res => res.json()).subscribe(data => {
	        this._sanitizer.bypassSecurityTrustStyle(data);
			this.defects = data;       

			if ( this.defects.length > 0 ) {          
				if(this.defects[0].thumbbase64 !== null || this.defects[0].thumbbase64 !== ""){
					this.ImgUrl = this._sanitizer.bypassSecurityTrustUrl("data:Image/*;base64,"+this.defects[0].thumbbase64);
				} else {
					this.ImgUrl = this._sanitizer.bypassSecurityTrustUrl("iVBORw0KGgoAAAANSUhEUgAAAMYAAABiCAIAAACEdDvyAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAbNSURBVHhe7Z3pleowDIVfXRQ09VANzVDMPMWWNy2JwxHEw7nfL5BlSZZvwMM2/34BCAWSAsFAUiAYSAoEA0mBYCApEAwkBYKBpEAwkBQIBpICwUBSIBhICgQDSYFgICkQDCQFgoGkQDCQFAjmKyX1fNx/fn7uT74LPsqspB4//4jbn9im5/22FXtBtX+pS2/jD0uKlfPz4PuVZylWjbwbSIr4RkldByRFQFKRQFJErKS2c/EtH2Q2bref+8Oc8aQnJ9+RRoc423gfpxyWBLU6r9iZ8vLcpNOtxuRIkKv0NLAS9wEp/XaH6FfU5RELLRw1pDK2tUM2IwXkMT/cSwRKqt+ADb69tVMspymid+TgvV764S55alw3wNQ8ZrGT5bEC7qWK0ZOdPHYkZQUkx7razizSTDQkkzNtTvT3bietbc5wRdRWJMfqKeO9SJSkyroHudfLr59XPIed3Dy5kzQuL5o2hQ0Jthr7rIudL6/sC9HM5CksNlaXuoA1eYmXqf52msmG8NzeZHaoze0isvFofVMEScrsxYZavLHyCaz0ZsMSynu+vOI6dny251aZLSAbEiWxvaaDNITKlGeKiYaRy1Fds0p/jRhJeXUSokk7nntwlGGaZcvIYufL8xfq2QcsJ2firvm4P2rx2SDiaaPbNHfgNCGS4nLs0aFJu54jdCSlI2QhTRsX7DdBFDtfXr2vfXcbULCcnImOeWdnDxpiBMymIRib8iFqIJ+oDhY4w/slNTRp17NQzziKodN+90Wx8+UR3kJ3G1CwnJyJjtlc1FxDeCoFHY7nQ4rq42F08yzrPUqxP/n0J2mj05YtI4qdL6/e176efcByciY6ZmNR2XPz3W1IcqO/7Jr6tr/zxhOhmzaS5c5SdiJLPpYtI2PMl+fl9+0DlpMz0TE7UlGO0i/fPyiPyNHMVkQRIym/UrllfF97Pu/pipL+jOzghuNKqGKny/MXetCAjOXkTHTMaqGTDSn39+sjcl6jFWEESapUSh79o3Ox9gtotuqYzwo5eF1yFya3K1nZlKiufL+SB/piS9LZ8vRCPfuA5eRMdMxKUux42BB269he4TSe+8rkoRVEej094p32c5KyKKtq68yr4ZtmN+tg51jcapz+lMleQj2tqBSmJrK2a7Y8a+6GZx+wnJyJjpnL7Bc625D6wm0m3WbGvslWdL6iwS8RJylCvHO39UBcIoXBUbkZozm/WnF+fMu0S8zbrpnynLmufcByciZ6NWpJERMNyRNlPHroyfNk59TbncZR/kVmJQXWRiqs4Wj3fUBSX4GvG/th751AUl8BC0c/j2atfVJRkNS3wNoh6FiUKUclOnux00eApL4H+Tm9dOh+PD92iGIgKRAMJAWCgaRAMJAUCAaSAsFAUiAYSAoEA0mBYCApEAwkBYKBpP4cH/+0ykk+Lan67qbzmdTP9au9zypZd7cSkNRIv5HhHxg79dkgSOpNXCkpqy2fltTi8rGApEZyP+pP46jdh6QOgaRGWFIPvqH23+uX+vj9+Ol7FpNkr+/TO3OQOuEF0/ZsSasevovhfAMvJWcf/imj6cIv4hpJpX7km6I3Zr/61ovvCLFf+gpJG0hehPENmMrczhynTnjBtD1b5n4SrbtQmht/WvOo8Ou4UFK1Y30n9R4Ur0Ef9QIfOhv9xDef2gum7dmSaObyEfEhQM3eubGJ0LlW4UpJtf42Eag9sJqdMAQZLKkTqb1g2s5Bae7gyyE7T3aUi9FCW41rJVUbVw3OuKUSvQsvSIrmS8pmn0ktyy5o+6ynvxYvwipcLal61XHvxLiWTUf27br+kqQUnOxUarUsRttnPT2/vZE1uFxSxcT7I8Z391Up6AVJ+TtzKrUXTNtnPf3y/JE1WEBSxZisYnx3X3naFZKSqb1g2j7r6fntjazBEpIq20dbZHfWVIne81BJnUrtBdP2WU8/uxdhFdaQVNuk/PJLN+62VivKMvkc78yJ1GwRrmwdknhpld3JbsVci1UkVVuY0Huw2cYXh7J17LizDSZ+JZUTqZuRPb3XkLy02q5CbqnNmGuxjqTq9UeM491A+pOfb1phyjYkRycPs1NJYz51X33xu/GL5L2zl9ayt9Xsx1yLhSS1bQtfheph5tyPobETpdl5uJqSFPHa77DxG4FZaH2SM5Iiuv9k5Mdci09LCnw9kBQIBpICwUBSIBhICgQDSYFgICkQDCQFgoGkQDCQFAgGkgLBQFIgGEgKBANJgWAgKRAMJAWCgaRAMJAUCAaSAsFAUiAYSAoEA0mBYCApEAwkBYKBpEAwkBQIBpICwUBSIBhICgQDSYFQfn//A0vimayUJFIvAAAAAElFTkSuQmCC");	
				}
			}
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
		this.navCtrl.push(QrcodePage, {"newsnag":"N",callback:this.myCallbackFunction1,"parentPage": this});
	}



	myCallbackFunction1 = (_params) => {		
		return new Promise((resolve, reject) => {
			this.location = _params;
			resolve();
			console.log("myCallbackFunction1",this.location);
			console.log(_params);
		});
	 }



	openSnag(snagid,orderstatus,locname,note){

		localStorage.setItem('location', locname); 
		console.log("Clicked open note");

		if(orderstatus == 50){this.navCtrl.push(Snagging51Page,{snagid,orderstatus,note});}

		if(orderstatus == 51){this.navCtrl.push(Snagging51Page,{snagid,orderstatus,note});}
	
		if((this.createDefects == 1 || this.manageDefects == 1) || note == 'note'){
			if(orderstatus == 52){this.navCtrl.push(Snagging52Page,{snagid,orderstatus,note});}
			if(orderstatus == 53){this.navCtrl.push(Snagging52Page,{snagid,orderstatus,note});}
		} 

		if((this.createDefects == 0 || this.manageDefects == 0)  && orderstatus > 51 && note == 'nonote'){
			this.presentNoAccessAlert();
		}

		if(this.manageDefects == 1){
			console.log("In 54 55");
			if(orderstatus == 54){this.navCtrl.push(Snagging52Page,{snagid,orderstatus,note});}
			if(orderstatus == 55){this.navCtrl.push(Snagging52Page,{snagid,orderstatus,note});}
		}
	}



	segmentChanged(segment){ 

			var searchTerm = "";		

			var htmlElement = document.getElementsByClassName("searchbar-input");
			
			if(htmlElement.length == 1){ searchTerm = htmlElement["0"].value;}
			if(htmlElement.length == 2){ searchTerm = htmlElement["1"].value;}		

			console.log(htmlElement);
			console.log(searchTerm);

			if(searchTerm == ""){searchTerm = "nosearch";}



			if(segment == "all"){

				var urls1 = Constants.apiUrl+"api/defects/"+this.apiKey+"/"+this.SystemProjectID+"/"+this.SystemUserID+"/"+searchTerm+"/1/"+this.defectRole;
				console.log(urls1);

		    	this.http.get(urls1).map(res => res.json()).subscribe(data => {
		        this._sanitizer.bypassSecurityTrustStyle(data);
				
		
				if(JSON.stringify(this.defects) === '{}'){
					console.log("Empty data");
				} else {
				this.defects = data;       
				console.log("Some data");   
				console.log(this.defects);
				}

			    },
			    err => {
			      console.log("Oops!");
			    }
				); 
			}

			if(segment == "new"){

					var urls2 = Constants.apiUrl+"api/defects/"+this.apiKey+"/"+this.SystemProjectID+"/"+this.SystemUserID+"/"+searchTerm+"/2/"+this.defectRole;
					console.log(urls2);

				    this.http.get(urls2).map(res => res.json()).subscribe(data => {
				        this._sanitizer.bypassSecurityTrustStyle(data);

				if(JSON.stringify(this.defects) === '{}'){
					console.log("Empty data");
				} else {
				this.defects = data;       
				console.log("Some data");   
				console.log(this.defects);
				}
				    },
				    err => {
				        console.log("Oops!");
				    }
					); 
				} 
			
			if(segment == "open"){

				var urls3 = Constants.apiUrl+"api/defects/"+this.apiKey+"/"+this.SystemProjectID+"/"+this.SystemUserID+"/"+searchTerm+"/3/"+this.defectRole;
				console.log(urls3);

			    this.http.get(urls3).map(res => res.json()).subscribe(data => {
				    this._sanitizer.bypassSecurityTrustStyle(data);

					if(JSON.stringify(this.defects) === '{}'){
						console.log("Empty data");
					} else {
					this.defects = data;       
					console.log("Some data");   
					console.log(this.defects);
					}

				    },
				    err => {
				        console.log("Oops!");
				    }
					); 
			}
		

  	}

}

