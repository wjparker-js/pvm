import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Http } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
import * as Constants from '../../providers/constants';


@IonicPage()
@Component({
  selector: 'page-inspection-modal',
  templateUrl: 'inspection-modal.html',
})

export class InspectionModalPage implements OnInit {

  itemid:any;
  templateid:any;
  addremove:any;

  constructor(
    public navCtrl: NavController,     
    private _sanitizer: DomSanitizer, 
    public viewCtrl: ViewController, 
    public navParams: NavParams, 
    public http: Http
  ) { }

    ngOnInit(){
      this.itemid     = this.navParams.get("itemid");
      this.templateid = this.navParams.get("templateid");
      this.addremove  = this.navParams.get("addremove");    
      console.log(this.itemid);
      console.log(this.templateid);
      console.log(this.addremove);
    }

  ionViewDidLoad() {
    

  }

  
  dismiss() {
    this.viewCtrl.dismiss();
  }


}
