import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { QrcodePage } from '../qrcode/qrcode';


  

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
		this.navCtrl.push(QrcodePage, {callback:this.myCallbackFunction});
	}

	myCallbackFunction = (_params) => {
	 return new Promise((resolve, reject) => {
	     this.location = _params;
	     resolve();
	     console.log(this.location);
	 });
	}

	openList(){
		this.location = "From list";
	}

}
