import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-changedate',
  templateUrl: 'changedate.html',
})
export class ChangedatePage {

  statuschange:string;
  callback: any;

	constructor(public navCtrl: NavController,  public viewCtrl: ViewController, public navParams: NavParams) {
  }

  ionViewWillEnter() {
	this.callback = this.navParams.get("callback")
  }

  dismiss() {
		this.viewCtrl.dismiss();
	} 

	ionViewWillLeave() {
		this.callback(this.statuschange).then(()=>{});
	}

	sendBack(item){
		this.statuschange = item;
		this.dismiss();
	}

}
