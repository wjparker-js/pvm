import { BarcodeScanner } from '@ionic-native/barcode-scanner';
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

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, private barcodeScanner:BarcodeScanner) {
  }

	ionViewWillEnter() {
	  this.callback = this.navParams.get("callback")
	}

	ionViewDidLoad() {
	console.log('ionViewDidLoad QrcodePage');
	}

	scanQRCode(){
		this.barcodeScanner.scan().then(barcodedata => {
			this.scannedCode = barcodedata.text;
		})
	}

	dismiss() {
		this.viewCtrl.dismiss();
	} 

	ionViewWillLeave() {
		this.callback(this.scannedCode).then(()=>{
		   //this.navController.pop();
		   //this.viewCtrl.dismiss();
		});
	}

  

}
