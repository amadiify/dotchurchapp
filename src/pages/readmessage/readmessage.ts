import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FooterProvider } from '../../providers/footer/footer';
import { MyApp } from '../../app/app.component';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-readmessage',
  templateUrl: 'readmessage.html',
})
export class ReadmessagePage {

  message : any;
  footer : any;
  image = MyApp.app_image;
  avatar : any;
  defaultimage = "";

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private storage : Storage,
    public footerCtrl : FooterProvider) {
    this.message = navParams.get("message");
    this.footer = footerCtrl.footer;

    this.storage.get("user").then((data) => {

      this.defaultimage = '../assets/imgs/men3.jpg';
      if (data.avatar == "hello.png")
      {
        this.avatar = MyApp.defaultImage;
      }
      else{
        this.avatar = this.image + data.avatar;
      }

    });
  }

  ionViewDidLoad() {}

  goback(){
    this.navCtrl.pop();
  }

}
