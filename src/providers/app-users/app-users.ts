import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { userlogin } from '../../models/userLogin';
import { MyApp } from '../../app/app.component';

@Injectable()
export class AppUsers {
  
  app_api = MyApp.app_api;
  app_image = MyApp.app_image;


  constructor(public http: Http) {
  }

  loadAll(): Observable<userlogin[]>{
    return this.http.get( this.app_api ).map(
      res => <userlogin[]>JSON.parse(res.text().trim())
    )
  }

  validUser(username:string, password:string):any{
    var query:string = "login?username="+username+"&password="+password+"&activated=1";
    var buildQuery = MyApp.sermon_api + query;

    var response:any = this.http.get( buildQuery ).map( res => 
      <userlogin[]>res.json());
  
    return response;
  }

  userinfo(userid: Number)
  {
    var query:string = "membersInfo/"+userid;
    var buildQuery = MyApp.sermon_api + query;

    var response:any = this.http.get( buildQuery ).map( res => <userlogin[]>JSON.parse(res.text().trim()))
    return response;
  }

  navigation(role){
    var query:string = "navigation/-w role='"+role+"' -o position asc";
    var buildQuery = this.app_api + query;

    var response:any = this.http.get( buildQuery ).map( res => <userlogin[]>JSON.parse(res.text().trim()));
    return response;
  }

}
