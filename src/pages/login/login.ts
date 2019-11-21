import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { DocumentTabs } from '../documenttabs/documenttabs';
import { AuthService } from "../../providers/auth-service";
import { Http } from '@angular/http';
import * as Constants from '../../providers/constants';
import {Md5} from 'ts-md5/dist/md5';

@IonicPage()

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class Login {

  @ViewChild('input') myInput ;

  public defectsEnabled : boolean;
  
  public responseData : any;
  public userLoginData: any;
  public showLogin: boolean = false;
  public PIN:any;
  public md5:any;
  userSystemData = {"id":"","password":"","sysuserid":"","currentproject":"","apiKey":""};  

  constructor(
    public navCtrl: NavController, 
    public authService: AuthService, 
    private toastCtrl:ToastController, 
    public http: Http) 
  {}  
  


  ionViewWillEnter() {

    if ((localStorage.getItem('login_password') !== null) && (localStorage.getItem('login_password') !== "xxx-xxx")) {
      this.showLogin = true;
      var userData                       = JSON.parse(localStorage.getItem('userSystemData'));
      this.userSystemData.sysuserid      = userData[0].SystemUserID;
      this.userSystemData.apiKey         = userData[0].apiKey;
      this.userSystemData.password       = localStorage.getItem('login_password');
      this.userSystemData.id             = localStorage.getItem('login_id');
      this.userSystemData.currentproject = localStorage.getItem('CurrentProjectID');
    }

    if ((localStorage.getItem('login_password') == "null" && localStorage.getItem('login_id') == null) || (localStorage.getItem('login_password') == "xxx-xxx" && localStorage.getItem('login_id') == "xxx-xxx") ) {
      this.showLogin = false;
      this.userSystemData.password ="xxx-xxx";
      console.log("New User.")
    }

  }

  ionViewLoaded() {

    setTimeout(() => {
      this.myInput.setFocus();
    },150);
 }


  newuser(){    
    this.userSystemData.password = "xxx-xxx";

    this.authService.getData(this.userSystemData).then((result) =>{

      this.responseData = result;

      if(this.responseData[0].SystemUserID === "Not Found") {
        var msgUser = this.userSystemData.id+" is not a ProjectVault user.";
        this.presentNewUserToast(msgUser);
      } 

      if(this.responseData[0].SystemUserID != "Not Found")  {
        localStorage.setItem('login_id',       this.responseData["0"].Email .toLowerCase());
        var haspin = this.responseData["0"].PIN;

        if(haspin == "" || haspin =="spuk" || haspin == null){
          localStorage.setItem('login_password', this.responseData["0"].PIN); 
          this.presentToast("An email has been sent.");
          this.userSystemData.id = this.responseData["0"].Email;
          this.userSystemData.password = "";
          this.showLogin = true;
        } 
        
        if(haspin != "" || haspin !="spuk" || haspin != null){
          this.userSystemData.id = this.responseData["0"].Email;
          this.userSystemData.password = "";
          this.showLogin = true;}
        }
        
      },(err) => {
        this.presentToast("There was an Email Send error.");
      });
  }



  login(){    

    if(this.userSystemData.id && this.userSystemData.password){

        this.authService.getData(this.userSystemData).then((result) =>{
        this.responseData = result;     

        if(this.responseData[0].Email.trim().toLowerCase() == this.userSystemData.id.trim().toLowerCase()) {

            this.md5 = Md5.hashStr(this.userSystemData.password);
            console.log(this.md5);

            localStorage.setItem('login_id',       this.userSystemData.id.toLowerCase());
            localStorage.setItem('login_password', this.userSystemData.password); 
            localStorage.setItem('userSystemData', JSON.stringify(this.responseData)); 
            
            var actiontext = "Mobile+-+Logged+In+-+"+this.userSystemData.id.toLowerCase().trim();

            this.http.get(Constants.apiUrl+'api/writeaudit/'+this.userSystemData.apiKey+'/'+this.userSystemData.sysuserid+'/'+this.userSystemData.currentproject+'/'+'00000000-0000-0000-0000-000000000000'+'/'+'96'+'/'+actiontext).map(res => res.json()).subscribe(data => {
              this.userLoginData = data;
              },err => {
                  console.log("Oops! - Write Audit");
              }
            ); 
            this.navCtrl.push(TabsPage);
          } else {
            this.presentToast("Please enter a valid username and password");
          }
        }, (err) => {
          this.presentToast("There was a connection error.");
        });
    } else {
      this.presentToast("Please enter a valid username and password");
    }  
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 5000,
      position: 'top'
    });
    toast.present();
  }

  presentNewUserToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 5000,
      cssClass: 'toast',
      position: 'middle'
    });
    toast.present();
  }

}
