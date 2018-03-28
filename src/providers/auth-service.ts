import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as Constants from './constants';

@Injectable()

export class AuthService {

  constructor(public http: Http) {
    console.log('Hello AuthService Provider');
  }

  getData(credentials){
    var creds = "api/users/"+credentials.id+"/"+credentials.password;
    return new Promise((resolve, reject) =>{
      this.http.get(Constants.apiUrl+creds).
      subscribe(res =>{
        resolve(res.json());
      }, (err) =>{
        reject(err);
      });     
    });
  }

}
