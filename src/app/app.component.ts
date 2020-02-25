import { Component } from '@angular/core';
import { Platform, App, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SplitPane } from '../providers/split-pane';
import { Login } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {

  rootPage:any = Login; 
  SysUserID:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public app: App, public splitPane: SplitPane, public menu: MenuController) {
    platform.ready().then(() => {
      //statusBar.styleDefault();
      //splashScreen.hide();
      
    });
  }

  ionViewWillEnter() {
    var userData  = JSON.parse(localStorage.getItem('userSystemData'));
    this.SysUserID  = userData[0].Name;    
  }

   backToWelcome(){
    const root = this.app.getRootNav();
    root.popToRoot();
    //this.menu.enable(true); 
  }

  logout(){
    this.menu.enable(false); 

    // Clear local storage
    localStorage.setItem('login_id', "xxx-xxx");
    localStorage.setItem('login_password', "xxx-xxx");
    localStorage.setItem('userSystemData', "");
    localStorage.setItem('CurrentProjectName', "");
    localStorage.setItem('CurrentProjectID', "");
    localStorage.setItem('CurrentProjectClientID', "");
    localStorage.setItem('Role-Name', "");
    localStorage.setItem('Role-Description', "");
    localStorage.setItem('Role-PA5038', "");
    localStorage.setItem('Role-PA5039', "");
    localStorage.setItem('Role-PA5073', "");
    localStorage.setItem('postimage', "");
    localStorage.setItem('image', "");
    localStorage.setItem('preimage', "");
    localStorage.setItem('locationimage', "");
    localStorage.setItem('location', "");
    localStorage.setItem('OldProjectName', "");
    localStorage.setItem('CurrentProjectRoleID', "");
    

    setTimeout(()=> this.backToWelcome(), 200); 
      
  }

  
}
