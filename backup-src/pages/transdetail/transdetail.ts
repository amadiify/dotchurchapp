import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import { FooterProvider } from '../../providers/footer/footer';
import { DashboardPage } from '../dashboard/dashboard';

@IonicPage()
@Component({
  selector: 'page-transdetail',
  templateUrl: 'transdetail.html',
})
export class TransdetailPage {

  trans : any;
  footer : any;
  avatar : any;
  image = MyApp.app_image;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public footerCtrl : FooterProvider) {

    var trans = navParams.get("data");
    this.trans = trans;

    if (trans.member.avatar == "hello.png")
    {
      this.avatar = MyApp.defaultImage;
    }
    else
    {
      this.avatar = this.image + trans.member.avatar;
    }
    
    this.footer = footerCtrl.footer;
  }

  ionViewDidLoad() {
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

}
