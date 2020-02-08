import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { MyApp } from '../../app/app.component';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

@Injectable()
export class SermonsProvider {

  app_api = MyApp.app_api;
  app_image = MyApp.app_image;
  static user_details = [];
  churchid : any;

  constructor(public http: Http, public storage : Storage) {
    this.storage.get("churchid").then((id)=>{
      this.churchid = id;
    });
  }

  loadAll(id){
    return this.http.get( MyApp.sermon_api + 'allsermons/'+id ).map(
      res => JSON.parse(res.text().trim()) );
  }

  getDetails(id: any){
    let checkDetail = this.http.get( this.app_api + 'members/-w memberid = '+ id).map(res => res.text().trim());
    return checkDetail;
  } 

  getUsers(data:any, field:string){
    var _field = data[field];
    return this.getDetails(_field);
  }



}
