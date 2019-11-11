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
	defects:any;
	apiKey:string;
	callback: any;
	scanData : {};
	options :BarcodeScannerOptions;
	calledbysnag:any;

	constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, private barcodeScanner:BarcodeScanner, private _sanitizer: DomSanitizer, public http: Http) {}
		
	ionViewWillEnter() {
		this.callback  = this.navParams.get("callback")
		var defectData = JSON.parse(localStorage.getItem('userSystemData'));
		this.apiKey    = defectData[0].apiKey; 			
		this.calledbysnag  = this.navParams.get('newsnag');
		console.log("Newsnag = ",this.calledbysnag);
	}

	scanQRCode(){

		this.options = {prompt : "Scan your barcode"}

		this.barcodeScanner.scan(this.options).then(barcodedata => {
			this.scannedCode = barcodedata.text;			
			var index = this.scannedCode.indexOf( "-" )+1;

			//url should be http://projectvaultuk.com/qr.aspx?12345-d533aedf-1511-4fd8-8692-9f46dd7b3e9c = 76
			//d533aedf-1511-4fd8-8692-9f46dd7b3e9c = 36

			// QR Code - Return RoomID
			if(index != 7 && this.calledbysnag == "Y"){
				this.isroom = "N";
				localStorage.setItem('QRDefect',this.scannedCode);
				var defecturl = Constants.apiUrl+"api/qrroom/"+this.apiKey+"/"+this.scannedCode+"/newdefect";	
		    this.http.get(defecturl).map(res => res.json()).subscribe(data => {
		      this._sanitizer.bypassSecurityTrustStyle(data);
					this.defects = data;         
					this.scannedCode = this.defects["0"].name;
					console.log(this.scannedCode);
				},err => {
				  console.log("Oops!");
			  });				
			}
	
			// QR Code - Return Defect details
			if(index != 7 && this.calledbysnag == "N"){
				this.isroom = "N";
				localStorage.setItem('QRDefect',this.scannedCode);
				var defecturl = Constants.apiUrl+"api/qrroom/"+this.apiKey+"/"+this.scannedCode+"/defect";	
		    this.http.get(defecturl).map(res => res.json()).subscribe(data => {
		      this._sanitizer.bypassSecurityTrustStyle(data);
					this.defects = data;         
					this.scannedCode = this.defects["0"].name;
					console.log(this.scannedCode);
				},err => {
				  console.log("Oops!");
			  });				
			}		


			//url should be http://projectvaultuk.com/qr.aspx?12345-d533aedf-1511-4fd8-8692-9f46dd7b3e9c = 76
			//d533aedf-1511-4fd8-8692-9f46dd7b3e9c = 36
			// Return RoomID
			if(index == 7 && this.calledbysnag == "Y"){
				this.isroom = "Y";
				this.scannedCode = this.scannedCode.substring(index);
				localStorage.setItem('QRDefect',this.scannedCode);
				var roomurl = Constants.apiUrl+"api/qrroom/"+this.apiKey+"/"+this.scannedCode+"/newdefect";	
		    this.http.get(roomurl).map(res => res.json()).subscribe(data => {
		      this._sanitizer.bypassSecurityTrustStyle(data);
					this.defects = data;          
					this.scannedCode = this.defects;
					console.log(this.scannedCode);
				},err => {
				  console.log("Oops!");
			  });
			}

			// Return Defect details
			if(index == 7 && this.calledbysnag != "Y"){
				this.isroom = "Y";
				this.scannedCode = this.scannedCode.substring(index);
				localStorage.setItem('QRDefect',this.scannedCode);
				var roomurl = Constants.apiUrl+"api/qrroom/"+this.apiKey+"/"+this.scannedCode+"/room";	
		    this.http.get(roomurl).map(res => res.json()).subscribe(data => {
		      this._sanitizer.bypassSecurityTrustStyle(data);
					this.defects = data;          
					this.scannedCode = this.defects;
					console.log(this.scannedCode);
				},err => {
				  console.log("Oops!");
			  });
			}

		});

	}


	dismiss() {
		this.viewCtrl.dismiss();
	} 

	ionViewWillLeave() {
		this.callback(this.scannedCode).then(()=>{
			console.log(this.scannedCode);
		   //this.navController.pop();
		   //this.viewCtrl.dismiss();
		});
	}

}

