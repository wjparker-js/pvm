import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController  } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as Constants from '../../providers/constants';

//let apiUrl = 'http/energy.lau.com.es:57689/api/auth?apiKeyUserProjects=';

@IonicPage()

@Component({
  selector: 'page-projects',
  templateUrl: 'projects.html',
})

export class ProjectsPage {

  userProjects: any;
  userApiKey : any;
  selectedProjectName: any;
  avatardata: any;

  userProjectData = {
    "UserName": "",
    "SystemClientID": "",
    "SystemUserID": "",
    "apiKey":"",
    "Company":"",
    "Email":"",
    "ProjectName":""
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, private toastCtrl:ToastController) {


  }

  ionViewWillEnter() {

    var projectData = JSON.parse(localStorage.getItem('userSystemData'));

    this.selectedProjectName       = localStorage.getItem('CurrentProjectName');

    this.userProjectData.SystemUserID   = projectData[0].SystemUserID;
    this.userProjectData.apiKey         = projectData[0].apiKey;
    this.userProjectData.UserName       = projectData[0].Name;
    this.userProjectData.Company        = projectData[0].Company;
    this.userProjectData.SystemClientID = projectData[0].SystemClientID;
    this.userProjectData.Email          = projectData[0].Email; 
    this.userProjectData.ProjectName    = localStorage.getItem('CurrentProjectName'); 
    this.avatardata                     = localStorage.getItem('avatar');


    console.log("Projects Avatar = "+this.avatardata);
    console.log(this.userProjectData.UserName);

    var userApiKey = this.userProjectData.apiKey;  
    
    console.log(userApiKey);
  
    this.http.get(Constants.apiUrl+'api/projects/'+userApiKey).map(res => res.json()).subscribe(data => {
          this.userProjects = data;
          console.log(this.userProjects);
      },
      err => {
          console.log("Oops!");
      }
    );  
    
  }

  saveProject(name,id){
    localStorage.setItem('CurrentProjectName', name);
    localStorage.setItem('CurrentProjectID', id);
    this.presentProjectToast("Project changed to: "+name);
    this.selectedProjectName = name;
  }

  presentProjectToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 1000,
      position: 'middle'
    });
    toast.present();
  }

}
