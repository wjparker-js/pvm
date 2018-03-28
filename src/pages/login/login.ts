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
  userSystemData = {"id":"","password":"","rememberme":""};  

  constructor(public navCtrl: NavController, public authService: AuthService, private toastCtrl:ToastController) {}  

  remember(){

    console.log("Remember: "+this.userSystemData.rememberme);

    if(this.userSystemData.id && this.userSystemData.password){

      if(this.userSystemData.rememberme="true"){
        localStorage.setItem('login_rememberme', "true");
        this.presentToast("You credentials have been saved, logging in."); 
        localStorage.setItem('login_id', this.userSystemData.id);
        localStorage.setItem('login_password', this.userSystemData.password);        
      } 
      
      if(this.userSystemData.rememberme="false"){
        localStorage.setItem('login_rememberme', "false");
        this.presentToast("Your credentials have been erased, logging out");  
        localStorage.setItem('login_id', "");
        localStorage.setItem('login_password', "");          
      }

      this.userSystemData.id         = localStorage.getItem('login_id');
      this.userSystemData.password   = localStorage.getItem('login_password');
      //this.userSystemData.rememberme = localStorage.getItem('login_rememberme');

      this.navCtrl.setRoot(this.navCtrl.getActive().component);

    }
  }

  login(){    

    if(this.userSystemData.id && this.userSystemData.password){

        this.authService.getData(this.userSystemData).then((result) =>{
        this.responseData = result;

        console.log(this.responseData);
        
        if(this.responseData)
          {
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
