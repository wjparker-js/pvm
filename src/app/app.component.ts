import { Component, ViewChild } from '@angular/core';
import { Platform, App, MenuController, Nav} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SplitPane } from '../providers/split-pane';
import { Login } from '../pages/login/login';
import { Http } from '@angular/http';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {

  @ViewChild('content') nav: Nav;

  rootPage:any = Login; 
  SysUserID:any;

  constructor(
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen, 
    public app: App, 
    public splitPane: SplitPane, 
    public http: Http, 
    public menu: MenuController) 
    {
    platform.ready().then(() => {
      //statusBar.styleDefault();
      //splashScreen.hide();
      var userData  = localStorage.getItem('Role-Name');
      this.SysUserID  = userData; 
    });
  }

  ionViewWDidEnter() {  
  }

   backToWelcome(){
    const root = this.app.getRootNav();
    root.popToRoot();
    //this.menu.enable(true); 
  }

  logout(){
    this.menu.enable(false); 

    localStorage.setItem('login_id', "wjparker@servicepointuk.com");
    localStorage.setItem('login_password', "");
    localStorage.setItem('userSystemData', "");
    localStorage.setItem('CurrentProjectName', "");
    localStorage.setItem('CurrentProjectID', "");
    localStorage.setItem('CurrentProjectClientID', "");
    localStorage.setItem('Role-Name', "");
    localStorage.setItem('Role-Description', "");
    localStorage.setItem('Role-PA5038', "");
    localStorage.setItem('Role-PA5073', "");
    localStorage.setItem('Role-PA5039', "");
    localStorage.setItem('postimage', "");
    localStorage.setItem('image', "");
    localStorage.setItem('preimage', "");
    localStorage.setItem('locationimage', "");
    localStorage.setItem('location', "");
    localStorage.setItem('OldProjectName', "");
    localStorage.setItem('CurrentProjectRoleID', "");
    localStorage.setItem('ProjectThumb', ""); 
    localStorage.setItem('selecteddocids',"");
    localStorage.setItem('removeddocids',"");  
    localStorage.setItem('online',"");   

    setTimeout(()=> this.backToWelcome(), 200);       
  }

  
}