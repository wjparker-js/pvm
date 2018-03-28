import {Component} from '@angular/core';
import {NavController, App, AlertController} from 'ionic-angular';
import {AuthService} from "../../providers/auth-service";
import {Common} from "../../providers/common";

@Component({
  selector: 'page-home', 
  templateUrl: 'home.html'
})

export class HomePage {

  public userDetails : any;
  public resposeData : any;
  public dataSet : any;

  userPostData = {
    "UserName": "",
    "SystemClientID": "",
    "SystemUserID": "",
    "apiKey":"",
    "Company":"",
    "Email":"", 
    "ProjectID":""
  };

  constructor(public common: Common, private alertCtrl: AlertController,public navCtrl : NavController, public app : App, public authService : AuthService) {
    
    const data = JSON.parse(localStorage.getItem('userSystemData'));

    this.userPostData.SystemUserID   = data[0].SystemUserID;
    this.userPostData.apiKey         = data[0].apiKey;
    this.userPostData.UserName       = data[0].Name;
    this.userPostData.Company        = data[0].Company;
    this.userPostData.SystemClientID = data[0].SystemClientID;
    this.userPostData.Email          = data[0].Email;  
    this.userPostData.ProjectID      = localStorage.getItem('CurrentProjectID');  

    //localStorage.setItem('userPostData', JSON.stringify(this.userPostData));

    //this.getFeed();

  }
/*
  getFeed() {
    this.common.presentLoading();
    this
      .authService
      .postData(this.userPostData, "feed")
      .then((result) => {
        this.resposeData = result;
        if (this.resposeData.feedData) {
              this.common.closeLoading();
          this.dataSet = this.resposeData.feedData;
          console.log(this.dataSet);

        } else {
          console.log("No access");
        }

      }, (err) => {
        //Connection failed message
      });
  }

  feedUpdate() {
    if (this.userPostData.feed) {
      this.common.presentLoading();
       this
      .authService
      .postData(this.userPostData, "feedUpdate")
      .then((result) => {
        this.resposeData = result;
        if (this.resposeData.feedData) {
          this.common.closeLoading();
          this.dataSet.unshift(this.resposeData.feedData);
          this.userPostData.feed = "";
        } else {
          console.log("No access");
        }

      }, (err) => {
        //Connection failed message
      });
    }

  }

  feedDelete(feed_id, msgIndex) {
  
    if (feed_id > 0) {


      let alert = this.alertCtrl.create({
    title: 'Delete Feed',
    message: 'Do you want to buy this feed?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Delete',
        handler: () => {
           this.userPostData.feed_id = feed_id;
       this
      .authService
      .postData(this.userPostData, "feedDelete")
      .then((result) => {
        this.resposeData = result;
        if (this.resposeData.success) {
        this.dataSet.splice(msgIndex, 1);
        } else {
          console.log("No access");
        }

      }, (err) => {
        //Connection failed message
      });
        }
      }
    ]
  });
  alert.present();


     
    }

  }

  converTime(time) {
    let a = new Date(time * 1000);
    return a;
  }

  backToWelcome() {
    const root = this
      .app
      .getRootNav();
    root.popToRoot();
  }

  logout() {
    //Api Token Logout

    localStorage.clear();
    setTimeout(() => this.backToWelcome(), 1000);

  }
*/
};

