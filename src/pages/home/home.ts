import {Component, ViewChild, ElementRef} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {App, AlertController} from 'ionic-angular';
import {AuthService} from "../../providers/auth-service";
import {Common} from "../../providers/common";
import {Http} from '@angular/http';
import {DocumentSummary} from '../documentsummary/documentsummary';
import * as Constants from '../../providers/constants';
import {WeatherProvider} from '../../providers/weather/weather';
import { Geolocation } from '@ionic-native/geolocation/ngx';

//declare var google: any;

@Component({
  selector: 'page-home', 
  templateUrl: 'home.html'
})

export class HomePage {

 // @ViewChild('map') mapRef: ElementRef;

  //public map: any;
  public userDetails : any;
  public resposeData : any;
  public avatardata: any;
  public dataSet : any;
  public dataSet1 : any;
  public dataSet2 : any;

  weather:any;

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

  ionViewDidLoad() {
    //console.log(this.mapRef);
    //this.showMap();
  }

/*
  showMap(){
    const location = new google.maps.LatLng(51.5209815,0.2083337);
    const options = {center: location,zoom:18};
    this.map = new google.maps.Map(this.mapRef.nativeElement,options);
  }
*/
  

  ionViewWillEnter() {

    this.city = "Rainham";

    this.weatherProvider.getWeather(this.city).subscribe(data => {
      //console.log(data.list[0]);
      this.weatherCity = data.city.name;
      this.weatherDes  = data.list[0].weather[0].description;
      this.weatherIcon = "http://openweathermap.org/img/w/"+data.list[0].weather[0].icon+".png";
      this.weatherTemp = data.list[0].main.temp - 273;
      this.weatherTemp = Math.round(this.weatherTemp);
      //thia.weatherTemp_Min = data.list[0].main.temp_min -273;
      //thia.weatherTemp_Max = data.list[0].main.temp_max -273;
    });

    //var weatherData = JSON.parse(this.weather);

    //console.log(this.weatherCity);

    //{this.weather = weather.city;}
    
    /*this.weatherCity = this.weather.city.name;
    this.weatherDes  = this.weather.list[0].weather[0].description;
    this.weatherIcon = "http://openweathermap.org/img/w/"+this.weather.list[0].weather[0].icon+".png";
    thia.weatherTemp = this.weather.list[0].main.temp - 273;
    thia.weatherTemp_Min = this.weather.list[0].main.temp_min -273;
    thia.weatherTemp_Max = this.weather.list[0].main.temp_max -273;*/


    var data = JSON.parse(localStorage.getItem('userSystemData'));

    this.userPostData.SystemUserID   = data[0].SystemUserID;
    this.userPostData.apiKey         = data[0].apiKey;
    this.userPostData.UserName       = data[0].Name;
    this.userPostData.Company        = data[0].Company;
    this.userPostData.SystemClientID = data[0].SystemClientID;
    this.userPostData.Email          = data[0].Email;  
    this.userPostData.ProjectID      = localStorage.getItem('CurrentProjectID'); 
    this.userPostData.ProjectName    = localStorage.getItem('CurrentProjectName'); 
    this.avatardata     = localStorage.getItem('avatar'); 

    var apiKey = this.userPostData.apiKey;
    var uid   = this.userPostData.SystemUserID;  
    var pid   = this.userPostData.ProjectID;  
    var pname = this.userPostData.ProjectName;
    var avatar= "../assets/imgs/user.png";
    var days;

    var avatarid = Constants.apiUrl+"api/avatar/"+uid;
    var urld   = Constants.apiUrl+"api/dashboard/"+uid+"/"+pid;
    var urlt3  = Constants.apiUrl+"api/t3/"+apiKey+"/"+uid+"/"+pid;
    var urlt4  = Constants.apiUrl+"api/t4/"+apiKey+"/"+uid+"/"+pid;

  
    /*
        this.http.get(avatarid).map(res => res.json()).subscribe(data => {
          this.avatardata = data;
          avatar = this.avatardata;
          console.log("Avatar = " + avatar);
          localStorage.setItem('avatar', this.avatardata);
      },
      err => {
          this.avatardata = "https://go.projectvaultuk.com/PublicPics/avatar.png";
          console.log("Avatar = https://go.projectvaultuk.com/PublicPics/avatar.png");
          localStorage.setItem('avatar', "https://go.projectvaultuk.com/PublicPics/avatar.png");
      }

    ); */


    this.http.get(urld).map(res => res.json()).subscribe(data => {
          this.dataSet = data;
          console.log(this.dataSet);
      },
      err => {
          console.log("Oops!");
      }

    ); 

    this.http.get(urlt3).map(res => res.json()).subscribe(data => {
          this.dataSet1 = data;
          console.log(this.dataSet1);
      },
      err => {
          console.log("Oops!");
      }

    ); 

    this.http.get(urlt4).map(res => res.json()).subscribe(data => {
          this.dataSet2 = data;
          console.log(this.dataSet2);
      },
      err => {
          console.log("Oops!");
      }

    );   

  }

  openDocumentSummary(days){ 
    this.navCtrl.push(DocumentSummary,{days});
  }

  showAcc(){
    console.log("Clicked");
  }

};

