import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FooterProvider } from '../../providers/footer/footer';
import { MyApp } from '../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-memberinfo',
  templateUrl: 'memberinfo.html',
})
export class MemberinfoPage {
  member : any;
  footer : any;
  image = MyApp.app_image;
  avatar : any;
  notempty : boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public footerCtrl : FooterProvider) {
    var data = navParams.get("data");

    var info = [];

    for (var x in data)
    {
      info.push(data[x]);
    }
    this.footer = footerCtrl.footer;

    if (data.avatar != "hello.png")
    {
      this.notempty = true;
      this.avatar = this.image + data.avatar;
    }
    else
    {
      this.avatar = MyApp.defaultImage;
    }

    this.member = data;

  }

  goback()
  {
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
  }

}
