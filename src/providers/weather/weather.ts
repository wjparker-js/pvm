import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';


@Injectable()
export class WeatherProvider {

  apiKey: any;
  url: any;

  constructor(public http: Http) {
    this.apiKey = "c6ef55c91cd0eb97383abf69248d2b7f";
    this.url    = "https://api.openweathermap.org/data/2.5/forecast?APPID="+this.apiKey+"&q="; 
    console.log('Hello WeatherProvider Provider');
  }


  getWeather(city){
  	console.log('Getting Weather');
  	return  this.http.get(this.url+city+",uk").map(res => res.json());
  }

}

