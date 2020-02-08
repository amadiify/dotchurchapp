import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { pastorModel } from '../../models/pastorsModel';
import { MyApp } from '../../app/app.component';
import { Sermons } from '../../models/_sermons';
import { Storage } from '@ionic/storage';

@Injectable()
export class PastorsProvider {

  churchid : any;

  constructor(public http: Http, public storage : Storage) {
    this.storage.get("churchid").then((id)=>{
      this.churchid = id;
    });
  }

  loadAll(id): Observable<pastorModel[]>{
    return this.http.get( MyApp.app_api + "members/-w role = 'pastor' and churchid = "+id).map(
      res => <pastorModel[]>JSON.parse(res.text().trim())
    )
  }

  loadMessages(id: Number): Observable<Sermons[]>{
    return this.http.get( MyApp.app_api + "sermons/-w memberid = " + id + " order by sermonid desc limit 0,20").map( 
      res => <Sermons[]>JSON.parse(res.text().trim()) );
  } 

}
