import { BarcodeScanner ,BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()

@Component({
  selector: 'page-qrcode',
  templateUrl: 'qrcode.html',
})

export class QrcodePage {

  scannedCode:string;
  callback: any;
  scanData : {};
  options :BarcodeScannerOptions;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, private barcodeScanner:BarcodeScanner) {
  }

	ionViewWillEnter() {
	  this.callback = this.navParams.get("callback")
	}

	ionViewDidLoad() {
	console.log('ionViewDidLoad QrcodePage');
	}

	scanQRCode(){
		this.options = {
			prompt : "Scan your barcode "
		}
		this.barcodeScanner.scan(this.options).then(barcodedata => {
			this.scannedCode = barcodedata.text;
		}).catch(err => {
			console.log('Error', err);
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
