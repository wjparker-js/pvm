import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class WeatherProvider {

  apiKey: any;
  url: any;

  constructor(public http: Http) {
    this.apiKey = "c6ef55c91cd0eb97383abf69248d2b7f";
    this.url    = "https://api.openweathermap.org/data/2.5/weather?appid="+this.apiKey+"&q="; 
    console.log('Hello WeatherProvider Provider');
  }

  getWeather(city){
    console.log('Getting Weather for a city');
  	return  this.http.get(this.url+city+",gb").map(res => res.json());
  }

  getWeathercoords(lat,long){
  	console.log('Getting Weather using coordinates');
  	return  this.http.get(this.url+"&lat="+lat+"&lon="+long).map(res => res.json());
  }
}

