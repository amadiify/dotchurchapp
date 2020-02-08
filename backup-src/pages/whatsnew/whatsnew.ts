import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import { Http } from '@angular/http';
import { FooterProvider } from '../../providers/footer/footer';
import { DashboardPage } from '../dashboard/dashboard';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-whatsnew',
  templateUrl: 'whatsnew.html',
})
export class WhatsnewPage {

  empty : any;
  footer : any;
  image = MyApp.app_image;
  avatar : any;
  articles : any;
  churchid : any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public storage : Storage,
    public http : Http,
    public alertCtrl : AlertController,
    public footerCtrl : FooterProvider) {

    storage.get("user").then((res) => {

      if (res.avatar == "hello.png")
      {
        this.avatar = MyApp.defaultImage;
      }
      else
      {
        this.avatar = this.image + res.avatar;
      }
      
    });

    this.footer = footerCtrl.footer;

    this.storage.get("churchid").then((id)=>{
      this.churchid = id;
      
      this.reload();
      
    });
   

  }

  reload()
  {
    this.loadAll().subscribe(res => {
      if(typeof res == "object" && res.status == "empty")
      {
        this.empty = true;
      }
      else
      {
        this.empty = false;

        var data = [];

        for(var x in res)
        {
          if(typeof res[x] == "object")
          {
            data.push(res[x]);
          }
        }

        this.articles = data;
      }
    }, error => {
      this.empty = true;
    });
  }

  goback()
  {
    if(this.navCtrl.canGoBack() == true)
    {
      this.navCtrl.pop();
    }
    else
    {
      this.navCtrl.insert(0, DashboardPage);
      this.navCtrl.pop();
    }
  }

  loadAll()
  {
    return this.http.get(MyApp.sermon_api + 'articles/all/'+this.churchid).map(res => res.json());
  }

  ionViewDidLoad() {

  }

}
