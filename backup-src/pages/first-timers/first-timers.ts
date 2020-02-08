import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FooterProvider } from '../../providers/footer/footer';
import { DashboardPage } from '../dashboard/dashboard';
import { Http } from '@angular/http';
import { MyApp } from '../../app/app.component';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-first-timers',
  templateUrl: 'first-timers.html',
})
export class FirstTimersPage {

  footer : any;
  data : any;
  logo : string;
  avatar : any;
  churchid : any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public footerCtrl : FooterProvider, private http: Http, public loader : LoadingController,
    public alertCtrl : AlertController, private storage : Storage) {
    this.data = new Function();  
    this.footer = this.footerCtrl.footer;
    this.logo = 'assets/imgs/logoe.png';

    this.storage.get("user").then( (row) => {
      if (row !== null)
      {
        if (row.avatar != "hello.png")
        {
          this.avatar = row.avatar;
        }
        else
        {
          this.avatar = MyApp.defaultImage;
        }
       
      }
   });

   this.storage.get("churchid").then((id)=>{
    this.churchid = id;
  });
  
  }

  ionViewDidLoad() {
    console.log('');
  }

  register(data)
  {
    if("fullname" in data)
    {
        var formdata = new FormData;

        for(var x in data)
        {
          formdata.append("firsttimer["+x+"]", data[x]);
          data[x] = "";
        }

        let loading = this.loader.create({
          content: "Adding first timer..",
          duration: 40000,
          dismissOnPageChange: true
        });

        loading.present();

        this.http.post( MyApp.sermon_api + 'firstTimer/'+this.churchid, formdata).map(res => res.json())
        .
        subscribe(res => {
            if(res.status == 'success')
            {
              loading.dismiss();
              
              this.alertCtrl.create({
                title: data.fullname + " added",
                subTitle: "Data saved successfully. ",
                buttons: [
                  {
                    text: 'Ok',
                    role: 'continue',
                    handler : () => {
                      this.data = new Function();
                      data = "";
                    }
                    
                  }
                ]
              }).present();

              this.navCtrl.setRoot(this.navCtrl.getActive().component);
            }
        }, error => {
          this.alertCtrl.create({
            title: "Something went wrong!",
            subTitle: "Check your internet connectivity",
            buttons: ['Ok']
        }).present();

          loading.dismiss();
        }); 
    }
    else
    {
      this.alertCtrl.create({
          title: "Missing data",
          subTitle: "Fullname is required",
          buttons: ['Ok']
      }).present();
    }
  }

  goback(){
    this.navCtrl.setRoot(DashboardPage);
  }

}
