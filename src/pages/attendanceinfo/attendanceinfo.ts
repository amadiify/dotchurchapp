import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FooterProvider } from '../../providers/footer/footer';
import { DashboardPage } from '../dashboard/dashboard';

@IonicPage()
@Component({
  selector: 'page-attendanceinfo',
  templateUrl: 'attendanceinfo.html',
})
export class AttendanceinfoPage {

  footer : any;
  info : any;
  program : string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public footerCtrl : FooterProvider) {
    
    this.footer = this.footerCtrl.footer;
    this.program = this.navParams.get('program');
    this.info = this.navParams.get('info');

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
