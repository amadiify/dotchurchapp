import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';

@IonicPage()
@Component({
  selector: 'page-loginpin',
  templateUrl: 'loginpin.html',
})
export class LoginpinPage {

  logo : any;
  user : any = {};
  pin : any = null;
  res : any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public alertctrl : AlertController) {
    this.logo = 'assets/imgs/logoe.png';
    this.user = this.navParams.get('data');
    this.res = this.navParams.get('res');
    this.pin = this.navParams.get('pin');
  }

  checkpin()
  {
    var pin = this.user.pin;

    if (pin == this.pin)
    {
        // valid
        var res = this.res;
        this.navCtrl.push(DashboardPage,{res});
    }
    else
    {
       this.alertctrl.create({
          title : "Invalid pin",
          subTitle: "Pin provided doesn't match account. Please try again.",
          buttons : ['Ok']
       }).present();

       this.user.pin = "";
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginpinPage');
  }

}
