import { BarcodeScanner ,BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Http } from '@angular/http';
import * as Constants from '../../providers/constants';
import { DomSanitizer } from '@angular/platform-browser';

@IonicPage()

@Component({
  selector: 'page-qrcode',
  templateUrl: 'qrcode.html',
})

export class QrcodePage {

	scannedCode:string;
	isroom:any;
	location:any;
	snag:any;
	defects:any;
	apiKey:string;
	callback: any;
	scanData : {};
	options :BarcodeScannerOptions;
	calledbysnag:any;

	constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, private barcodeScanner:BarcodeScanner, private _sanitizer: DomSanitizer, public http: Http) {}
		
	ionViewWillEnter() {
		this.callback      = this.navParams.get("callback")
		var defectData     = JSON.parse(localStorage.getItem('userSystemData'));
		this.apiKey        = defectData[0].apiKey; 			
		this.calledbysnag  = this.navParams.get('newsnag');
	}

	scanQRCode(){
		
		this.options = {prompt : "Scan your barcode"}

		this.barcodeScanner.scan(this.options).then(barcodedata => {
			this.scannedCode = barcodedata.text;
			var index = this.scannedCode.indexOf( "-" );

			// get location
			// QR Code on Page - Return Location from LocationMap
			if(index == 5 && this.calledbysnag == "Y"){
				var res = this.scannedCode.split("-");
				this.location = res[1]+"-"+res[2]+"-"+res[3]+"-"+res[4]+"-"+res[5];
				localStorage.setItem('QRLocationMapID',this.scannedCode);
				var pagelocationurl = Constants.apiUrl+"api/qrroom/"+this.apiKey+"/"+this.location+"/snaglocationpage";	
			    this.http.get(pagelocationurl).map(res => res.json()).subscribe(data => {
			      this._sanitizer.bypassSecurityTrustStyle(data);
						this.defects = data;         
						this.location = this.defects["0"].Name;
					},err => {
					  console.log("Get locatioo from door code failed.");
				  });				
			}
			
			// get location
			// QR Code on Sticker - Return Location from BranchOrder
			if(index == 8 && this.calledbysnag == "Y"){
				this.location = this.scannedCode; 
				localStorage.setItem('QRBranchOrderID',this.scannedCode);
				var stickerlocationurl = Constants.apiUrl+"api/qrroom/"+this.apiKey+"/"+this.location+"/snaglocationsticker";	
			    this.http.get(stickerlocationurl).map(res => res.json()).subscribe(data => {
			      this._sanitizer.bypassSecurityTrustStyle(data);
						this.defects = data; 
						this.location = this.defects["0"].Name;
					},err => {
					  console.log("Get locatioo from sticker code failed.");
				  });
			}

			// Get Defects
			// QR Code - Return Defects in this room
			if(index == 5 && this.calledbysnag == "N"){
				this.location = this.scannedCode; 
				localStorage.setItem('QRLocationMapID',this.scannedCode);
				var pagedefecturl = Constants.apiUrl+"api/qrdefects/"+this.apiKey+"/"+this.location+"/defectspage";	
			    this.http.get(pagedefecturl).map(res => res.json()).subscribe(data => {
			      this._sanitizer.bypassSecurityTrustStyle(data);
						this.defects = data;  
					},err => {
					  console.log("Get defects from door code failed.");
				  });				
			}
			
			// Get Defects
			// QR Code on Sticker - Return single defect
			if(index == 8 && this.calledbysnag == "N"){
				this.location = this.scannedCode; 
				localStorage.setItem('QRBranchOrderID',this.scannedCode);
				var stickerdefectsurl = Constants.apiUrl+"api/qrdefects/"+this.apiKey+"/"+this.defects+"/defectssticker";	
			    this.http.get(stickerdefectsurl).map(res => res.json()).subscribe(data => {
			      this._sanitizer.bypassSecurityTrustStyle(data);
						this.defects = data;        
					},err => {
					  console.log("Get defects from sticker code failed.");
				  });
			}
			
		});

	}

	dismiss() {
		this.viewCtrl.dismiss();
	} 

	ionViewWillLeave() {
		this.callback(this.location).then(()=>{
			//console.log(this.location);
		   //this.navController.pop();
		   //this.viewCtrl.dismiss();
		});
	}

}

