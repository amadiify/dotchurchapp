import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { FooterProvider } from '../../providers/footer/footer';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { MyApp } from '../../app/app.component';
import { Storage } from '@ionic/storage';
import { SpirometerinfoPage } from '../spirometerinfo/spirometerinfo';

@IonicPage()
@Component({
  selector: 'page-spirometer',
  templateUrl: 'spirometer.html',
})
export class SpirometerPage {
  footer : any;
  memberid = 1;
  programs : any;
  avatar : string;
  image = MyApp.app_image;
  churchid : any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public footerCtrl : FooterProvider, public http : Http, 
    private storage : Storage, public modalCtrl : ModalController,
  public loader : LoadingController) {
    this.footer = footerCtrl.footer;

    this.storage.get("user").then((res)=>{
      console.log(res);

      this.memberid = res.memberid;

      if (res.avatar == "hello.png")
      {
        this.avatar = MyApp.defaultImage;
      }
      else
      {
        this.avatar = this.image + res.avatar;
      }
      
    });

    this.storage.get("churchid").then((id)=>{
      this.churchid = id;

      this.getPrograms().subscribe(res => {
        
        var data = [];

        for(var x in res)
        {
          if (typeof(x) != 'object')
          {
             data[0] = res;
          }
          else
          {
            data = res;
          }
        }

        this.programs = data;
      });
      
    });
    
   
  }

  ionViewDidLoad() {
    // var ctx = document.getElementById("chart_area");
    // ctx = ctx.getContext('2d');

    // var chart_area = new Chart(ctx, this.chart());
  }

  loadstatistic(program)
  {
    this.loader.create({
      content: "Please wait...",
      duration: 2000,
      dismissOnPageChange: true,
      enableBackdropDismiss: true
    }).present();

    var avatar = this.avatar;

    this.getattended(program.program).subscribe(res => {
      var present = 0;
      var absent = 4;

      if (res.memberid)
      {
        present = 1;
        absent = 3;
      }
      else
      {
        if (res.length > 0)
        {
          present = res.length;
          absent = absent - present;
        }
      }

      

      this.modalCtrl.create(SpirometerinfoPage, {program, present, absent, avatar}).present();
    }, error => {

    });
    
  }

  getPrograms()
  {
    return this.http.get( MyApp.app_api + 'programs/-w churchid = '+this.churchid).map(res => JSON.parse(res.text().trim()));
  }

  getattended(program)
  {
    var query = MyApp.app_api + 'attendance/-w memberid = '+ this.memberid + " and program = '"+program+"'";
    return this.http.get(query).map(res => JSON.parse(res.text().trim()));
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
