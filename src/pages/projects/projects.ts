import { ReasonsPage } from './../reasons/reasons';
import { TabsPage } from './../tabs/tabs';
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
  userProject: any;
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, private toastCtrl:ToastController) {}

  ionViewWillEnter() {

    var projectData = JSON.parse(localStorage.getItem('userSystemData'));

    this.userProjectData.SystemUserID   = projectData[0].SystemUserID;
    this.userProjectData.SystemClientID = projectData[0].SystemClientID;
    this.userProjectData.apiKey         = projectData[0].apiKey;
    this.userProjectData.UserName       = projectData[0].Name;
    this.userProjectData.Company        = projectData[0].Company;
    this.userProjectData.Email          = projectData[0].Email; 
    this.selectedProjectName            = localStorage.getItem('CurrentProjectName');
    this.userProjectData.ProjectName    = localStorage.getItem('CurrentProjectName'); 
    this.avatardata                     = localStorage.getItem('avatar');

    var userApiKey = this.userProjectData.apiKey;  
 
    this.http.get(Constants.apiUrl+'api/projects/'+userApiKey).map(res => res.json()).subscribe(data => {
          this.userProjects = data;
      },
      err => {
          console.log("Oops!");
      }
    );      
  }

  saveProject(name,id,scid){

    localStorage.setItem('CurrentProjectName', name);
    localStorage.setItem('CurrentProjectID', id);
    localStorage.setItem('CurrentProjectClientID', scid);
    this.userProjectData.ProjectName = localStorage.getItem('CurrentProjectName');
    this.presentProjectToast("Project changed to: "+name);
    this.selectedProjectName = name;

    var userApiKey1 = this.userProjectData.apiKey;  
 
    this.http.get(Constants.apiUrl+'api/project/'+userApiKey1+"/"+this.userProjectData.SystemUserID+"/"+id).map(res => res.json()).subscribe(data => {
          this.userProject = data;
          console.log("Selected Project: ",this.userProject);

          var RoleName = this.userProject["0"].RoleName;
          var RoleDescription = this.userProject["0"].RoleDescription;
          var PA5038 = this.userProject["0"].PA5038;
          var PA5039 = this.userProject["0"].PA5039;
          var PA5073 = this.userProject["0"].PA5073;

          localStorage.setItem('Role-Name', RoleName);
          localStorage.setItem('Role-Description', RoleDescription);
          localStorage.setItem('Role-PA5038', PA5038);
          localStorage.setItem('Role-PA5039', PA5039); 
          localStorage.setItem('Role-PA5073', PA5073);  
          localStorage.setItem('postimage', ""); 
          localStorage.setItem('image', ""); 
          localStorage.setItem('preimage', ""); 
          localStorage.setItem('locationimage', ""); 
          localStorage.setItem('location', ""); 
          //localStorage.setItem('CurrentProjectClientID', "");
          
          

          console.log(this.navCtrl.parent.select(0));  
      },
      err => {
          console.log("Oops!");
      }
    );  
  }

  presentProjectToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
    this.navCtrl.parent.select(0);
  }

}
