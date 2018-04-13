import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { DocumentTabs } from '../documenttabs/documenttabs';
import { AuthService } from "../../providers/auth-service";
//import {Md5} from '../../../node_modules/ts-md5/dist/md5';

@IonicPage()

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class Login {
  
  public responseData  : any;
  userSystemData = {"id":"","password":""};  

  constructor(public navCtrl: NavController, public authService: AuthService, private toastCtrl:ToastController) {}  

  ionViewDidEnter() {
  this.userSystemData.id        = localStorage.getItem('login_id');
  this.userSystemData.password  = localStorage.getItem('login_password');
  }


  login(){    

    if(this.userSystemData.id && this.userSystemData.password){

        this.authService.getData(this.userSystemData).then((result) =>{

        this.responseData = result;

        console.log(this.responseData);
        
        if(this.responseData[0].Email.trim() == this.userSystemData.id.trim())
          {
            localStorage.setItem('login_id', this.userSystemData.id);
            localStorage.setItem('login_password', this.userSystemData.password); 
            localStorage.setItem('userSystemData', JSON.stringify(this.responseData));            
            this.navCtrl.push(TabsPage);
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
