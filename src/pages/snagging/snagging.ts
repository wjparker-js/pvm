import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { QrcodePage } from '../qrcode/qrcode';
import { LocationmapPage } from '../locationmap/locationmap';
  

@IonicPage()

@Component({
  selector: 'page-snagging',
  templateUrl: 'snagging.html',
})


export class SnaggingPage {

	public location:any;
	//public myCallbackFunction:function;

	constructor(public navCtrl: NavController, public navParams: NavParams) {
	}

	ionViewDidLoad() {
	console.log('ionViewDidLoad SnaggingPage');
	}

	openGetQRCode(){
		this.navCtrl.push(QrcodePage, {callback:this.myCallbackFunction1});
	}

	openList(){		
		this.navCtrl.push(LocationmapPage, {callback:this.myCallbackFunction1});
	}

	myCallbackFunction1 = (_params) => {
	 return new Promise((resolve, reject) => {
	     this.location = _params;
	     resolve();
	     console.log(this.location);
	 });
	}

}
