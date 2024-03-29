import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FooterProvider } from '../../providers/footer/footer';
import { MyApp } from '../../app/app.component';
import { Storage } from '@ionic/storage';
import { DashboardPage } from '../dashboard/dashboard';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { TransdetailPage } from '../transdetail/transdetail';

@IonicPage()
@Component({
  selector: 'page-titheoffering',
  templateUrl: 'titheoffering.html',
})
export class TitheofferingPage {

  footer : any;
  avatar : any;
  image = MyApp.app_image;
  defaultimage : string;
  transactions : any;
  churchid : any;
  loaded : boolean;
  total : number = 0;
  offering : number = 0;
  tithe : number = 0;
  donation : number = 0;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public footerCtrl : FooterProvider,
    private storage : Storage,
    public http : Http) {
    this.footer = footerCtrl.footer;
    this.loaded = false;

    this.storage.get("user").then((row) => {
    
      this.defaultimage = '../assets/imgs/men3.jpg';
      if (row.avatar == "hello.png")
      {
        this.avatar = MyApp.defaultImage;
      }
      else{
        this.avatar = this.image + row.avatar;
      }

    });

    this.storage.get("churchid").then((id)=>{
      this.churchid = id;

      this.loadAll().subscribe(res => {
        this.loaded = true;
        this.transactions = res;

        for (var x in res)
        {
            switch (res[x].givingtype)
            {
              case 'tithe':
                  this.tithe += Number(res[x].amount);
              break;

              case 'offering':
                  this.offering += Number(res[x].amount);
              break;

              case 'gift':
              case 'donation':
                  this.donation += Number(res[x].amount);
              break;
            }
           this.total += Number(res[x].amount);
        }
      });
      
    });

   

  }

  loadAll()
  {
    return this.http.get( MyApp.sermon_api + 'allgivers/'+this.churchid ).map(res => res.json() );
  }

  details(data)
  {
    this.navCtrl.push(TransdetailPage, {data});
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

  ionViewDidLoad() {
  }

}
