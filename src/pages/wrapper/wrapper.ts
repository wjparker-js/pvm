import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';



@IonicPage()
@Component({
  selector: 'page-wrapper',
  templateUrl: 'wrapper.html',
})

export class WrapperPage {

  constructor(public iab:InAppBrowser, public navCtrl: NavController, public navParams: NavParams) {

    InAppBrowser
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WrapperPage');
  }

}
