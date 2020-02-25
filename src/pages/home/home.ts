import {Component, ViewChild, ElementRef} from '@angular/core';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
import {IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import {App, AlertController} from 'ionic-angular';
import {AuthService} from "../../providers/auth-service";
import {Common} from "../../providers/common";
import {Http} from '@angular/http';
import {DocumentSummary} from '../documentsummary/documentsummary';
import {DefectsviewPage} from '../defectsview/defectsview';
import {WeatherProvider} from '../../providers/weather/weather';
import { Geolocation } from '@ionic-native/geolocation';
import * as Constants from '../../providers/constants';

@Component({
  selector: 'page-home', 
  templateUrl: 'home.html'
})

export class HomePage {

  public userDetails : any;
  public resposeData : any;
  public PA5039 : any;
  public avatardata: any;
  public dataSet : any;
  public dataSetT5 : any;
  public dataSet1 : any;
  public dataSet2 : any;
  public citydataSet: any;
  public weather:any;
  public city: string = "";
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

  geoLatitude: number;
  geoLongitude: number;
  geoAccuracy:number;
  geoAddress: string;
 
  watchLocationUpdates:any; 
  loading:any;
  isWatching:boolean;
  thumb:any;
 
  //Geocoder configuration
  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };

  constructor(
    public common: Common, 
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private alertCtrl: AlertController, 
    public weatherProvider:WeatherProvider, 
    public http: Http, 
    public navCtrl : NavController, 
    public menu: MenuController,
    public navParams: NavParams, 
    public app : App, 
    public authService : AuthService) {
  }

  ionViewWillEnter() {

    this.menu.enable(true); 
    //this.getGeolocation();
    this.sleep(1000);

    var data = JSON.parse(localStorage.getItem('userSystemData'));

    this.userPostData.SystemUserID   = data[0].SystemUserID;
    this.userPostData.apiKey         = data[0].apiKey;
    this.userPostData.UserName       = data[0].Name;
    this.userPostData.Company        = data[0].Company;
    this.userPostData.SystemClientID = data[0].SystemClientID;
    this.userPostData.Email          = data[0].Email;  
    this.userPostData.ProjectID      = localStorage.getItem('CurrentProjectID'); 
    this.userPostData.ProjectName    = localStorage.getItem('CurrentProjectName');     
    this.PA5039                      = localStorage.getItem('Role-PA5039');  

    this.thumb =  'https://go.projectvaultuk.com/publiclogos/'+this.userPostData.ProjectID+'.png'; 
    
    var apiKey  = this.userPostData.apiKey;
    var uid     = this.userPostData.SystemUserID;  
    var pid     = this.userPostData.ProjectID;  
    var pname   = this.userPostData.ProjectName;

    var urld    = Constants.apiUrl+"api/dashboard/"+uid+"/"+pid;
    var urlt3   = Constants.apiUrl+"api/t3/"+apiKey+"/"+uid+"/"+pid;
    var urlt4   = Constants.apiUrl+"api/t4/"+apiKey+"/"+uid+"/"+pid;
    var urlt5   = Constants.apiUrl+"api/t5/"+apiKey+"/"+uid+"/"+pid;
    var urlcity = Constants.apiUrl+"api/locationcity/"+pid;

    //this.watchLocation();

    this.city = "London";

    this.http.get(urlcity).map(res => res.json()).subscribe(data => {

    if(data.length > 0 ) {     

      this.citydataSet = data;
      console.log("City Data: ",this.citydataSet);
      this.city = this.citydataSet["0"].Town;

    }
      
    /*this.weatherProvider.getWeathercoords(this.geoLatitude,this.geoLongitude).subscribe(data => {
      this.weatherCity = data.name;
      this.weatherDes  = data.weather[0].description;
      this.weatherIcon = "https://openweathermap.org/img/w/"+data.weather[0].icon+".png";
      this.weatherTemp = data.main.temp - 273;
      this.weatherTemp = Math.round(this.weatherTemp);
    */


    this.weatherProvider.getWeather(this.city).subscribe(data => {
      this.weatherCity = data.name;
      this.weatherDes  = data.weather[0].description;
      this.weatherIcon = "https://openweathermap.org/img/w/"+data.weather[0].icon+".png";
      this.weatherTemp = data.main.temp - 273;
      this.weatherTemp = Math.round(this.weatherTemp);
    }); 
    },err => {
        console.log("Oops! - No Weather Data");
    }
  ); 


    this.http.get(urld).map(res => res.json()).subscribe(data => {
      this.dataSet = data;
      },err => {
          console.log("Oops! - No Dashboard Data");
      }
    ); 


    this.http.get(urlt5).map(res => res.json()).subscribe(data => {
        this.dataSetT5 = data;
        console.log("T5 Data",this.dataSetT5);
        },err => {
            console.log("Oops! - T5 Data");
        }
      ); 
      
      
    this.http.get(urlt3).map(res => res.json()).subscribe(data => {
      this.dataSet1 = data;
      },err => {
        console.log("Oops! - No T3 Data");
      }
    ); 

    this.http.get(urlt4).map(res => res.json()).subscribe(data => {
      this.dataSet2 = data;
      },
      err => {
          console.log("Oops! - No T4 Data");
      }
    );   

  }
  

  openDocumentSummary(days){ 
    this.navCtrl.push(DocumentSummary,{days});
  }

  openDefectsSummary(status){
    console.log("Status:",status);
    this.navCtrl.push(DefectsviewPage,{status});
  }

   //Get current coordinates of device
   public getGeolocation(){
    this.geolocation.getCurrentPosition().then((resp) => {
      this.geoLatitude = resp.coords.latitude;
      this.geoLongitude = resp.coords.longitude; 
      this.geoAccuracy = resp.coords.accuracy; 
      this.getGeoencoder(this.geoLatitude,this.geoLongitude);
     }).catch((error) => {
       alert('Error getting location'+ JSON.stringify(error));
     });
  }

  //geocoder method to fetch address from coordinates passed as arguments
  public getGeoencoder(latitude,longitude){
    this.nativeGeocoder.reverseGeocode(latitude, longitude, this.geoencoderOptions)
    .then((result: NativeGeocoderReverseResult[]) => {
      this.geoAddress = this.generateAddress(result[0]);
      console.log(this.geoAddress);
    })
    .catch((error: any) => {
      alert('Error getting location'+ JSON.stringify(error));
    });
  }

  //Return Comma saperated address
  public generateAddress(addressObj){
      let obj = [];
      let address = "";
      for (let key in addressObj) {
        obj.push(addressObj[key]);
      }
      obj.reverse();
      for (let val in obj) {
        if(obj[val].length)
        address += obj[val]+', ';
      }
    return address.slice(0, -2);
  }


  //Start location update watch
  public watchLocation(){
    this.isWatching = true;
    this.watchLocationUpdates = this.geolocation.watchPosition();
    this.watchLocationUpdates.subscribe((resp) => {
      this.geoLatitude = resp.coords.latitude;
      this.geoLongitude = resp.coords.longitude; 
      this.getGeoencoder(this.geoLatitude,this.geoLongitude);
    });
  }


  //Stop location update watch
  public stopLocationWatch(){
    this.isWatching = false;
    this.watchLocationUpdates.unsubscribe();
  }


  sleep(miliseconds) {
    var currentTime = new Date().getTime(); 
    while (currentTime + miliseconds >= new Date().getTime()) {
    }
  }  

};

