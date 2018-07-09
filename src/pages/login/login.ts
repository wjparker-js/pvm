import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { DocumentTabs } from '../documenttabs/documenttabs';
import { AuthService } from "../../providers/auth-service";
import { Http } from '@angular/http';
import * as Constants from '../../providers/constants';
//import {Md5} from '../../../node_modules/ts-md5/dist/md5';

@IonicPage()

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class Login {
  
  public responseData  : any;
  userLoginData: any;
  userSystemData = {"id":"","password":"","sysuserid":"","currentproject":"","apiKey":""};  

  constructor(public navCtrl: NavController, public authService: AuthService, private toastCtrl:ToastController, public http: Http) {}  
  

  ionViewWillEnter() {
    this.userSystemData.id             = localStorage.getItem('login_id');
    this.userSystemData.password       = localStorage.getItem('login_password');
    this.userSystemData.currentproject = localStorage.getItem('CurrentProjectID');

    var userData = JSON.parse(localStorage.getItem('userSystemData'));
    this.userSystemData.sysuserid  = userData[0].SystemUserID;
    this.userSystemData.apiKey    = userData[0].apiKey;
  }

  ionViewDidEnter() {
    //document.location.reload();
    }

  login(){    

    if(this.userSystemData.id && this.userSystemData.password){

        this.authService.getData(this.userSystemData).then((result) =>{

        this.responseData = result;

        console.log(this.responseData);
        
        if(this.responseData[0].Email.trim().toLowerCase() == this.userSystemData.id.trim().toLowerCase())
          {
            localStorage.setItem('login_id', this.userSystemData.id.toLowerCase());
            localStorage.setItem('login_password', this.userSystemData.password); 
            localStorage.setItem('userSystemData', JSON.stringify(this.responseData));     




            this.http.get(Constants.apiUrl+'api/writeaudit/'+this.userSystemData.apiKey+'/'+this.userSystemData.sysuserid+'/'+this.userSystemData.currentproject+'/'+'00000000-0000-0000-0000-000000000000'+'/'+'96'+'/'+'Mobile+-+Logged+In').map(res => res.json()).subscribe(data => {
                  this.userLoginData = data;
                  console.log(this.userLoginData);
              },
              err => {
                  console.log("Oops!");
              }
            ); 



            this.navCtrl.push(TabsPage);

            //api/writeaudit/{apikey}/{uid}/{pid}/{eid}/{aid}/{atx}

          } else {
            this.presentToast("Please enter a valid username and password");
          }
        }, (err) => {
          this.presentToast("There was a connection error.");
        });
    }
    else{
      this.presentToast("Please enter a valid username and password");
    }  
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 1000,
      position: 'top'
    });
    toast.present();
  }

}
