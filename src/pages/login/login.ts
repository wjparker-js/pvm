import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ToastController, MenuController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { AuthService } from "../../providers/auth-service";
import { Http } from '@angular/http';
import {Md5} from 'ts-md5/dist/md5';
import { Subscription} from 'rxjs/Subscription';
import { Network } from '@ionic-native/network';
import * as Constants from '../../providers/constants';

@IonicPage()

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class Login {

  @ViewChild('input') myInput ;

  public connected: Subscription;
  public disconnected: Subscription;
  public connectionmsg: string ="1";                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
  public defectsEnabled : boolean;
  public loginprojectuserdetails: any;  
  public responseData : any;
  public userLoginData: any;
  public apikey: any;
  public showLogin: boolean = false;
  public PIN:any;
  public md5:any;
  public userSystemData = {"id":"","password":"","sysuserid":"","currentproject":"","apiKey":""}; 


  constructor(
    public navCtrl: NavController, 
    public authService: AuthService, 
    private toastCtrl:ToastController,
    public  menu: MenuController,
    private network: Network,
    public http: Http) 
  {}    


  ionViewWillEnter() {

    this.network.onConnect().subscribe(data => {
      console.log("Connect:",data)          
      localStorage.setItem('online','1');
      this.displayNetworkUpdate(data.type);
      console.log(this.displayNetworkUpdate(data.type));
    }, error => console.log(error));
   
    this.network.onDisconnect().subscribe(data => {
      console.log("Disconnect:",data) 
      localStorage.setItem('online','0');
      this.displayNetworkUpdate(data.type);      
      console.log(this.displayNetworkUpdate(data.type));
    }, error => console.log(error));
 
    this.connectionmsg = " ";    

    if(this.connectionmsg == "NONE"){localStorage.setItem('online','0')} 
    if(this.connectionmsg != "NONE"){localStorage.setItem('online','1');}

    localStorage.setItem('selecteddocids',"");
    localStorage.setItem('removeddocids',"");

    if(this.connectionmsg == "NONE"){ 
      setTimeout(() => {
        this.navCtrl.push(TabsPage);
      },1000);
    }


    if ((localStorage.getItem('login_password') !== null) && (localStorage.getItem('login_password') !== "xxx-xxx")) {
      this.showLogin                     = true;
      var userData                       = JSON.parse(localStorage.getItem('userSystemData'));
      this.userSystemData.sysuserid      = userData[0].SystemUserID;
      this.userSystemData.sysuserid      = this.userSystemData.sysuserid.trim();
      this.userSystemData.apiKey         = userData[0].apiKey;
      this.apikey                        = userData[0].apiKey;
      this.userSystemData.password       = localStorage.getItem('login_password');
      this.userSystemData.id             = localStorage.getItem('login_id');
      this.userSystemData.currentproject = localStorage.getItem('CurrentProjectID');     
    }

    if ((localStorage.getItem('login_password') == null && localStorage.getItem('login_id') == null) || (localStorage.getItem('login_password') == "xxx-xxx" && localStorage.getItem('login_id') == "xxx-xxx") ) {
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
        this.presentToast(msgUser);
      } 

      if(this.responseData[0].SystemUserID != "Not Found")  {

        localStorage.setItem('login_id', this.responseData["0"].Email.toLowerCase());
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
          this.showLogin = true;
        }

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

        localStorage.setItem('login_id',       this.userSystemData.id.toLowerCase());
        localStorage.setItem('login_password', this.userSystemData.password); 
        localStorage.setItem('userSystemData', JSON.stringify(this.responseData)); 

        this.http.get(Constants.apiUrl+'api/loginprojectuserdetails/'+this.apikey +'/'+this.userSystemData.id.trim().toLowerCase()).map(res => res.json()).subscribe(data => {
          this.loginprojectuserdetails = data;
          localStorage.setItem('Role-Name',       	    this.loginprojectuserdetails["0"].RoleName);          
          localStorage.setItem('Role-PA5073',       	  this.loginprojectuserdetails["0"].PA5073);
          localStorage.setItem('Role-PA5038',         	this.loginprojectuserdetails["0"].PA5038);
          if(this.loginprojectuserdetails["0"].PA5038 == "1"){localStorage.setItem('Role-PA5073', "1")}
          localStorage.setItem('Role-PA5039',         	this.loginprojectuserdetails["0"].PA5039);
          if(this.loginprojectuserdetails["0"].PA5039 == "1"){localStorage.setItem('Role-PA5073', "1")}
          localStorage.setItem('Role-Description',      this.loginprojectuserdetails["0"].RoleDescription);
          localStorage.setItem('CurrentProjectName',    this.loginprojectuserdetails["0"].Name);
          localStorage.setItem('CurrentProjectID',      this.loginprojectuserdetails["0"].ProjectID);            
          localStorage.setItem('CurrentProjectRoleID',  this.loginprojectuserdetails["0"].ProjectRoleID);
          localStorage.setItem('CurrentProjectClientID',this.loginprojectuserdetails["0"].SystemClientID);    
          }, err => {console.log("Oops! - Write Audit");}
        );     
           
        var actiontext = "Mobile+-+Logged+In+-+"+this.userSystemData.id.toLowerCase().trim();
        this.http.get(Constants.apiUrl+'api/writeaudit/'+this.userSystemData.apiKey+'/'+this.userSystemData.sysuserid+'/'+this.userSystemData.currentproject+'/'+'00000000-0000-0000-0000-000000000000'+'/'+'96'+'/'+actiontext).map(res => res.json()).subscribe(data => {
          this.userLoginData = data;
          },err => {console.log("Oops! - Write Audit");}
        ); 

        setTimeout(() => {
          this.navCtrl.push(TabsPage);
        },1000);
        
      } else {
        this.presentToast("Please enter a valid username and password");
      }
    }, (err) => {
      this.presentToast("There was a connection error.");
    });
  } else {
    this.presentToast("Please enter a valid username and password");
  }  
  this.menu.enable(true);
}


  displayNetworkUpdate(connectionState: string){
    let networkType = this.network.type;
    this.connectionmsg = `${networkType}`;  
    console.log("In  displayNetworkUpdate");
    //this.connectionmsg = networkType;
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
