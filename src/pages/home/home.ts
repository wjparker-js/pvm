import {Component, ViewChild, ElementRef} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {App, AlertController} from 'ionic-angular';
import {AuthService} from "../../providers/auth-service";
import {Common} from "../../providers/common";
import {Http} from '@angular/http';
import {DocumentSummary} from '../documentsummary/documentsummary';
import {WeatherProvider} from '../../providers/weather/weather';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import * as Constants from '../../providers/constants';


@Component({
  selector: 'page-home', 
  templateUrl: 'home.html'
})


export class HomePage {

  public userDetails : any;
  public resposeData : any;
  public avatardata: any;
  public dataSet : any;
  public dataSet1 : any;
  public dataSet2 : any;
  public citydataSet: any;
  public weather:any;
  public city:any;
  public weatherCity: any;
  public weatherIcon: any;
  public weatherDes: any;
  public weatherTemp: any;
  public weatherTemp_Max: any;
  public weatherTemp_Min: any;


  userPostData = {
    "UserName": "",
    "SystemClientID": "",
    "SystemUserID": "",
    "apiKey":"",
    "Company":"",
    "Email":"", 
    "ProjectID":"",
    "ProjectName":""
  };


  constructor(
    public common: Common, 
    private geolocation: Geolocation, 
    private alertCtrl: AlertController, 
    public weatherProvider:WeatherProvider, 
    public http: Http, 
    public navCtrl : NavController, 
    public navParams: NavParams, 
    public app : App, 
    public authService : AuthService) {
  }


  ionViewWillEnter() {

    var data = JSON.parse(localStorage.getItem('userSystemData'));

    this.userPostData.SystemUserID   = data[0].SystemUserID;
    this.userPostData.apiKey         = data[0].apiKey;
    this.userPostData.UserName       = data[0].Name;
    this.userPostData.Company        = data[0].Company;
    this.userPostData.SystemClientID = data[0].SystemClientID;
    this.userPostData.Email          = data[0].Email;  

    this.userPostData.ProjectID      = localStorage.getItem('CurrentProjectID'); 
    this.userPostData.ProjectName    = localStorage.getItem('CurrentProjectName'); 

    var apiKey  = this.userPostData.apiKey;
    var uid     = this.userPostData.SystemUserID;  
    var pid     = this.userPostData.ProjectID;  
    var pname   = this.userPostData.ProjectName;

    var urld    = Constants.apiUrl+"api/dashboard/"+uid+"/"+pid;
    var urlt3   = Constants.apiUrl+"api/t3/"+apiKey+"/"+uid+"/"+pid;
    var urlt4   = Constants.apiUrl+"api/t4/"+apiKey+"/"+uid+"/"+pid;
    var urlcity = Constants.apiUrl+"api/locationcity/"+pid;


    this.city = "London";
    
    this.http.get(urlcity).map(res => res.json()).subscribe(data => {

      if(data.length > 0 ) {
                                                                                                              
        this.citydataSet = data;
        var temptown = this.citydataSet[0].town;
        if(temptown === null || temptown === undefined){
          this.city = "London";
        } else {
          this.city = temptown;
        }
      }
      this.weatherProvider.getWeather(this.city).subscribe(data => {
        this.weatherCity = data.city.name;
        this.weatherDes  = data.list[0].weather[0].description;
        this.weatherIcon = "https://openweathermap.org/img/w/"+data.list[0].weather[0].icon+".png";
        this.weatherTemp = data.list[0].main.temp - 273;
        this.weatherTemp = Math.round(this.weatherTemp);
      }); 
    },
    err => {
        console.log("Oops! - No Weather Data");
    }
  ); 


    this.http.get(urld).map(res => res.json()).subscribe(data => {
        this.dataSet = data;
        console.log(this.dataSet);
    },
    err => {
        console.log("Oops! - No Dashboard Data");
    }); 


    this.http.get(urlt3).map(res => res.json()).subscribe(data => {
        this.dataSet1 = data;
        console.log(this.dataSet1);
    },
    err => {
        console.log("Oops! - No T3 Data");
    }); 


    this.http.get(urlt4).map(res => res.json()).subscribe(data => {
        this.dataSet2 = data;
        console.log(this.dataSet2);
    },
    err => {
        console.log("Oops! - No T4 Data");
    });   

  }

  openDocumentSummary(days){ 
    this.navCtrl.push(DocumentSummary,{days});
  }

};

