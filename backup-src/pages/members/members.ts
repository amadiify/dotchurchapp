import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { FooterProvider } from '../../providers/footer/footer';
import { Http } from '@angular/http';
import { MyApp } from '../../app/app.component';
import 'rxjs/add/operator/map';
import { MemberinfoPage } from '../memberinfo/memberinfo';
import { DashboardPage } from '../dashboard/dashboard';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-members',
  templateUrl: 'members.html',
})
export class MembersPage {

  footer : any;
  members = [];
  image = MyApp.app_image;
  myapp = MyApp.app_api;
  churchid : any;
  defaultImage : any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public footerCtrl : FooterProvider, public http : Http, 
  public ModalCtrl : ModalController, public storage : Storage) {
    
    this.footer = footerCtrl.footer;
    this.defaultImage = MyApp.defaultImage;
    

    this.storage.get("churchid").then((id)=>{
      this.churchid = id;

      var memberdata = [];

      this.getmembers().subscribe(res => {

          var obj:any = res.trim();
          obj = JSON.parse(obj);

          if (obj.length > 0)
          {
            for(var x in obj)
            {
              memberdata.push(obj[x]);
            }
          }
        

        this.members = memberdata;
      });
    
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

  getmembers()
  {
    return this.http.get( this.myapp + 'members/-w churchid = '+this.churchid ).map(res => res.text());
  }

  getInfo(data) : void
  {
    this.ModalCtrl.create(MemberinfoPage, {data}).present();
  }

  ionViewDidLoad() {
  }

}
